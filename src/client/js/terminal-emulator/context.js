/* Class that manages 'cursor', 'styling information', the 'character value' of each cell
in the screen and window commands. It holds a character matrix, where each element 
represents  the value of the 'cell' at location (x,y) in the screen. A 'cell' contains 
only one character.  It also holds a style data matrix, where each element represents
the styling of the 'cell' at location (x,y). It manages the position of the cursor.
It is also responsible for managing the window commands like 'play bell sound', 'change window 
title', etc.). This class is not responsible for rendering or playing sounds, it just acts like 
a state holder, or in other words, a context. */

class Context {
   constructor({ cols, rows, onError }) {
      /* Initialize cursor at top left. (x,y) = (0,0) */
      this._cur = [0, 0]
      this._savedCur = [0, 0]
      this._savedCharMatrix = null
      this._savedStyleDataMatrix = null
      this._scrollingRegion = [0, rows]
      this._scrollingHeight = rows
      this._applicationKeypad = false
      this._applicationCursors = false
      this._replaceMode = true
      this.initializeMatrices(rows, cols)
      this._onError = onError
   }

   getCharMatrix() {
      const m = []
      for (let i = 0; i < this._rows; i++) {
         m[i] = []
         for (let j = 0; j < this._cols; j++) {
            m[i][j] = this._charMatrix[i][j]
         }
      }
      return m
   }

   getStyleDataMatrix() {
      const m = []
      for (let i = 0; i < this._rows; i++) {
         if (this._styleDataMatrix[i] !== undefined) {
            m[i] = []
            for (let j = 0; j < this._cols; j++) {
               m[i][j] = this._styleDataMatrix[i][j]
            }
         }
      }
      return m
   }

   shiftCellsRight() {
      for (let y = this._cols - 1; y > this.getCursorY(); y--) {
         this.setChar(this.getCursorX(), y, this.getChar(this.getCursorX(), y - 1))
         this.setStyleData(this.getCursorX(), y, this.getStyleData(this.getCursorX(), y - 1))
      }
   }

   setReplaceMode(replaceMode) {
      this._replaceMode = replaceMode
   }

   isReplaceMode() {
      return this._replaceMode
   }

   setApplicationCursors(applicationCursors) {
      this._applicationCursors = applicationCursors
   }

   isApplicationCursors() {
      return this._applicationCursors
   }

   setApplicationKeypad(applicationKeypad) {
      this._applicationKeypad = applicationKeypad
   }

   isApplicationKeypad() {
      return this._applicationKeypad
   }

   getScrollingRegion() {
      return this._scrollingRegion
   }

   setScrollingRegion(scrollingRegion) {
      this._scrollingRegion = scrollingRegion
      this._scrollingHeight = scrollingRegion[1] - scrollingRegion[0]
   }

   insertLines(n) {
      for (let i = 0; i < n; i++) {
         for (let x = this._scrollingRegion[1] - 1; x > this.getCursorX() - 1; x--) {
            if (x === this.getCursorX()) {
               for (let j = 0; j < this._cols; j++) {
                  this._charMatrix[x][j] = ''
                  this._styleDataMatrix[x][j] = undefined
               }
            }
            else {
               this._charMatrix[x] = [...this._charMatrix[x - 1]]
               this._styleDataMatrix[x] = [...this._styleDataMatrix[x - 1]]
            }
         }
      }
   }

   removeLines(n) {
      for (let i = 0; i < n; i++) {
         for (let x = this.getCursorX(); x < this._scrollingRegion[1]; x++) {
            if (x === this._scrollingRegion[1] - 1) {
               for (let j = 0; j < this._cols; j++) {
                  this._charMatrix[x][j] = ''
                  this._styleDataMatrix[x][j] = undefined
               }
            }
            else {
               this._charMatrix[x] = [...this._charMatrix[x + 1]]
               this._styleDataMatrix[x] = [...this._styleDataMatrix[x + 1]]
            }
         }
      }
   }

   shiftRowsDown() {
      for (let x = this._scrollingRegion[1] - 1; x > this._scrollingRegion[0] - 1; x--) {
         if (x === this._scrollingRegion[0]) {
            for (let j = 0; j < this._cols; j++) {
               this._charMatrix[x][j] = ''
               this._styleDataMatrix[x][j] = undefined
            }
         }
         else {
            this._charMatrix[x] = [...this._charMatrix[x - 1]]
            this._styleDataMatrix[x] = [...this._styleDataMatrix[x - 1]]
         }
      }
   }

