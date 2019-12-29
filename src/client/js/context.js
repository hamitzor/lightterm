class Context {
   constructor({ cols, rows }) {
      this._cur = [0, 0]
      //@TODO: handle these key re-mapping
      this._applicationCursorKeys = false
      this._applicationKeypad = false
      this.initializeMatrices(rows, cols)
   }

   initializeMatrices(rows, cols) {
      this._rows = rows
      this._cols = cols
      this._styleData = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._styleData[i] = new Array(cols)
      }

      this._charMatrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._charMatrix[i] = new Array(cols)
         for (let j = 0; j < cols; j++) {
            this._charMatrix[i][j] = ''
         }
      }
   }

   resize(rows, cols) {
      this.initializeMatrices(rows, cols)
   }

   onWindowCommand(handler) {
      this._windowCommandHandler = handler
   }

   issueWindowCommand(command) {
      if (this._windowCommandHandler) {
         this._windowCommandHandler(command)
      }
   }

   setApplicationCursorKeys() {
      this._applicationCursorKeys = true
   }

   unsetApplicationCursorKeys() {
      this._applicationCursorKeys = false
   }

   setApplicationKeypad() {
      this._applicationKeypad = true
   }

   unsetApplicationKeypad() {
      this._applicationKeypad = false
   }

   removeAll() {
      for (let i = 0; i < this.getRowNumber(); i++) {
         for (let j = 0; j < this.getColNumber(); j++) {
            this.set(i, j, '')
         }
      }
   }

   removeFromCursorToEnd() {
      for (let i = this.getCursorY(); i < this._cols; i++) {
         this.set(this.getCursorX(), i, '')
      }
      for (let i = this.getCursorX(); i < this._rows; i++) {
         for (let j = 0; j < this._cols; j++) {
            this.set(i, j, '')
         }
      }
   }
   //@TODO remove n
   removeFromCursorToBeginning(n) {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.set(n, i, '')
      }
      for (let i = this.getCursorX(); i > -1; i--) {
         for (let j = 0; j < this.getColNumber(); j++) {
            this.set(i, j, '')
         }
      }
   }

   removeFromCursorToLineEnd(n) {
      for (let i = this.getCursorY(); i < this.getColNumber(); i++) {
         this.set(n, i, '')
      }
   }

   removeFromBeginningToCursor(n) {
      for (let i = 0; i < this.getCursorY() + 1; i++) {
         this.set(n, i, '')
      }
   }

   removeLine(n) {
      for (let i = 0; i < this.getColNumber(); i++) {
         this.set(n, i, '')
      }
   }

   shiftContent(n) {
      for (let i = 0; i < this._rows; i++) {
         if (i > this._rows - n - 1) {
            this._charMatrix[i] = []
            for (let j = 0; j < this._cols; j++) {
               this._charMatrix[i][j] = ''
            }
            this._styleData[i] = []
            for (let j = 0; j < this._cols; j++) {
               this._styleData[i][j] = []
            }
         }
         else {
            this._styleData[i] = this._styleData[i + n]
            this._charMatrix[i] = this._charMatrix[i + n]
         }
      }
   }

   removeChar(n) {
      for (let k = 0; k < n; k++) {
         for (let j = this.getCursorY(); j < this._cols; j++) {
            if (j < this._cols - 1) {
               this.set(this.getCursorX(), j, this.get(this.getCursorX(), j + 1))
            }
            else {
               this.set(this.getCursorX(), j, (this.getCursorX() < this._rows - 1) ? this.get(this.getCursorX() + 1, 0) : '   ')
            }
         }

         for (let i = this.getCursorX() + 1; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
               if (j < this._cols - 1) {
                  this.set(i, j, this.get(i, j + 1))
               }
               else {
                  this.set(i, j, (i < this._rows - 1) ? this.get(i + 1, 0) : '')
               }
            }
         }
      }
   }

   getRowNumber() {
      return this._rows
   }

   getColNumber() {
      return this._cols
   }

   getStyleData(x, y) {
      return this._styleData[x][y]
   }

   setStyleData(x, y, styleData) {
      this._styleData[x][y] = styleData
   }

   getCursor() {
      return this._cur
   }

   setCursor(cur) {
      this._cur = cur
   }

   getCursorX() {
      return this._cur[0]
   }

   setCursorX(x) {
      this._cur[0] = x
   }

   getCursorY() {
      return this._cur[1]
   }

   setCursorY(y) {
      this._cur[1] = y
   }

   get(x, y) {
      if (x > this._rows - 1 || y > this._cols - 1) {
         throw Error(`Bad cell request: ${x}, ${y}`)
      }
      return this._charMatrix[x][y]
   }

   set(x, y, val) {
      this._charMatrix[x][y] = val
   }

   getRow(x) {
      return this._charMatrix[x]
   }

   setRow(x, row) {
      for (let i = 0; i < this._cols; i++) {
         this._charMatrix[x][i] = row[i] ? row[i] : ''
      }
   }

   getMatrix() {
      return this._charMatrix
   }

   setMatrix(m) {
      this._charMatrix = m
   }

}

module.exports = Context