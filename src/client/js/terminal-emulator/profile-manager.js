/* Class responsible for managing the profile of the emulator. */

class ProfileManager {
   constructor() {
      this._cols = 98/* Column number */
      this._rows = 31/* Row number */
      this._colored = true
      this._colors = [
         '#ffffff',/* Text color. */
         '#191919',/* Background color. */
         '#191919',/* Cursor color. */
         '#ffffff',/* Cursor background color. */
         '#191919',/* Black */
         '#DC322F',/* Red */
         '#00E677',/* Green */
         '#FF8400',/* Yellow */
         '#30c4ff',/* Blue */
         '#B729D9',/* Magenta */
         '#EDD400',/* Cyan */
         '#ffffff',/* White */
         '#191919',/* Bright black */
         '#DC322F',/* Bright red */
         '#00E677',/* Bright green */
         '#FF8400',/* Bright yellow */
         '#30c4ff',/* Bright blue */
         '#B729D9',/* Bright magenta */
         '#EDD400',/* Bright cyan */
         '#ffffff' /* Bright white */
      ]

      this._text = {
         fontFamily: 'Courier10PitchBT',
         fontSize: 24
      }
   }

   setColored(colored) {
      this._colored = colored
   }

   isColored() {
      return this._colored
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

      const getCursorStyle = (color1, color2, n) => `

      @keyframes blinker${n ? `-${n}` : ''} {
         0% { 
            color: ${color1};
            background-color: ${color2};
         }
         50% {
            color: ${color2};
            background-color: ${color1};
         }
         100% {
            color: ${color1};
            background-color: ${color2};
         }
      }

      ${n ? `.term-cell-style-${n}` : ''}.term-cursor-cell {
         color: ${color1};
         background-color: ${color2};
         animation: none
      }
      
      ${n ? `.term-cell-style-${n}` : ''}.term-cursor-cell.stop-animation {
         animation: none
      }

      .term-tab:focus ${n ? `.term-cell-style-${n}` : ''}.term-cursor-cell {
         animation: blinker${n ? `-${n}` : ''} steps(1) 500ms infinite alternate
      }`

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

      .term-inverse-cell{
         color: ${this._colors[1]};
         background-color: ${this._colors[0]};
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

      for (i = 0; i < 8; i++) {
         content = content + getCursorStyle(this._colors[2], this._colors[i + 4], 30 + i)
         content = content + getCursorStyle(this._colors[i + 4], this._colors[3], 40 + i)
         content = content + getCursorStyle(this._colors[2], this._colors[i + 8 + 4], 90 + i)
         content = content + getCursorStyle(this._colors[i + 8 + 4], this._colors[3], 100 + i)
      }

      content = content + getCursorStyle(this._colors[2], this._colors[3])

      document.getElementById('term-style').appendChild(document.createTextNode(content))
   }

   /* Calculate a 'cell' width and height according to font-family and font-size. This is used by renderer. */
   getCellSize() {
      const el = document.getElementById('size-calc-container')
      el.style.fontFamily = this._text.fontFamily
      el.style.fontSize = `${this._text.fontSize}px`
      const info = el.getBoundingClientRect()
      return { w: info.width + 1, h: info.height + 1 }
   }

}

module.exports = ProfileManager