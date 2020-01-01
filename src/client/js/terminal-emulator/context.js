/* Class that manages 'cursor', 'styling information', the 'character value' of each cell
in the screen and window commands. It holds a character matrix, where each element 
represents  the value of the 'cell' at location (x,y) in the screen. A 'cell' contains 
only one character.  It also holds a style data matrix, where each element represents
the styling of the 'cell' at location (x,y). It manages the position of the cursor.
It is also responsible for managing the window commands like 'play bell sound', 'change window 
title', etc.). This class is not responsible for rendering or playing sounds, it just acts like 
a state holder, or in other words, a context. */

class Context {
   constructor({ cols, rows }) {
      /* Initialize cursor at top left. (x,y) = (0,0) */
      this._cur = [0, 0]
      this._savedCur = [0, 0]
      this.initializeMatrices(rows, cols)
   }

   /* Restore saved cursor position */
   restoreCur() {
      this._cur[0] = this._savedCur[0]
      this._cur[1] = this._savedCur[1]
   }

   /* Save cursor position */
   saveCur() {
      this._savedCur[0] = this._cur[0]
      this._savedCur[1] = this._cur[1]
   }

   /* Initialize character matrix and style data matrix with respect to given column and row number */
   initializeMatrices(rows, cols) {
      this._rows = rows
      this._cols = cols
      this._styleDataMatrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._styleDataMatrix[i] = new Array(cols)
      }

      this._charMatrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._charMatrix[i] = new Array(cols)
         for (let j = 0; j < cols; j++) {
            this._charMatrix[i][j] = ''
         }
      }
   }

   /* Reinitialize the matrices with new column and row */
   resize(rows, cols) {
      this.initializeMatrices(rows, cols)
   }

   /* Set window command handler */
   onWindowCommand(handler) {
      this._windowCommandHandler = handler
   }

   /* Handle a window command if the handler is set */
   issueWindowCommand(command) {
      if (this._windowCommandHandler) {
         this._windowCommandHandler(command)
      }
   }

   /* Set all cell's value to empty string and remove styling data. */
   removeAll() {
      for (let i = 0; i < this.getRowNumber(); i++) {
         for (let j = 0; j < this.getColNumber(); j++) {
            this.setChar(i, j, '')
            this.setStyleData(i, j, null)
         }
      }
   }

   /* Set the value of cells between the cursor and the first cell in the screen, to empty string and remove styling data */
   removeFromBeginningToCursor() {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, null)
      }
      for (let i = this.getCursorX(); i > -1; i--) {
         for (let j = 0; j < this.getColNumber(); j++) {
            this.setChar(i, j, '')
            this.setStyleData(i, j, null)
         }
      }
   }

   /* Set the value of cells between the cursor and the last cell in the screen, to empty string and remove styling data */
   removeFromCursorToEnd() {
      for (let i = this.getCursorY(); i < this._cols; i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, null)
      }
      for (let i = this.getCursorX(); i < this._rows; i++) {
         for (let j = 0; j < this._cols; j++) {
            this.setChar(i, j, '')
            this.setStyleData(i, j, null)
         }
      }
   }

   /* Set the value of cells between the cursor and the first cell in the line, to empty string and remove styling data */
   removeFromLineBeginningToCursor() {
      for (let i = 0; i < this.getCursorY() + 1; i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, null)
      }
   }

   /* Set the value of cells between the cursor and the last cell in the line, to empty string and remove styling data */
   removeFromCursorToLineEnd() {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, null)
      }
   }

   /* Set the value of all cells in the line, to empty string and remove styling data */
   removeLine() {
      for (let i = 0; i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, null)
      }
   }

   /* Shift all cells 'n' times left */
   shiftContent(n) {
      for (let i = 0; i < this._rows; i++) {
         if (i > this._rows - n - 1) {
            this._charMatrix[i] = []
            for (let j = 0; j < this._cols; j++) {
               this._charMatrix[i][j] = ''
            }
            this._styleDataMatrix[i] = []
            for (let j = 0; j < this._cols; j++) {
               this._styleDataMatrix[i][j] = []
            }
         }
         else {
            this._styleDataMatrix[i] = this._styleDataMatrix[i + n]
            this._charMatrix[i] = this._charMatrix[i + n]
         }
      }
   }

   /* Remove 'n' character from screen starting from the cursor's location, without changing the location 
   of the cursor. It is performed in two steps. Firstly, in the line cursor stays, all cells stay on the 
   right of the cursor are shifted 'n' times left. Secondly, in all lines below cursor, all cells are shifted
   'n' times left. This simulates a character delete on the screen. */
   removeChar(n) {
      for (let k = 0; k < n; k++) {
         for (let j = this.getCursorY(); j < this._cols; j++) {
            if (j < this._cols - 1) {
               this.setChar(this.getCursorX(), j, this.getChar(this.getCursorX(), j + 1))
               this.setStyleData(this.getCursorX(), j, this.getStyleData(this.getCursorX(), j + 1))
            }
            else {
               this.setChar(this.getCursorX(), j, (this.getCursorX() < this._rows - 1) ? this.getChar(this.getCursorX() + 1, 0) : '   ')
               this.setStyleData(this.getCursorX(), j, (this.getCursorX() < this._rows - 1) ? this.getStyleData(this.getCursorX() + 1, 0) : null)
            }
         }

         for (let i = this.getCursorX() + 1; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
               if (j < this._cols - 1) {
                  this.setChar(i, j, this.getChar(i, j + 1))
                  this.setStyleData(i, j, this.getStyleData(i, j + 1))
               }
               else {
                  this.setChar(i, j, (i < this._rows - 1) ? this.getChar(i + 1, 0) : '')
                  this.setStyleData(i, j, (i < this._rows - 1) ? this.getStyleData(i + 1, 0) : '')
               }
            }
         }
      }
   }

   /* Return total row number */
   getRowNumber() {
      return this._rows
   }

   /* Return total column number */
   getColNumber() {
      return this._cols
   }

   /* Get style data of cell (x,y) */
   getStyleData(x, y) {
      return this._styleDataMatrix[x][y]
   }

   /* Set style data of cell (x,y) */
   setStyleData(x, y, styleData) {
      this._styleDataMatrix[x][y] = styleData
   }

   /* Get cursor position */
   getCursor() {
      return this._cur
   }

   /* Set cursor position */
   setCursor(cur) {
      this._cur = cur
   }

   /* Get cursor's vertical position */
   getCursorX() {
      return this._cur[0]
   }

   /* Set cursor's vertical position */
   setCursorX(x) {
      this._cur[0] = x
   }

   /* Get cursor's horizontal position */
   getCursorY() {
      return this._cur[1]
   }

   /* Set cursor's horizontal position */
   setCursorY(y) {
      this._cur[1] = y
   }

   /* Get character value of cell (x,y). */
   getChar(x, y) {
      if (x > this._rows - 1 || y > this._cols - 1) {
         throw Error(`Bad cell request: ${x}, ${y}`)
      }
      return this._charMatrix[x][y]
   }

   /* Set character value of cell (x,y). */
   setChar(x, y, val) {
      this._charMatrix[x][y] = val
   }

}

module.exports = Context