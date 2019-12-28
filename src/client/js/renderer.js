const controlSequenceKind = require('./control-sequence-kinds')
const util = require('./util')

class Renderer {

   constructor({ profileManager, termScreenEl, termScreenTitleEl, context }) {
      this._root = termScreenEl
      this._title = termScreenTitleEl
      this._context = context
      this._profileManager = profileManager
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
      const { w, h } = this._profileManager.getCellSize()
      for (let i = 0; i < this._context.getOSCommandData().length; i++) {
         if (this._context.getOSCommandData()[i][0] === controlSequenceKind.CHANGE_WINDOW_TITLE_ESCAPE) {
            util.log('Tab title changed to ', this._context.getOSCommandData()[i][1])
            document.title = this._context.getOSCommandData()[i][1]
            this._context.getOSCommandData().splice(i, 1)
         }
      }

      this._root.innerHTML = ''
      let newInnerHTML = ''

      if (util.TERM_INDICATORS) {
         newInnerHTML = newInnerHTML + `<div class="term-row" style="width: ${w * (this._context.getColNumber() + (util.TERM_INDICATORS ? 2 : 0))}px; height: ${h}px; line-height: ${h}px;">`
         for (let i = -1; i < this._context.getColNumber() + 1; i++) {
            newInnerHTML = newInnerHTML + `<span style="width:${w}px ;background-color:grey">${i === -1 ? '*' : (i === this._context.getColNumber() ? '*' : i % 10)}</span>`
         }
         newInnerHTML = newInnerHTML + `</div>`
      }
      for (let i = 0; i < this._context.getRowNumber(); i++) {

         newInnerHTML = newInnerHTML + `<div class="term-row" style="width: ${w * (this._context.getColNumber() + (util.TERM_INDICATORS ? 2 : 0))}px; height: ${h}px; line-height: ${h}px;">`
         if (util.TERM_INDICATORS) {
            newInnerHTML = newInnerHTML + `<span style="background-color:grey">${i % 10}</span>`
         }
         for (let j = 0; j < this._context.getColNumber(); j++) {
            const classList = []
            const isCursor = this._context.getCursorX() === i && this._context.getCursorY() === j
            if (isCursor) {
               classList.push('term-cursor-cell')
            }
            if (this._context.getStyleData(i, j) && this._context.getStyleData(i, j).length > 0) {
               this._context.getStyleData(i, j).forEach(styleData => {
                  classList.push('term-cell-style-' + styleData)
               })
            }

            newInnerHTML = newInnerHTML + `<span class="term-cell ${classList.join(' ')}" style="${isCursor ? `height: ${h - 2}px;` : ""} width: ${w}px;">${this._context.get(i, j)}</span>`

         }
         if (util.TERM_INDICATORS) {
            newInnerHTML = newInnerHTML + `<span style="background-color:grey">${i % 10}</span>`
         }
         newInnerHTML = newInnerHTML + `</div>`
      }
      if (util.TERM_INDICATORS) {
         newInnerHTML = newInnerHTML + `<div class="term-row" style="width: ${w * (this._context.getColNumber() + (util.TERM_INDICATORS ? 2 : 0))}px; height: ${h}px; line-height: ${h}px;">`
         for (let i = -1; i < this._context.getColNumber() + 1; i++) {
            newInnerHTML = newInnerHTML + `<span style="width:${w}px ;background-color:grey">${i === -1 ? '*' : (i === this._context.getColNumber() ? '*' : i % 10)}</span>`
         }
         newInnerHTML = newInnerHTML + `</div>`
      }
      this._root.innerHTML = newInnerHTML
   }
}

module.exports = Renderer