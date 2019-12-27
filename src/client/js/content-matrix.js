class ContentMatrix {
   constructor({ cols, rows }) {
      this._cur = [0, 0]
      this._cols = cols
      this._rows = rows
      this._charMatrix = new Array(rows)
      this._styleData = []
      for (let i = 0; i < rows; i++) {
         this._charMatrix[i] = new Array(cols)
         for (let j = 0; j < cols; j++) {
            this._charMatrix[i][j] = ''
         }
      }
   }

   getStyleData() {
      return this._styleData
   }

   setStyleData(index, styleData) {
      this._styleData[index] = styleData
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

module.exports = ContentMatrix