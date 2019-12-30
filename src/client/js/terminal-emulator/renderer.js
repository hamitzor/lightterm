const util = require('../util')

/* Class that is responsible to do actual rendering in HTML */
class Renderer {

   /* It needs a profile manager instance for styling, a valid HTML element to be used as root element for rendering,
   and the context for content and styling of each cell */
   constructor({ profileManager, termScreenEl, context }) {
      this._root = termScreenEl
      this._context = context
      this._profileManager = profileManager
      this._HTMLContent = ''
   }

   /* Render a frame */
   render() {
      /* Get calculated width and height of a cell  */
      const { w, h } = this._profileManager.getCellSize()
      /* Clear root element's inner HTML for a new frame */
      this._root.innerHTML = ''
      /* Variable that holds HTML string that represents new inner HTML for root element. All additions made to this
      variable and at the end it will be set as the inner HTML of root element. */
      let newInnerHTML = ''

      /* Render each row */
      for (let y = 0; y < this._context.getRowNumber(); y++) {

         /* Row has a width equal to column number times width of a cell and has a height equal to height of a cell. */
         newInnerHTML = newInnerHTML + `<div class="term-row" style="width: ${w * (this._context.getColNumber())}px; height: ${h}px; line-height: ${h}px;">`

         /* Render each cell */
         for (let x = 0; x < this._context.getColNumber(); x++) {
            /* Array contains all css classes for the cell*/
            const classList = []
            /* If (x,y) is same with the cursor position, add cursor css class */
            if (this._context.getCursorX() === y && this._context.getCursorY() === x) {
               classList.push('term-cursor-cell')
            }

            /* If context has a styling data at cell (x,y), iterate over it, and add appropriate css classes */
            if (this._context.getStyleData(y, x) && this._context.getStyleData(y, x).length > 0) {
               this._context.getStyleData(y, x).forEach(styleData => {
                  if (styleData) {
                     classList.push('term-cell-style-' + styleData)
                  }
               })
            }

            /* Join css class array and add to the cell element. Put the character stored in context for cell (x,y) 
            into element */
            newInnerHTML = newInnerHTML + `<span class="term-cell ${classList.join(' ')}" style="width: ${w}px;">${this._context.get(y, x)}</span>`

         }

         newInnerHTML = newInnerHTML + `</div>`
      }

      /* Finally, set innner HTML of root element */
      this._root.innerHTML = newInnerHTML.trim()
   }
}

module.exports = Renderer