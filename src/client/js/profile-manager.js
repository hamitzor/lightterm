
class ProfileManager {
   constructor() {
      this._colors = [
         '#FFF',           //text
         '#000',           //background
         '#000',           //cursor
         '#FFF',             //cursor background
         '#2E3436',          //black
         '#CC0000',            //red
         '#4E9A06',          //green
         '#C4A000',         //yellow
         '#3465A4',           //blue
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
         fontFamily: 'courier-new, courier, monospace',
         fontSize: 14,
         cursorBlinkInterval: 1000
      }
   }

   updateColors(colors) {
      this._colors = { ...this._colors, ...colors }
      return this._colors
   }

   updateText(text) {
      this._text = { ...this._text, ...text }
      return this._text
   }

   updateStyleSheet() {
      let content = `

      .term-tab {
         color: ${this._colors[0]};
         background-color: ${this._colors[1]};
         font-family: ${this._text.fontFamily};
         font-size: ${this._text.fontSize}px;
         padding: 0;
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
      .term-cell-style-400 {
         color: ${this._colors[0]};
      }`

      content = content + `
      .term-cell-style-401 {
         font-weight: normal;
      }
      .term-cell-style-402 {
         font-style: normal;
      }
      .term-cell-style-403 {
         text-decoration: none;
      }
      .term-cell-style-405 {
         background-color: transparent;
      }`

      content = content + `
      .term-cell-style-404 {
         font-family: ${this._text.fontFamily};
      }`


      content = content + `
      @keyframes blinker {
         0% {color: ${this._colors[3]};background-color: ${this._colors[2]};}
         50% {color: ${this._colors[2]};background-color: ${this._colors[3]};}
         100% {color: ${this._colors[3]};background-color: ${this._colors[2]};}
       }
      .term-cursor-cell {
         color: ${this._colors[2]};
         background-color: ${this._colors[3]};
         /*animation: blinker ${this._text.cursorBlinkInterval}ms steps(1, end) infinite*/
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