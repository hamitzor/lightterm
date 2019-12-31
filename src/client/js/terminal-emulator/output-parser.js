const util = require('../util')

/* Define SGR (Select Graphic Rendition) codes. These are used in styling of cells */
const RESET_ALL_CODE = 0
const BOLD_CODE = 1
const ITALIC_CODE = 3
const UNDERLINE_CODE = 4
const COLOR_CODES = [30, 31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97]
const BACKGROUND_COLOR_CODES = [40, 41, 42, 43, 44, 45, 46, 47, 100, 101, 102, 103, 104, 105, 106, 107]

class OutputParser {
   constructor({ context }) {
      this._context = context
   }

   /* Parse a terminal output and update the context according to it. It has a main loop, in which all characters 
   in the output inspected one by one. */
   parse(output) {
      /* Variable holds currently inspected symbol (it can either represent single character or a sequence) in the flow */
      let symbol = ''
      /* Flag to specify the symbol currently being inspected is a control sequence flag */
      let controlSequenceFlag = false
      /* Flag to specify the symbol currently being inspected is a operating system command */
      let operatingSystemCommandFlag = false
      /* Variable holds the value of a possible operating system command */
      let operatingSystemCommandValue = ''

      /* Array holds global styling state. Control sequences related with styling (the ones include SGR code defined above), 
      specify the styling of the cells between the sequence and the last cell in the screen. So, holding a global state for
      styling is neccesary.
      globalStyleCodes[0] holds the weight of the font (bold or normal)
      globalStyleCodes[1] holds the style of the font (italic or normal)
      globalStyleCodes[2] holds the decoration of the font (underlined or normal)
      globalStyleCodes[3] holds the color of the text
      globalStyleCodes[4] holds the background color of the cell */
      let globalStyleCodes = new Array(5)

      /* Main loop that inspects all characters one by one */
      for (let i = 0; i < output.length; i++) {

         /* If operating system command flag is up, store the value as operating system command value */
         if (operatingSystemCommandFlag) {
            operatingSystemCommandValue = operatingSystemCommandValue + output[i]
         }
         /* If control sequence flag is up, accumulate characters in for further inspection. */
         if (controlSequenceFlag) {
            symbol = symbol + output[i]
         }
         /* If none of above is right, set the character as symbol */
         else {
            symbol = output[i]
         }

         /* Check if a operating system command ended */
         if (operatingSystemCommandFlag && symbol === '\u0007') {
            operatingSystemCommandFlag = false
            const value = operatingSystemCommandValue.slice(0, -1)
            util.log('OSC ', value)
            /* Send the operating system command to context */
            this._context.issueWindowCommand(['update-title', value])
            continue
         }

         /* If the symbole is \u001b (ESC), set control sequence flag up*/
         if (symbol === '\u001b') {
            controlSequenceFlag = true
         }

         /* If control sequence flag is up, try to recognize the sequence by using regex and handle them */
         if (controlSequenceFlag) {
            let match

            /* Check if the sequence is an operating system command */
            if (match = new RegExp(/^\u001b\]0;$/gmu).exec(symbol)) {
               operatingSystemCommandFlag = true
               controlSequenceFlag = false
               operatingSystemCommandValue = ''
               continue
            }

            /* Check if the sequence is a styling sequence. If so, change global styling data accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)(?:;?(\d*))*m$/gmu).exec(symbol)) {
               match.shift()
               let styleCodes = match.filter(m => m !== undefined).map(m => m === '' ? 0 : m).map(m => parseInt(m))
               styleCodes.forEach(code => {
                  if (code === BOLD_CODE) {
                     globalStyleCodes[0] = code
                  }
                  else if (code === ITALIC_CODE) {
                     globalStyleCodes[1] = code
                  }
                  else if (code === UNDERLINE_CODE) {
                     globalStyleCodes[2] = code
                  }
                  else if (COLOR_CODES.includes(code)) {
                     globalStyleCodes[3] = code
                  }
                  else if (BACKGROUND_COLOR_CODES.includes(code)) {
                     globalStyleCodes[4] = code
                  }
                  else if (code === RESET_ALL_CODE) {
                     globalStyleCodes[0] = undefined
                     globalStyleCodes[1] = undefined
                     globalStyleCodes[2] = undefined
                     globalStyleCodes[3] = undefined
                     globalStyleCodes[4] = undefined
                  }
               })

               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a set mode sequence. 
            If so, just skip, this feature is not yet implemented in lightterm */
            if (match = new RegExp(/^\u001b\[\dh$/gmu).exec(symbol)) {
               util.log('SET MODE!')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a reset mode sequence. 
            If so, just skip, this feature is not yet implemented in lightterm */
            if (match = new RegExp(/^\u001b\[\dl$/gmu).exec(symbol)) {
               util.log('RESET MODE!')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a window manipulation sequence. 
            If so, just skip, this feature is not yet implemented in lightterm */
            if (match = new RegExp(/^\u001b\[(\d*);(\d*);(\d*)t$/gmu).exec(symbol)) {
               util.log('WINDOW MANIPULATION!')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a application keypad sequence. 
            If so, just skip, this feature is not yet implemented in lightterm  */
            if (match = new RegExp(/^\u001b=$/gmu).exec(symbol)) {
               util.log('APPLICATION KEYPAD')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a normal keypad sequence. 
            If so, just skip, this feature is not yet implemented in lightterm  */
            if (match = new RegExp(/^\u001b>$/gmu).exec(symbol)) {
               util.log('NORMAL KEYPAD')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a save cursor sequence. If so, save cursor position in context */
            if (match = new RegExp(/^\u001b7$/gmu).exec(symbol)) {
               util.log('SAVE CURSOR POSITION')
               controlSequenceFlag = false
               this._context.saveCur()
               continue
            }

            /* Check if the sequence is a restore cursor sequence. If so, restore cursor position in context */
            if (match = new RegExp(/^\u001b8$/gmu).exec(symbol)) {
               util.log('RESTORE CURSOR POSITION')
               controlSequenceFlag = false
               this._context.restoreCur()
               continue
            }

            /* Check if the sequence is a change cursor position sequence. If so, change cursor position in context */
            if (match = new RegExp(/^\u001b\[(\d*);(\d*)f$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               let x = parseInt(match[0]), y = 1
               if (match[1]) {
                  y = parseInt(match[1])
               }

               if (y === 0) {
                  y = 1
               }
               util.log('CHANGE CURSOR POSITION', x - 1, y - 1)
               this._context.changeCursorPosition(x - 1, y - 1)
               continue
            }

            /* Check if the sequence is a application cursor keys sequence. 
            If so, just skip, this feature is not yet implemented in lightterm  */
            if (match = new RegExp(/^\u001b\[\?(\d*)h$/gmu).exec(symbol)) {
               controlSequenceFlag = false
               util.log('APPLICATION CURSOR KEYS!')
               continue
            }

            /* Check if the sequence is a DEC private mode sequence. 
            If so, just skip, this feature is not yet implemented in lightterm  */
            if (match = new RegExp(/^\u001b\[\?(\d*)l$/gmu).exec(symbol)) {
               util.log('DEC PRIVATE MODE RESET!')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is an alternate screen sequence. 
            If so, just skip, this feature is not yet implemented in lightterm  */
            if (match = new RegExp(/^\u001b\[\?1049(h|l)$/gmu).exec(symbol)) {
               util.log('ALTERNATE SCREEN!')
               controlSequenceFlag = false
               continue
            }

            /* Check if the sequence is a clear screen sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)J$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               if (match[0] === '0' || match[0] === '') {
                  util.log('CLEAR SCREEN BELOW!')
                  this._context.removeFromCursorToEnd()
               }
               else if (match[0] === '1') {
                  util.log('CLEAR SCREEN ABOVE!')
                  this._context.removeFromBeginningToCursor()
               }
               else if (match[0] === '2') {
                  util.log('CLEAR ALL SCREEN!')
                  this._context.removeAll()
               }
               continue
            }

            /* Check if the sequence is a cursor home sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[H$/gmu).exec(symbol)) {
               match.shift()
               util.log('CURSOR HOME SYMBOL!')
               controlSequenceFlag = false
               this._context.setCursorY(0)
               this._context.setCursorX(0)
               continue
            }

            /* Check if the sequence is a clear line sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)K$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               if (match[0] === '0' || match[0] === '') {
                  util.log('CLEAR LINE TO END')
                  this._context.removeFromCursorToLineEnd()
               }
               else if (match[0] === '1') {
                  util.log('CLEAR LINE FROM BEGINNING')
                  this._context.removeFromLineBeginningToCursor()
               }
               else if (match[0] === '2') {
                  util.log('CLEAR LINE')
                  this._context.removeLine()
               }
               continue
            }

            /* Check if the sequence is a cursor absolute sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)G$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               util.log('CURSOR ABSOLUTE!', match[0])
               const col = match[0] === '' ? 0 : parseInt(match[0]) - 1
               this._context.setCursorY(col)
               continue
            }

            /* Check if the sequence is a cursor up sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)A$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR UP!', amount)
               this._context.setCursorX(this._context.getCursorX() - amount)
               continue
            }

            /* Check if the sequence is a cursor down sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)B$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR DOWN!', amount)
               this._context.setCursorX(this._context.getCursorX() + amount)
               continue
            }

            /* Check if the sequence is a cursor forward sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)C$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR FORWARD!', amount)
               this._context.setCursorY(this._context.getCursorY() + amount)
               continue
            }

            /* Check if the sequence is a cursor backward sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)D$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('CURSOR BACKWARD!', amount)
               this._context.setCursorY(this._context.getCursorY() - amount)
               continue
            }

            /* Check if the sequence is a remove character sequence. If so, update context accordingly */
            if (match = new RegExp(/^\u001b\[(\d*)P$/gmu).exec(symbol)) {
               match.shift()
               controlSequenceFlag = false
               const amount = match[0] === '' ? 1 : parseInt(match[0])
               util.log('REMOVE CHAR!', amount)
               this._context.removeChar(amount)
               continue
            }

         }
         /* If control sequence flag is down, try to recognize the character wheter it is something special or not. */
         else {
            /* If operating system command flag is up, skip. */
            if (!operatingSystemCommandFlag) {

               /* If the character is a backspace, update context properly */
               if (symbol === '\x08') {
                  util.log('BACKSPACE SYMBOLE')
                  this._context.setCursorY(this._context.getCursorY() - 1)
               }
               /* If the character is \u0007, send operating system command to context */
               else if (symbol === '\u0007') {
                  util.log('BELL')
                  this._context.issueWindowCommand(['bell'])
               }
               /* If the character is \r, update context properly */
               else if (symbol === '\r') {
                  util.log('CURSOR LINE START')
                  this._context.setCursorY(0)
               }
               /* If the character is \n, update context properly */
               else if (symbol === '\n') {
                  util.log('NEW LINE')
                  /* Check if it is the last line, if so, shift content. */
                  if (this._context.getCursorX() + 1 > this._context.getRowNumber() - 1) {
                     this._context.shiftContent(1)
                  }
                  /* If not, just increase cursor's vertical position by one */
                  else {
                     this._context.setCursorX(this._context.getCursorX() + 1)
                  }
               }
               else {
                  /* if character is none of above, assume that it is a printable character */

                  util.log('NORMAL SYMBOLE', symbol === ' ' ? 'SPACE' : symbol)

                  /* Eventually, update context with global styling data of cell (x,y) */
                  this._context.setStyleData(this._context.getCursorX(), this._context.getCursorY(), [...globalStyleCodes])
                  /* Update context with character value of cell (x,y) */
                  this._context.set(this._context.getCursorX(), this._context.getCursorY(), symbol)

                  /* Update cursor position. Consider some special cases like, cursor on the last cell of the line
                  or the screen, etc.*/
                  if (this._context.getCursorY() + 1 > this._context.getColNumber() - 1) {
                     if (this._context.getCursorX() + 1 > this._context.getRowNumber() - 1) {
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

         /* If after 30 characters, control sequence flag is still up then ignore the sequence.  */
         if (controlSequenceFlag && symbol.length > 30) {
            controlSequenceFlag = false
            util.log('UNKNOWN SYMBOL', symbol)
         }
      }
   }
}

module.exports = OutputParser