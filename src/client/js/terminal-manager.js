const util = require('./util')
const config = require('./config.json')
const ProfileManager = require('./profile-manager')
const TerminalEmulator = require('./terminal-emulator')


class TerminalManager {
   constructor({ tabScreensContainerEl, tabTitlesEl, newTabBtnEl, alertEl }) {
      this._tabScreensContainerEl = tabScreensContainerEl
      this._tabTitlesEl = tabTitlesEl
      this._newTabBtnEl = newTabBtnEl
      this._alertEl = alertEl
      this._profileManager = new ProfileManager()
      this._profileManager.updateStyleSheet()
      this._rows = 35
      this._cols = 120
      this._tabs = []
      this._activeTab = null
      this._busy = false

      this._newTabBtnEl.addEventListener('click', () => {
         this.newTab()
      })
   }

   async resize(rows, cols) {
      if (!cols && !rows) {
         return
      }
      this._rows = rows
      this._cols = cols
      for (let i = 0; i < this._tabs.length; i++) {
         this._tabs[i].emulator.getContext().resize(rows, cols)
      }
      for (let i = 0; i < this._tabs.length; i++) {
         await fetch(`http://localhost:${config.port}/session/resize/${this._tabs[i].id}/${rows}/${cols}`)
      }
      this.refreshScreens()
   }

   refreshScreens() {
      this._tabs.forEach(tab => {
         tab.emulator.refreshScreen('')
      })
   }

   getRowNumber() {
      return this._rows
   }

   getColNumber() {
      return this._cols
   }

   getProfileManager() {
      return this._profileManager
   }

   getTabIndex(id) {
      for (let i = 0; i < this._tabs.length; i++) {
         if (this._tabs[i].id === id) {
            return i
         }
      }
      return -1
   }

   newTabId() {
      return Math.random().toString(36).substring(7)
   }

   closeTab(index) {
      if (this._tabs.length < 2) {
         return
      }
      this._tabScreensContainerEl.removeChild(this._tabScreensContainerEl.childNodes.item(index))
      this._tabTitlesEl.removeChild(this._tabTitlesEl.childNodes.item(index))
      if (this._activeTab === index) {
         if (index === this._tabs.length - 1) {
            this._activeTab = this._activeTab - 1
         }
      }
      else {
         if (this._activeTab > index) {
            this._activeTab = this._activeTab - 1
         }
      }
      this._tabs.splice(index, 1)
      this.updateActiveTab()
      this.updateActiveTabTitle()
      this.updateTabTitleStyle()
   }

   async uploadFile(targetPath, files) {
      const formData = new FormData()
      formData.append('targetPath', targetPath)
      for (let i = 0; i < files.length; i++) {
         formData.append('file' + i, files[i])
      }
      await fetch(`http://localhost:${config.port}/file`, {
         method: 'POST',
         body: formData
      })
      this._alertEl.innerHTML = 'Uploaded files successfully!'
      this._alertEl.classList.add('show')
      setTimeout(() => {
         this._alertEl.classList.remove('show')
      }, 2000)
   }

   changeTab(index) {
      this._activeTab = index
      this.updateActiveTabTitle()
      this.updateActiveTab()
      this._tabs[index].emulator.getEl().focus()
   }

   updateActiveTab() {
      const tabScreens = this._tabScreensContainerEl.childNodes
      const tab = tabScreens.item(this._activeTab)
      tab.classList.remove('hide')
      for (let i = 0; i < tabScreens.length; i++) {
         if (i !== this._activeTab) {
            tabScreens.item(i).classList.add('hide')
         }
      }
   }

   updateActiveTabTitle() {
      const tabTitles = this._tabTitlesEl.childNodes
      for (let i = 0; i < tabTitles.length; i++) {
         tabTitles.item(i).classList.add('inactive')
      }
      tabTitles.item(this._activeTab).classList.remove('inactive')
   }

   updateTabTitleStyle() {
      const tabTitles = this._tabTitlesEl.childNodes
      for (let i = 0; i < tabTitles.length; i++) {
         this._tabTitlesEl.childNodes.item(i).style.width = `${100 / this._tabs.length}%`
      }
   }

   updateTabTitleText(index, title) {
      this._tabTitlesEl.childNodes.item(index).firstChild.innerHTML = title
   }

   async createSession() {
      const res = await fetch(`http://localhost:${config.port}/session/create/${this._rows}/${this._cols}`)
      const { response: { sessionId } } = await res.json()
      return { sessionId, ws: new WebSocket(`ws://localhost:${config.port}/session/connect/${sessionId}`) }
   }

   async newTab() {
      if (this._busy) {
         return
      }
      this._busy = true
      const termScreenEl = util.createEl(`<div class="term-tab hide"></div>`)
      this._tabScreensContainerEl.appendChild(termScreenEl)
      const { sessionId, ws } = await this.createSession()
      const emulator = new TerminalEmulator({
         profileManager: this._profileManager,
         termScreenEl,
         rows: this._rows,
         cols: this._cols,
         webSocket: ws,
         onBell: () => new Audio('/public/bell.mp3').play(),
         onTitleUpdate: title => {
            this.updateTabTitleText(this.getTabIndex(sessionId), title)
            this._tabs[this.getTabIndex(sessionId)].title = title
         }
      })
      ws.addEventListener('open', () => {
         emulator.connect()
         emulator.focus()
      })
      this._tabs.push({ id: sessionId, emulator, title: '~' })
      const closeBtnEl = util.createEl('<button class="tab-title-close-btn">&#215;</button>')
      closeBtnEl.addEventListener('click', e => {
         e.stopPropagation()
         this.closeTab(this.getTabIndex(sessionId))
      })
      const tabTitleEl = util.createEl(`<div class="tab-title"><div>~</div></div>`)
      tabTitleEl.addEventListener('click', () => this.changeTab(this.getTabIndex(sessionId)))
      tabTitleEl.appendChild(closeBtnEl)
      this._tabTitlesEl.append(tabTitleEl)
      this._activeTab = this.getTabIndex(sessionId)
      this.updateActiveTabTitle()
      this.updateTabTitleStyle()
      this.updateActiveTab()

      termScreenEl.addEventListener('drop', e => {
         e.preventDefault()
         const files = e.dataTransfer.files
         const targetPath = new RegExp(/.*@.*:(.*)/g).exec(this._tabs[this.getTabIndex(sessionId)].title)[1]
         this.uploadFile(targetPath, files)
      })

      termScreenEl.addEventListener('dragover', e => {
         e.preventDefault()
      })

      this._busy = false
   }
}


module.exports = TerminalManager