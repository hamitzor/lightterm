/* Class responsible for managing the profile of the emulator. */
const util = require('../util')

class ProfileManager {
   constructor() {
      this.initialize()
   }

   async initialize() {
      this._profileJsonData = await this.fetchProfileJson()
      this._selectedProfile = this._profileJsonData.selectedProfile
   }

   getProfileData() {
      return this._profileJsonData.profiles[this._selectedProfile]
   }

   async createNewProfile(name) {
      this._profileJsonData.profiles[name] = JSON.parse(JSON.stringify(this.getProfileData()))
      this._selectedProfile = name
      await this.postProfileJson()
   }

   async postProfileJson() {
      this._profileJsonData.profiles[this._selectedProfile] = JSON.parse(JSON.stringify(this.getProfileData()))
      this._profileJsonData.selectedProfile = this._selectedProfile
      return util.postJson('/profile', this._profileJsonData)
   }

   setProfile(name) {
      this._selectedProfile = name
      this.postProfileJson()
   }

   getProfile() {
      return this._selectedProfile
   }

   async fetchProfileJson() {
      return await util.fetchJson('/profile')
   }

   getAllProfileNames() {
      return Object.keys(this._profileJsonData.profiles)
   }

   async setColored(colored) {
      this.getProfileData().colored = colored
      await this.postProfileJson()
   }

   isColored() {
      return this.getProfileData().colored
   }

   getColNumber() {
      return this.getProfileData().cols
   }

   async setColumnNumber(col) {
      this.getProfileData().cols = col
      await this.postProfileJson()
   }

   getRowNumber() {
      return this.getProfileData().rows
   }

   async setRowNumber(row) {
      this.getProfileData().rows = row
      await this.postProfileJson()
   }

   getPalette() {
      return this.getProfileData().colors
   }

   getTextInformation() {
      return this.getProfileData().text
   }

   async updatePalette(index, val) {
      this.getProfileData().colors[index] = val
      await this.postProfileJson()
   }

   async updateTextInformation(update) {
      this.getProfileData().text = { ...this.getProfileData().text, ...update }
      await this.postProfileJson()
   }

   /* Dynamically create  a stylesheet with respect to stored color and text information */
   updateStyleSheet() {

      const colors = this.getProfileData().colors

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
         color: ${colors[0]};
         background-color: ${colors[1]};
         font-family: ${this.getProfileData().text.fontFamily};
         font-size: ${this.getProfileData().text.fontSize}px;
         padding: 2px;
         cursor: default;
         outline: none;
      }

      .term-inverse-cell{
         color: ${colors[1]};
         background-color: ${colors[0]};
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
            color: ${colors[i + 4]};
         }` + `
         .term-cell-style-${40 + i} {
            background-color: ${colors[i + 4]};
         }`+ `
         .term-cell-style-${90 + i} {
            color: ${colors[i + 8 + 4]};
         }`+ `
         .term-cell-style-${100 + i} {
            background-color: ${colors[i + 8 + 4]};
         }`
      }

      for (i = 0; i < 8; i++) {
         content = content + getCursorStyle(colors[2], colors[i + 4], 30 + i)
         content = content + getCursorStyle(colors[i + 4], colors[3], 40 + i)
         content = content + getCursorStyle(colors[2], colors[i + 8 + 4], 90 + i)
         content = content + getCursorStyle(colors[i + 8 + 4], colors[3], 100 + i)
      }

      content = content + getCursorStyle(colors[2], colors[3])

      document.getElementById('term-style').appendChild(document.createTextNode(content))
   }

   /* Calculate a 'cell' width and height according to font-family and font-size. This is used by renderer. */
   getCellSize() {
      const el = document.getElementById('size-calc-container')
      el.style.fontFamily = this.getProfileData().text.fontFamily
      el.style.fontSize = `${this.getProfileData().text.fontSize}px`
      const info = el.getBoundingClientRect()
      return { w: info.width + 0.5, h: info.height + 0.5 }
   }

}

module.exports = ProfileManager