   shiftRowsUp() {
      for (let x = this._scrollingRegion[0]; x < this._scrollingRegion[1]; x++) {
         if (x === this._scrollingRegion[1] - 1) {
            for (let j = 0; j < this._cols; j++) {
               this._charMatrix[x][j] = ''
               this._styleDataMatrix[x][j] = undefined
            }
         }
         else {
            this._charMatrix[x] = [...this._charMatrix[x + 1]]
            this._styleDataMatrix[x] = [...this._styleDataMatrix[x + 1]]
         }
      }
   }

   restoreScreen() {
      for (let i = 0; i < this._rows; i++) {
         for (let j = 0; j < this._cols; j++) {
            this._charMatrix[i][j] = this._savedCharMatrix[i][j]
            this._styleDataMatrix[i][j] = this._savedStyleDataMatrix[i][j]
         }
      }
   }

   saveScreen() {
      this._savedCharMatrix = new Array(this._rows)
      this._savedStyleDataMatrix = new Array(this._rows)
      for (let i = 0; i < this._rows; i++) {
         this._savedCharMatrix[i] = new Array(this._cols)
         this._savedStyleDataMatrix[i] = new Array(this._cols)
         for (let j = 0; j < this._cols; j++) {
            this._savedCharMatrix[i][j] = this._charMatrix[i][j]
            this._savedStyleDataMatrix[i][j] = this._styleDataMatrix[i][j]
         }
      }
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
      this._cur = [0, 0]
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
            this.setStyleData(i, j, undefined)
         }
      }
   }

   /* Set the value of cells between the cursor and the first cell in the screen, to empty string and remove styling data */
   removeFromBeginningToCursor() {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, undefined)
      }
      for (let i = this.getCursorX(); i > -1; i--) {
         for (let j = 0; j < this.getColNumber(); j++) {
            this.setChar(i, j, '')
            this.setStyleData(i, j, undefined)
         }
      }
   }

   /* Set the value of cells between the cursor and the last cell in the screen, to empty string and remove styling data */
   removeFromCursorToEnd() {
      for (let i = this.getCursorY(); i < this._cols; i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, undefined)
      }
      for (let i = this.getCursorX(); i < this._rows; i++) {
         for (let j = 0; j < this._cols; j++) {
            this.setChar(i, j, '')
            this.setStyleData(i, j, undefined)
         }
      }
   }

   /* Set the value of cells between the cursor and the first cell in the line, to empty string and remove styling data */
   removeFromLineBeginningToCursor() {
      for (let i = 0; i < this.getCursorY() + 1; i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, undefined)
      }
   }

   /* Set the value of cells between the cursor and the last cell in the line, to empty string and remove styling data */
   removeFromCursorToLineEnd() {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, undefined)
      }
   }

   /* Set the value of all cells in the line, to empty string and remove styling data */
   removeLine() {
      for (let i = 0; i < this.getColNumber(); i++) {
         this.setChar(this.getCursorX(), i, '')
         this.setStyleData(this.getCursorX(), i, undefined)
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
               this.setChar(this.getCursorX(), j, '')
               this.setStyleData(this.getCursorX(), j, undefined)
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
      try {
         return this._styleDataMatrix[x][y]
      }
      catch (err) {
         this._onError(err, `tried to access style of cell ${x}, ${y}`)
      }
   }

   /* Set style data of cell (x,y) */
   setStyleData(x, y, styleData) {
      try {
         this._styleDataMatrix[x][y] = styleData
      }
      catch (err) {
         this._onError(err, `tried to set style of cell ${x}, ${y} as ${styleData}`)
      }
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
      try {
         return this._charMatrix[x][y]
      }
      catch (err) {
         this._onError(err, `tried to access char value of cell ${x}, ${y}`)
      }
   }

   /* Set character value of cell (x,y). */
   setChar(x, y, val) {
      try {
         this._charMatrix[x][y] = val
      }
      catch (err) {
         this._onError(err, `tried to set char value of cell ${x}, ${y} as ${val}`)
      }
   }

}

module.exports = Context