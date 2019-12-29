require('core-js/stable')
require('regenerator-runtime/runtime')
const TerminalManager = require('./terminal-manager')

const demo = async () => {
   const hidedEl = document.getElementById('hide')
   const fontString = `Anonymous+Pro|B612+Mono|Courier+Prime|Cousine|Cutive+Mono|Fira+Code|Fira+Mono|IBM+Plex+Mono|Nanum+Gothic+Coding|Nova+Mono|Overpass+Mono|Oxygen+Mono|PT+Mono|Roboto|Share+Tech+Mono|Source+Code+Pro|Space+Mono|Ubuntu+Mono`
   const fontNames = fontString.split('|').map(f => f.replace(/\+/g, ' ')).filter(f => f !== 'Roboto')
   fontNames.unshift('monospace')
   hidedEl.innerHTML = fontNames.map(f => `<span style="font-family:${f}">A</span>`).join('')

   const terminalManager = new TerminalManager({
      tabScreensContainerEl: document.getElementById('tab-screens-container'),
      tabTitlesEl: document.getElementById('tab-titles'),
      newTabBtnEl: document.getElementById('new-tab-btn'),
      alertEl: document.getElementById('alert')
   })

   await terminalManager.newTab()
   const profileManager = terminalManager.getProfileManager()

   const settingsEl = document.getElementById('settings')
   const settingsOpenBtnEl = document.getElementById('settings-open-btn')
   const settingsCloseBtnEl = document.getElementById('settings-close-btn')
   const settingsSaveBtnEl = document.getElementById('settings-save-btn')
   const rowSettingInputEl = document.getElementById('settings-input-row')
   const colSettingInputEl = document.getElementById('settings-input-col')
   const fontSizeSettingInputEl = document.getElementById('settings-input-font-size')
   const fontFamilySettingInputEl = document.getElementById('settings-input-font-family')
   const colorSettingEls = []

   for (let i = 0; i < 20; i++) {
      colorSettingEls[i] = document.getElementById(i)
   }

   fontFamilySettingInputEl.innerHTML = fontNames.map(f => `<option value="${f}">${f}</option>`).join('')

   rowSettingInputEl.value = terminalManager.getRowNumber()
   colSettingInputEl.value = terminalManager.getColNumber()
   fontSizeSettingInputEl.value = profileManager.getTextInformation().fontSize
   fontFamilySettingInputEl.value = profileManager.getTextInformation().fontFamily
   colorSettingEls.forEach((el, i) => {
      el.value = profileManager.getPalette()[i]
   })

   settingsOpenBtnEl.addEventListener('click', () => {
      settingsEl.classList.remove('hide')
   })

   settingsCloseBtnEl.addEventListener('click', () => {
      settingsEl.classList.add('hide')
   })

   settingsSaveBtnEl.addEventListener('click', () => {
      if (parseInt(rowSettingInputEl.value) !== terminalManager.getRowNumber() || parseInt(colSettingInputEl.value) !== terminalManager.getColNumber()) {
         terminalManager.resize(parseInt(rowSettingInputEl.value), parseInt(colSettingInputEl.value))
      }

      profileManager.updateTextInformation({
         fontSize: parseInt(fontSizeSettingInputEl.value),
         fontFamily: fontFamilySettingInputEl.value
      })

      colorSettingEls.forEach((el, i) => {
         profileManager.updatePalette(i, el.value)
      })

      profileManager.updateStyleSheet()
      terminalManager.refreshScreens()
   })
}

demo()