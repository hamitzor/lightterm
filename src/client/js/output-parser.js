const util = require('./util')

const COLOR_CODES = [30, 31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97]
const BACKGROUND_COLOR_CODES = [40, 41, 42, 43, 44, 45, 46, 47, 100, 101, 102, 103, 104, 105, 106, 107]
const RESET_CODES = [400, 401, 402, 403, 404, 405]

class OutputParser {
   constructor({ context }) {
      this._context = context
   }

   parse(output) {
      const maxCol = this._context.getColNumber()
      const maxRow = this._context.getRowNumber()
      let symbol = ''
      let specialSymbol = false
      let osc = false
      let oscValue = ''
      let globalStyleCodes = []
      for (let i = 0; i < output.length; i++) {
         if (osc) {
            oscValue = oscValue + output[i]
         }
         if (specialSymbol) {
            symbol = symbol + output[i]
         }
         else {
            symbol = output[i]
         }

         //Operating System Call ended
         if (osc && symbol === '\u0007') {
            osc = false
            const value = oscValue.slice(0, -1)
            util.log('OSC ', value)
            this._context.issueWindowCommand(['update-title', value])
            continue
         }

         if (symbol === '\u001b') {
            specialSymbol = true
         }

         if (specialSymbol) {
            let match

            //Operating System Call starts
            if (match = new RegExp(/^\u001b\]0;$/gmu).exec(symbol)) {
               osc = true
               specialSymbol = false
               oscValue = ''
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)(?:;?(\d*))*m$/gmu).exec(symbol)) {
               match.shift()
               let styleCodes = match.filter(m => m !== undefined).map(m => parseInt(m))
               for (let i = 0; i < styleCodes.length; i++) {
                  if (styleCodes[i] === 0) {
                     styleCodes.splice(i, 1)
                     styleCodes = [...styleCodes, 400, 401, 402, 403, 404, 405]
                  }
               }
               styleCodes.forEach(code => {
                  if (code === 1) {
                     globalStyleCodes[0] = code
                  }
                  else if (code === 3) {
                     globalStyleCodes[1] = code
                  }
                  else if (code === 4) {
                     globalStyleCodes[2] = code
                  }
                  else if (COLOR_CODES.includes(code)) {
                     globalStyleCodes[3] = code
                  }
                  else if (BACKGROUND_COLOR_CODES.includes(code)) {
                     globalStyleCodes[4] = code
                  }
                  else if (RESET_CODES.includes(code)) {
                     globalStyleCodes[0] = undefined
                     globalStyleCodes[1] = undefined
                     globalStyleCodes[2] = undefined
                     globalStyleCodes[3] = undefined
                     globalStyleCodes[4] = undefined
                  }
               })

               specialSymbol = false
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*);(\d*);(\d*)t$/gmu).exec(symbol)) {
               match.shift()
               util.log('WINDOW MANIPULATION!', match.filter(k => k !== undefined))
               specialSymbol = false
               continue
            }

            if (match = new RegExp(/^\u001b=$/gmu).exec(symbol)) {
               match.shift()
               util.log('APPLICATION KEYPAD', match[0])
               specialSymbol = false
               if (match[0] === '1') {
                  this._context.setApplicationKeypad()
               }
               continue
            }

            if (match = new RegExp(/^\u001b>$/gmu).exec(symbol)) {
               match.shift()
               util.log('NORMAL KEYPAD', match[0])
               specialSymbol = false
               if (match[0] === '1') {
                  this._context.unsetApplicationKeypad()
               }
               continue
            }

            if (match = new RegExp(/^\u001b\[\?(\d*)h$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               if (match[0] === '1') {
                  util.log('APPLICATION CURSOR KEYS!')
                  this._context.setApplicationCursorKeys()
               }
               continue
            }

            if (match = new RegExp(/^\u001b\[\?(\d*)l$/gmu).exec(symbol)) {
               match.shift()
               util.log('DEC PRIVATE MODE RESET!', match[0])
               specialSymbol = false
               continue
            }

            if (match = new RegExp(/^\u001b\[\?1049(h|l)$/gmu).exec(symbol)) {
               match.shift()
               util.log('ALTERNATE SCREEN!')
               specialSymbol = false
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)J$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               if (match[0] === '0' || match[0] === '') {
                  util.log('CLEAR SCREEN BELOW!')
                  this._context.removeFromCursorToEnd()
               }
               else if (match[0] === '1') {
                  util.log('CLEAR SCREEN ABOVE!')
                  this._context.removeFromCursorToBeginnig()
               }
               else if (match[0] === '2') {
                  util.log('CLEAR ALL SCREEN!')
                  this._context.removeAll()
               }
               continue
            }

            if (match = new RegExp(/^\u001b\[H$/gmu).exec(symbol)) {
               match.shift()
               util.log('CURSOR HOME SYMBOL!')
               specialSymbol = false
               this._context.setCursorY(0)
               this._context.setCursorX(0)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)K$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               if (match[0] === '0' || match[0] === '') {
                  util.log('CLEAR LINE TO END')
                  this._context.removeFromCursorToLineEnd(this._context.getCursorX())
               }
               else if (match[0] === '1') {
                  util.log('CLEAR LINE FROM BEGINNING')
                  this._context.removeFromBeginningToCursor(this._context.getCursorX())
               }
               else if (match[0] === '2') {
                  util.log('CLEAR LINE')
                  this._context.removeLine(this._context.getCursorX())
               }
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)G$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               util.log('CURSOR ABSOLUTE!', match[0])
               const col = match[0] === '' ? 0 : parseInt(match[0]) - 1
               this._context.setCursorY(col)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)A$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR UP!', amount)
               this._context.setCursorX(this._context.getCursorX() - amount)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)B$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR DOWN!', amount)
               this._context.setCursorX(this._context.getCursorX() + amount)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)C$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR FORWARD!', amount)
               this._context.setCursorY(this._context.getCursorY() + amount)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)D$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR BACKWARD!', amount)
               this._context.setCursorY(this._context.getCursorY() - amount)
               continue
            }

            if (match = new RegExp(/^\u001b\[(\d*)P$/gmu).exec(symbol)) {
               match.shift()
               specialSymbol = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('REMOVE CHAR!', amount)
               this._context.removeChar(amount)
               continue
            }

         }
         else {
            if (!osc) {
               //@TODO handle Delete button!!!
               if (symbol === '\x08') {
                  util.log('BACKSPACE SYMBOLE')
                  this._context.setCursorY(this._context.getCursorY() - 1)
               }
               else if (symbol === '\u0007') {
                  util.log('BELL')
                  this._context.issueWindowCommand(['bell'])
               }
               else if (symbol === '\r') {
                  util.log('CURSOR LINE START')
                  this._context.setCursorY(0)
               }
               else if (symbol === '\n') {
                  util.log('NEW LINE')
                  if (this._context.getCursorX() + 1 > maxRow - 1) {
                     this._context.shiftContent(1)
                  }
                  else {
                     this._context.setCursorX(this._context.getCursorX() + 1)
                  }
               }
               else {
                  if (symbol === ' ') {
                     //util.log('SPACE SYMBOLE')
                  }
                  else {
                     //util.log('NORMAL SYMBOLE', symbol)
                  }

                  this._context.setStyleData(this._context.getCursorX(), this._context.getCursorY(), [...globalStyleCodes])
                  this._context.set(this._context.getCursorX(), this._context.getCursorY(), symbol)

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

         if (specialSymbol && symbol.length > 30) {
            specialSymbol = false
            util.log('UNKNOWN SYMBOL', symbol)
            alert('unknown symbole ' + symbol)
         }
      }
   }
}

module.exports = OutputParser