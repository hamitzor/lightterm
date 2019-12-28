const controlSequenceKind = require('./control-sequence-kinds')

const COLOR_CODES = [30, 31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97]
const BACKGROUND_COLOR_CODES = [40, 41, 42, 43, 44, 45, 46, 47, 100, 101, 102, 103, 104, 105, 106, 107]
const RESET_CODES = [400, 401, 402, 403, 404, 405]

class OutputParser {
   constructor({ context }) {
      this._context = context
   }

   extractSequences(str) {
      console.log({ str: str.toString() })
      let { cleanStr, OSCommandSequences } = this.extractOSCommandSequences(str)
      let styleSequencesRes = this.extractStyleSequences(cleanStr)
      cleanStr = styleSequencesRes.cleanStr
      let styleSequences = styleSequencesRes.styleSequences

      let cursorSequencesRes = this.extractCursorSequences(cleanStr)
      cleanStr = cursorSequencesRes.cleanStr
      let cursorSequences = cursorSequencesRes.cursorSequences
      return { cleanStr, styleSequences, OSCommandSequences, cursorSequences }
   }

   extractCursorSequences(str) {
      const cursorSequences = []
      let match
      let cleanStr = str

      //@TODO handle \r to return to the beginning of the line

      do {
         match = new RegExp(/\x08/gmiu).exec(cleanStr)
         if (match) {
            cursorSequences.push([controlSequenceKind.CURSOR_LEFT, match.index])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      do {
         match = new RegExp(/\u001b\[(\d*)K/gmiu).exec(cleanStr)
         if (match) {
            cursorSequences.push([controlSequenceKind.REMOVE_FROM_CURSOR_TO_LINE_END, match.index, match[1]])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      do {
         match = new RegExp(/\u001b\[(\d*)C/gmiu).exec(cleanStr)
         if (match) {
            cursorSequences.push([controlSequenceKind.CURSOR_RIGHT, match.index, match[1]])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      do {
         match = new RegExp(/\u001b\[(\d*)J/gmiu).exec(cleanStr)
         if (match) {
            cursorSequences.push([controlSequenceKind.REMOVE_FROM_CURSOR_TO_END, match.index, match[1]])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      do {
         match = new RegExp(/\u001b\[H/gmiu).exec(cleanStr)
         if (match) {
            cursorSequences.push([controlSequenceKind.CURSOR_HOME, match.index])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      return { cleanStr, cursorSequences }
   }

   extractOSCommandSequences(str) {
      const OSCommandSequences = []
      let match
      let cleanStr = str

      do {
         match = new RegExp(/\u001b\]0;(.*)\u0007/gmiu).exec(cleanStr)
         if (match) {
            OSCommandSequences.push([controlSequenceKind.CHANGE_WINDOW_TITLE_ESCAPE, match[1]])
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)

      return { cleanStr, OSCommandSequences }
   }

   extractStyleSequences(str) {
      const styleSequences = []
      let match
      let cleanStr = str

      do {
         match = new RegExp(/\u001b\[(\d*)(?:;?(\d*))*m/gmiu).exec(cleanStr)
         if (match) {
            const styleCodes = []
            for (let i = 1; i < match.length; i++) {
               if (match[i]) {
                  if (parseInt(match[i]) === 0) {
                     [400, 401, 402, 403, 404, 405].forEach(code => styleCodes.push(code))
                  }
                  else {
                     styleCodes.push(parseInt(match[i]))
                  }
               }
            }

            for (let j = 0; j < str.length; j++) {
               if (j >= match.index) {
                  if (styleSequences[j] === undefined) {
                     styleSequences[j] = []
                  }

                  styleCodes.forEach(code => {
                     if (code === 1) {
                        styleSequences[j][0] = code
                     }
                     else if (code === 3) {
                        styleSequences[j][1] = code
                     }
                     else if (code === 4) {
                        styleSequences[j][2] = code
                     }
                     else if (COLOR_CODES.includes(code)) {
                        styleSequences[j][3] = code
                     }
                     else if (BACKGROUND_COLOR_CODES.includes(code)) {
                        styleSequences[j][4] = code
                     }
                     else if (RESET_CODES.includes(code)) {
                        styleSequences[j][0] = 401
                        styleSequences[j][1] = 402
                        styleSequences[j][2] = 403
                        styleSequences[j][3] = 400
                        styleSequences[j][4] = 405
                     }
                     else {

                     }
                  })
               }
            }
            cleanStr = cleanStr.replace(match[0], '')
         }
      } while (match)


      const shrinkedStyledSequences = []
      for (let i = 0; i < cleanStr.length; i++) {
         shrinkedStyledSequences[i] = styleSequences[i]
      }

      return { cleanStr, styleSequences: shrinkedStyledSequences }
   }

   parse(output) {

      const maxCol = this._context.getColNumber()
      const maxRow = this._context.getRowNumber()

      const { cleanStr, styleSequences, OSCommandSequences, cursorSequences } = this.extractSequences(output)

      this._context.setOSCommandData([...this._context.getOSCommandData(), ...OSCommandSequences])

      for (let i = 0; i < cursorSequences.length; i++) {
         switch (cursorSequences[i][0]) {
            case controlSequenceKind.CURSOR_HOME:
               console.log('CURSOR HOME')
               this._context.setCursorY(0)
               this._context.setCursorX(0)
               break
            case controlSequenceKind.CURSOR_RIGHT:
               console.log('CURSOR ONE RIGHT', cursorSequences[i][2])
               this._context.setCursorY(this._context.getCursorY() + 1)
               break
            case controlSequenceKind.CURSOR_LEFT:
               console.log('CURSOR ONE LEFT')
               this._context.setCursorY(this._context.getCursorY() - 1)
               break
            case controlSequenceKind.REMOVE_FROM_CURSOR_TO_LINE_END:
               console.log('REMOVE TO THE END OF THE LINE', cursorSequences[i][2])
               this._context.removeFromCursorToLineEnd(this._context.getCursorX())
               break
            case controlSequenceKind.REMOVE_FROM_CURSOR_TO_END:
               console.log('REMOVE TO THE END OF THE PAGE', cursorSequences[i][2])
               if (cursorSequences[i][2] === '0') {
                  this._context.removeFromCursorToEnd()
               }
               else if (cursorSequences[i][2] === '1') {
                  this._context.removeFromCursorToBeginnig()
               }
               else if (cursorSequences[i][2] === '2') {
                  console.log('REMOVING ALL')
                  this._context.removeAll()
               }
               break
         }
      }

      for (let i = 0; i < cleanStr.length; i++) {
         this._context.setStyleData(this._context.getCursorX(), this._context.getCursorY(), styleSequences[i])
         this._context.set(this._context.getCursorX(), this._context.getCursorY(), cleanStr[i])

         if (cleanStr[i] === '\n') {
            if (this._context.getCursorX() + 1 > maxRow - 1) {
               this._context.shiftContent(1)
            }
            else {
               this._context.setCursorX(this._context.getCursorX() + 1)
            }
            this._context.setCursorY(0)
         }
         else {
            if (this._context.getCursorY() + 1 > maxCol - 1) {
               if (this._context.getCursorX() + 1 > maxRow - 1) {
                  this._context.shiftContent(1)
               }
               else {
                  this._context.setCursorX(this._context.getCursorX() + 1)
               }
               this._context.setCursorY(0)
            }
            else {
               this._context.setCursorY(this._context.getCursorY() + 1)
            }
         }
      }

   }
}

module.exports = OutputParser