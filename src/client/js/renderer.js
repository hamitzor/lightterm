const { createElement } = require('./util')

class Renderer {

   constructor({ colorProfile, termScreenEl, contentMatrix }) {
      this._root = termScreenEl
      this._cm = contentMatrix
      this._cp = colorProfile
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
      this._root.innerHTML = ''
      for (let i = 0; i < this._cm.getMatrix().length; i++) {
         const rowEl = createElement('<div style="width: 1202px; height: 23px; line-height: 23px; overflow: hidden;"></div>')
         for (let j = 0; j < this._cm.getRow(i).length; j++) {
            const col = createElement(`<span style="display: inline-block; height: 100%; vertical-align: top; width: 12.02px;">${this._cm.get(i, j)}</span>`)
            rowEl.appendChild(col)
         }
         this._root.appendChild(rowEl)
      }
      this._cm.getStyleData().forEach((rowStyleData, i) => {
         const rowEl = this._root.childNodes[i]
         rowStyleData.forEach(styleData => {

            this.styleRow(rowEl, styleData, 0, el => {
               el.style.color = 'black'
               el.style.fontWeight = 'normal'
               el.style.fontStyle = 'normal'
               el.style.textDecoration = 'none'
               el.style.fontFamily = 'courier-new, courier, monospace'
               el.style.backgroundColor = 'transparent'
            })

            this.styleRow(rowEl, styleData, 1, el => {
               el.style.fontWeight = 'bold'
            })

            this.styleRow(rowEl, styleData, 3, el => {
               el.style.fontStyle = 'italic'
            })

            this.styleRow(rowEl, styleData, 4, el => {
               el.style.textDecoration = 'underline'
            })

            this.styleRow(rowEl, styleData, 10, el => {
               el.style.textDecoration = 'courier-new, courier, monospace'
            })

            //@TODO read colors from a profile
            this.styleRow(rowEl, styleData, 30, el => {
               el.style.color = 'black'
            })

            this.styleRow(rowEl, styleData, 31, el => {
               el.style.color = 'red'
            })

            this.styleRow(rowEl, styleData, 32, el => {
               el.style.color = 'green'
            })

            this.styleRow(rowEl, styleData, 33, el => {
               el.style.color = 'yellow'
            })

            this.styleRow(rowEl, styleData, 34, el => {
               el.style.color = 'blue'
            })

            this.styleRow(rowEl, styleData, 35, el => {
               el.style.color = 'magenta'
            })

            this.styleRow(rowEl, styleData, 36, el => {
               el.style.color = 'cyan'
            })

            this.styleRow(rowEl, styleData, 37, el => {
               el.style.color = 'white'
            })

            this.styleRow(rowEl, styleData, 90, el => {
               el.style.color = 'gray'
            })

            this.styleRow(rowEl, styleData, 91, el => {
               el.style.color = 'lightcoral'
            })

            this.styleRow(rowEl, styleData, 92, el => {
               el.style.color = 'palegreen'
            })

            this.styleRow(rowEl, styleData, 93, el => {
               el.style.color = 'lemonchiffon'
            })

            this.styleRow(rowEl, styleData, 94, el => {
               el.style.color = 'lightskyblue'
            })

            this.styleRow(rowEl, styleData, 95, el => {
               el.style.color = 'thistle'
            })

            this.styleRow(rowEl, styleData, 96, el => {
               el.style.color = 'lightcyan'
            })

            this.styleRow(rowEl, styleData, 97, el => {
               el.style.color = 'white'
            })

            this.styleRow(rowEl, styleData, 40, el => {
               el.style.backgroundColor = 'black'
            })

            this.styleRow(rowEl, styleData, 41, el => {
               el.style.backgroundColor = 'red'
            })

            this.styleRow(rowEl, styleData, 42, el => {
               el.style.backgroundColor = 'green'
            })

            this.styleRow(rowEl, styleData, 43, el => {
               el.style.backgroundColor = 'yellow'
            })

            this.styleRow(rowEl, styleData, 44, el => {
               el.style.backgroundColor = 'blue'
            })

            this.styleRow(rowEl, styleData, 45, el => {
               el.style.backgroundColor = 'magenta'
            })

            this.styleRow(rowEl, styleData, 46, el => {
               el.style.backgroundColor = 'cyan'
            })

            this.styleRow(rowEl, styleData, 47, el => {
               el.style.backgroundColor = 'white'
            })

            this.styleRow(rowEl, styleData, 100, el => {
               el.style.backgroundColor = 'gray'
            })

            this.styleRow(rowEl, styleData, 101, el => {
               el.style.backgroundColor = 'lightcoral'
            })

            this.styleRow(rowEl, styleData, 102, el => {
               el.style.backgroundColor = 'palegreen'
            })

            this.styleRow(rowEl, styleData, 103, el => {
               el.style.backgroundColor = 'lemonchiffon'
            })

            this.styleRow(rowEl, styleData, 104, el => {
               el.style.backgroundColor = 'lightskyblue'
            })

            this.styleRow(rowEl, styleData, 105, el => {
               el.style.backgroundColor = 'thistle'
            })

            this.styleRow(rowEl, styleData, 106, el => {
               el.style.backgroundColor = 'lightcyan'
            })

            this.styleRow(rowEl, styleData, 107, el => {
               el.style.backgroundColor = 'white'
            })

         })
      })
   }
}

module.exports = Renderer