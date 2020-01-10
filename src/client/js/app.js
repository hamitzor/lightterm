/* Client-side demo application. Nothing important here though, terminal manager is instantiated and added some 
event listeners to some elements to demonstrate how terminal manager can be used. */
require('core-js/stable')
require('regenerator-runtime/runtime')
const TerminalManager = require('./terminal-manager')

const initializeApplication = async () => {
   const hidedEl = document.getElementById('hide')
   const fontString = `Anonymous+Pro|B612+Mono|Courier+Prime|Cousine|Cutive+Mono|Fira+Code|Fira+Mono|IBM+Plex+Mono|Inconsolata|Major+Mono+Display|Nanum+Gothic+Coding|Nova+Mono|Overpass+Mono|Oxygen+Mono|PT+Mono|Roboto+Mono|Share+Tech+Mono|Source+Code+Pro|Space+Mono|Ubuntu+Mono|VT323`
   const fontNames = fontString.split('|').map(f => f.replace(/\+/g, ' ')).filter(f => f !== 'Roboto')
   fontNames.unshift('monospace')
   fontNames.unshift('Courier10PitchBT')
   hidedEl.innerHTML = fontNames.map(f => `<span style="font-family:${f}">A</span>`).join('')

   /* Instantiate terminal manager by giving it the appropriate elements */
   const terminalManager = new TerminalManager({
      tabScreensContainerEl: document.getElementById('tab-screens-container'),
      tabTitlesEl: document.getElementById('tab-titles'),
      newTabBtnEl: document.getElementById('new-tab-btn'),
      alertEl: document.getElementById('alert')
   })

   /* Create a new tab */
   await terminalManager.newTab()
   const profileManager = terminalManager.getProfileManager()


   /* Select some DOM elements */
   const settingsEl = document.getElementById('settings')
   const settingsOpenBtnEl = document.getElementById('settings-open-btn')
   const settingsCloseBtnEl = document.getElementById('settings-close-btn')
   const coloredSelectEl = document.getElementById('settings-colored')
   const rowSettingInputEl = document.getElementById('settings-input-row')
   const colSettingInputEl = document.getElementById('settings-input-col')
   const fontSizeSettingInputEl = document.getElementById('settings-input-font-size')
   const fontFamilySettingSelectEl = document.getElementById('settings-input-font-family')
   const colorSettingEls = []

   for (let i = 0; i < 20; i++) {
      colorSettingEls[i] = document.getElementById(i)
   }

   fontFamilySettingSelectEl.innerHTML = fontNames.map(f => `<option value="${f}">${f}</option>`).join('')

   /* Read data from profime manager and fill settings accordingly */
   coloredSelectEl.value = profileManager.isColored() ? 'Enabled' : 'Disabled'
   rowSettingInputEl.value = profileManager.getRowNumber()
   colSettingInputEl.value = profileManager.getColNumber()
   fontSizeSettingInputEl.value = profileManager.getTextInformation().fontSize
   fontFamilySettingSelectEl.value = profileManager.getTextInformation().fontFamily
   colorSettingEls.forEach((el, i) => {
      el.value = profileManager.getPalette()[i]
   })

   settingsOpenBtnEl.addEventListener('click', () => {
      settingsEl.classList.remove('hide')
   })

   settingsCloseBtnEl.addEventListener('click', () => {
      settingsEl.classList.add('hide')
   })

   /* When user does changes in one of the settings, apply changes to terminal manager, and force a screen refresh */

   coloredSelectEl.addEventListener('change', e => {
      profileManager.setColored(e.target.value === 'Enabled')
      profileManager.updateStyleSheet()
      terminalManager.forceScreenRefresh()
   })

   rowSettingInputEl.addEventListener('change', e => {
      if (parseInt(e.target.value) !== profileManager.getRowNumber() || parseInt(colSettingInputEl.value) !== profileManager.getColNumber()) {
         terminalManager.resize(parseInt(e.target.value), parseInt(colSettingInputEl.value))
         profileManager.updateStyleSheet()
         terminalManager.forceScreenRefresh()
      }
   })

   colSettingInputEl.addEventListener('change', e => {
      if (parseInt(rowSettingInputEl.value) !== profileManager.getRowNumber() || parseInt(e.target.value) !== profileManager.getColNumber()) {
         terminalManager.resize(parseInt(rowSettingInputEl.value), parseInt(e.target.value))
         profileManager.updateStyleSheet()
         terminalManager.forceScreenRefresh()
      }
   })

   fontSizeSettingInputEl.addEventListener('change', e => {
      profileManager.updateTextInformation({
         fontSize: parseInt(e.target.value)
      })
      profileManager.updateStyleSheet()
      terminalManager.forceScreenRefresh()
   })

   fontFamilySettingSelectEl.addEventListener('change', e => {
      profileManager.updateTextInformation({
         fontFamily: e.target.value
      })
      profileManager.updateStyleSheet()
      terminalManager.forceScreenRefresh()
   })

   colorSettingEls.forEach((el, i) => {
      el.addEventListener('change', e => {
         profileManager.updatePalette(i, e.target.value)
         profileManager.updateStyleSheet()
         terminalManager.forceScreenRefresh()
      })
   })

}

initializeApplication()