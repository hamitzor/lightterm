require('core-js/stable')
require('regenerator-runtime/runtime')
const TerminalManager = require('./terminal-manager')

const demo = async () => {
   const terminalManager = new TerminalManager({
      tabScreensContainerEl: document.getElementById('tab-screens-container'),
      tabTitlesEl: document.getElementById('tab-titles'),
      newTabBtnEl: document.getElementById('new-tab-btn')
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