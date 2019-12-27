const controlSequenceKind = require('./control-sequence-kinds')

const COLOR_CODES = [30, 31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97]
const BACKGROUND_COLOR_CODES = [40, 41, 42, 43, 44, 45, 46, 47, 100, 101, 102, 103, 104, 105, 106, 107]
const RESET_CODES = [400, 401, 402, 403, 404, 405]

class OutputParser {
   constructor({ context }) {
      this._context = context
   }

   extractSequences(str) {
      let { cleanStr, OSCommandSequences } = this.extractOSCommandSequences(str)
      let styleSequencesRes = this.extractStyleSequences(cleanStr)
      cleanStr = styleSequencesRes.cleanStr
      let styleSequences = styleSequencesRes.styleSequences

      return { cleanStr, styleSequences, OSCommandSequences }
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

      output = output.replace(/\r\n/gmiu, '\n')
      output = output.replace(/\r/gmiu, '\n')

      const { cleanStr, styleSequences, OSCommandSequences } = this.extractSequences(output)

      this._context.setOSCommandData([...this._context.getOSCommandData(), ...OSCommandSequences])

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