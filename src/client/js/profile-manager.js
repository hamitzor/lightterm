
class ProfileManager {
   constructor() {
      this._colors = [
         '#FFF',           //text
         '#222',           //background
         '#222',           //cursor
         '#FFF',             //cursor background
         '#2E3436',          //black
         '#CC0000',            //red
         '#76db16',          //green
         '#C4A000',         //yellow
         '#6eadff',           //blue
         '#75507B',        //magenta
         '#06989A',           //cyan
         '#D3D7CF',          //white
         '#555753',           //light black
         '#EF2929',     //light red
         '#8AE234',      //light green
         '#FCE94F',   //light yellow
         '#729FCF',   //light blue
         '#AD7FA8',        //light magenta
         '#34E2E2',      //light cyan
         '#EEEEEC'           //light white
      ]

      this._text = {
         fontFamily: 'Courier Prime',
         fontSize: 18
      }
   }

   getPalette() {
      return this._colors
   }

   getTextInformation() {
      return this._text
   }

   updatePalette(index, val) {
      this._colors[index] = val
   }

   updateTextInformation(update) {
      this._text = { ...this._text, ...update }
      return this._text
   }

   updateStyleSheet() {
      let content = `

      .term-tab {
         color: ${this._colors[0]};
         background-color: ${this._colors[1]};
         font-family: ${this._text.fontFamily};
         font-size: ${this._text.fontSize}px;
         padding: 2px;
         cursor: default;
         outline: none;
      }

      .term-cell-style-1 {
         font-weight: bold;
      }
      
      .term-cell-style-3 {
         font-style: italic;
      }
      
      .term-cell-style-4 {
         text-decoration: underline;
      }`

      let i
      for (i = 0; i < 8; i++) {
         content = content + `
         .term-cell-style-${30 + i} {
            color: ${this._colors[i + 4]};
         }` + `
         .term-cell-style-${40 + i} {
            background-color: ${this._colors[i + 4]};
         }`+ `
         .term-cell-style-${90 + i} {
            color: ${this._colors[i + 8 + 4]};
         }`+ `
         .term-cell-style-${100 + i} {
            background-color: ${this._colors[i + 8 + 4]};
         }`
      }

      content = content + `
      .term-cursor-cell {
         color: ${this._colors[2]};
         background-color: ${this._colors[3]};
      }`

      document.getElementById('term-style').appendChild(document.createTextNode(content))
   }

   getCellSize() {
      const el = document.getElementById('size-calc-container')
      el.style.fontFamily = this._text.fontFamily
      el.style.fontSize = `${this._text.fontSize}px`
      const info = el.getBoundingClientRect()
      return { w: info.width, h: info.height }
   }

}

module.exports = ProfileManager