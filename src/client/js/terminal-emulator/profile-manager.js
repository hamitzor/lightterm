/* Class responsible for managing the profile of the emulator. */

class ProfileManager {
   constructor() {
      this._cols = 120/* Column number */
      this._rows = 35/* Row number */

      this._colors = [
         '#FFFFFF',/* Text color. */
         '#222222',/* Background color. */
         '#222222',/* Cursor color. */
         '#FFFFFF',/* Cursor background color. */
         '#2E3436',/* Black */
         '#CC0000',/* Red */
         '#76DB16',/* Green */
         '#C4A000',/* Yellow */
         '#6EADFF',/* Blue */
         '#75507B',/* Magenta */
         '#06989A',/* Black */
         '#D3D7CF',/* White */
         '#555753',/* Bright black */
         '#EF2929',/* Bright red */
         '#8AE234',/* Bright green */
         '#FCE94F',/* Bright yellow */
         '#729FCF',/* Bright blue */
         '#AD7FA8',/* Bright magenta */
         '#34E2E2',/* Bright black */
         '#EEEEEC' /* Bright white */
      ]

      this._text = {
         fontFamily: 'monospace',
         fontSize: 18
      }
   }

   getColNumber() {
      return this._cols
   }

   setColumnNumber(col) {
      this._cols = col
   }

   getRowNumber() {
      return this._rows
   }

   setRowNumber(row) {
      this._rows = row
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

   /* Dynamically create  a stylesheet with respect to stored color and text information */
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

   /* Calculate a 'cell' width and height according to font-family and font-size. This is used by renderer. */
   getCellSize() {
      const el = document.getElementById('size-calc-container')
      el.style.fontFamily = this._text.fontFamily
      el.style.fontSize = `${this._text.fontSize}px`
      const info = el.getBoundingClientRect()
      return { w: info.width, h: info.height }
   }

}

module.exports = ProfileManager