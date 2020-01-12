/* Class that is responsible to do actual rendering in HTML */
class Renderer {

   /* It needs a profile manager instance for styling, a valid HTML element to be used as root element for rendering,
   and the context for content and styling of each cell */
   constructor({ profileManager, termScreenEl, context }) {
      this._root = termScreenEl
      this._context = context
      this._profileManager = profileManager
      this._HTMLContent = ''
      this._previousCharMatrix = this._context.getCharMatrix()
      this._previousStyleDataMatrix = this._context.getStyleDataMatrix()
      this._cursor = [0, 0]
   }

   createScreen() {
      /* Get calculated width and height of a cell  */
      const { w, h } = this._profileManager.getCellSize()
      this._root.innerHTML = ''
      this._root.style.width = `${w * this._context.getColNumber()}px`
      let newInnerHTML = ''
      for (let x = 0; x < this._context.getRowNumber(); x++) {
         for (let y = 0; y < this._context.getColNumber(); y++) {

            /* Array contains all css classes for the cell*/
            const classList = []
            const cellStyle = this._context.getStyleData(x, y)
            /* If context has a styling data at cell (x,y), iterate over it, and add appropriate css classes */
            if (cellStyle && cellStyle.length > 0) {
               if (cellStyle[0] === 1 && cellStyle[4] === undefined && cellStyle[5] === undefined) {
                  classList.push('term-inverse-cell')
               }
               cellStyle.forEach((styleData, index) => {
                  if (styleData !== undefined) {
                     if (index !== 0) {
                        if ((index === 4 || index === 5)) {
                           if (this._profileManager.isColored()) {
                              classList.push('term-cell-style-' + styleData)
                           }
                        }
                        else {
                           classList.push('term-cell-style-' + styleData)
                        }
                     }
                  }
               })
            }

            newInnerHTML = newInnerHTML + `<span class="term-cell ${classList.join(' ')}" style="width: ${w}px; height: ${h}px">${this._context.getChar(x, y)}</span>`
         }
      }
      this._root.innerHTML = newInnerHTML.trim()
   }

   getSpanIndex(pos) {
      return pos[0] * this._context.getColNumber() + pos[1]
   }

   getDifferentCells() {
      const cells = []
      const newCharMatrix = this._context.getCharMatrix()
      const previousCharMatrix = this._previousCharMatrix

      const newStyleDataMatrix = this._context.getStyleDataMatrix()
      const previousStyleDataMatrix = this._previousStyleDataMatrix

      for (let x = 0; x < this._context.getRowNumber(); x++) {
         for (let y = 0; y < this._context.getColNumber(); y++) {
            if (previousCharMatrix[x] === undefined || (newCharMatrix[x][y] !== previousCharMatrix[x][y])) {
               cells.push([x, y])
               continue
            }

            if (newStyleDataMatrix[x] === undefined && previousStyleDataMatrix[x] !== undefined) {
               cells.push([x, y])
               continue
            }

            if (previousStyleDataMatrix[x] === undefined && newStyleDataMatrix[x] !== undefined) {
               cells.push([x, y])
               continue
            }

            if ((newStyleDataMatrix[x][y] !== previousStyleDataMatrix[x][y])) {
               cells.push([x, y])
               continue
            }
         }
      }
      return cells
   }

   /* Render a frame */
   render() {
      this._root.childNodes[this.getSpanIndex(this._cursor)].classList.remove('term-cursor-cell')
      this._cursor = [this._context.getCursorX(), this._context.getCursorY()]
      this._root.childNodes[this.getSpanIndex(this._cursor)].classList.add('term-cursor-cell')
      this.getDifferentCells().forEach(cell => {
         const x = cell[0], y = cell[1]
         const index = this.getSpanIndex([x, y])
         /* Array contains all css classes for the cell*/
         const classList = []
         const cellStyle = this._context.getStyleData(x, y)
         /* If context has a styling data at cell (x,y), iterate over it, and add appropriate css classes */
         if (cellStyle && cellStyle.length > 0) {
            if (cellStyle[0] === 1 && cellStyle[4] === undefined && cellStyle[5] === undefined) {
               classList.push('term-inverse-cell')
            }
            cellStyle.forEach((styleData, index) => {
               if (styleData !== undefined) {
                  if (index !== 0) {
                     if ((index === 4 || index === 5)) {
                        if (this._profileManager.isColored()) {
                           classList.push('term-cell-style-' + styleData)
                        }
                     }
                     else {
                        classList.push('term-cell-style-' + styleData)
                     }
                  }
               }
            })
         }
         const node = this._root.childNodes[index]
         node.innerText = this._context.getChar(x, y)
         if (node.classList.contains('term-cursor-cell')) {
            node.className = 'term-cursor-cell'
         }
         else {
            node.className = ''
         }
         if (classList.length > 0) {
            classList.forEach(className => {
               node.classList.add(className)
            })
         }
      })

      this._previousCharMatrix = this._context.getCharMatrix()
      this._previousStyleDataMatrix = this._context.getStyleDataMatrix()
   }
}

module.exports = Renderer