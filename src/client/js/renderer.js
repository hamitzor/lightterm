const controlSequenceKind = require('./control-sequence-kinds')
const profileManager = require('./profile-manager')

class Renderer {

   constructor({ colorProfile, termScreenEl, termScreenTitleEl, context }) {
      this._root = termScreenEl
      this._title = termScreenTitleEl
      this._context = context
      this._cp = colorProfile
      this._HTMLContent = ''
   }

   styleRow(rowEl, styleData, code, cb) {
      if (styleData[0].includes(code)) {
         rowEl.childNodes.forEach((el, i) => {
            if (i >= styleData[1]) {
               cb(el)
            }
         })
      }
   }

   render() {
      const { w, h } = profileManager.getCellSize()
      for (let i = 0; i < this._context.getOSCommandData().length; i++) {
         if (this._context.getOSCommandData()[i][0] === controlSequenceKind.CHANGE_WINDOW_TITLE_ESCAPE) {
            console.log('Tab title changed to ', this._context.getOSCommandData()[i][1])
            document.title = this._context.getOSCommandData()[i][1]
            this._context.getOSCommandData().splice(i, 1)
         }
      }

      this._root.innerHTML = ''
      let newInnerHTML = ''
      for (let i = 0; i < this._context.getMatrix().length; i++) {
         newInnerHTML = newInnerHTML + `<div class="term-row" style="width: ${w * this._context.getColNumber()}px; height: ${h}px; line-height: ${h}px;">`
         for (let j = 0; j < this._context.getRow(i).length; j++) {
            const classList = []
            if (this._context.getCursorX() === i && this._context.getCursorY() === j) {
               classList.push('term-cursor-cell')
            }
            if (this._context.getStyleData(i, j)) {
               this._context.getStyleData(i, j).forEach(styleData => {
                  classList.push('term-cell-style-' + styleData)
               })
            }

            newInnerHTML = newInnerHTML + `<span class="term-cell ${classList.join(' ')}" style="width: ${w}px;">${this._context.get(i, j)}</span>`

         }
         newInnerHTML = newInnerHTML + `</div>`
      }
      this._root.innerHTML = newInnerHTML
   }
}

module.exports = Renderer