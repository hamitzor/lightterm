class Context {
   constructor({ cols, rows }) {
      this._cur = [0, 0]
      this._rows = rows
      this._cols = cols
      this._OSCommandData = []
      this._styleData = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._styleData[i] = new Array(cols)
         for (let j = 0; j < cols; j++) {
            this._styleData[i][j] = []
         }
      }

      this._charMatrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
         this._charMatrix[i] = new Array(cols)
         for (let j = 0; j < cols; j++) {
            this._charMatrix[i][j] = ''
         }
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

   getRowNumber() {
      return this._rows
   }

   getColNumber() {
      return this._cols
   }

   getOSCommandData() {
      return this._OSCommandData
   }

   setOSCommandData(OSCommandData) {
      this._OSCommandData = OSCommandData
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