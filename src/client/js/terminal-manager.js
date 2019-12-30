const util = require('./util')
const config = require('../../../config.json')
const ProfileManager = require('./terminal-emulator/profile-manager')
const TerminalEmulator = require('./terminal-emulator/terminal-emulator')

/* Class which is responsible for managing multiple terminal emulators (tabs) */
class TerminalManager {


   constructor({ tabScreensContainerEl, tabTitlesEl, newTabBtnEl, alertEl }) {
      /* It needs some elements like, a container element for tab screens, tab titles etc. */
      this._tabScreensContainerEl = tabScreensContainerEl
      this._tabTitlesEl = tabTitlesEl
      this._newTabBtnEl = newTabBtnEl
      this._alertEl = alertEl
      /* It instantiates ProfileManager to be used in emulators it creates later */
      this._profileManager = new ProfileManager()
      /* call updateStyleSheet to update stylesheet used in rendering in emulators */
      this._profileManager.updateStyleSheet()
      /* Array holds each tab's data */
      this._tabs = []
      /* Variable holds an index, which indicates the active tab */
      this._activeTab = null
      /* Flag specifies whether a tab is currently being created */
      this._busy = false

      /* Bind handler for creating new tabs */
      this._newTabBtnEl.addEventListener('click', () => {
         this.newTab()
      })
   }

   /* Resize all tabs */
   async resize(row, col) {
      if (!col && !row) {
         return
      }
      /* Update profile manager accordingly */
      this._profileManager.setRowNumber(row)
      this._profileManager.setColumnNumber(col)

      /* Resize each tab. No need to specify new row and column numbers since emulator has access to profile
      manager instance */
      for (let i = 0; i < this._tabs.length; i++) {
         await this._tabs[i].emulator.resize()
      }
   }

   /* Force all emulators for a screen refresh. This method is used when styling are (font-size, font-family, colors)
   updated. */
   async forceScreenRefresh() {
      for (let i = 0; i < this._tabs.length; i++) {
         await this._tabs[i].emulator.refreshScreen('')
      }
   }

   /* Return profile manager instance */
   getProfileManager() {
      return this._profileManager
   }

   /* Return tab index by given session id */
   getTabIndex(id) {
      for (let i = 0; i < this._tabs.length; i++) {
         if (this._tabs[i].sessionId === id) {
            return i
         }
      }
      return -1
   }

   /* Close a tab. Rearrange the order of tabs and active tab. Resize the width of each tab title */
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

   /* Upload a file to the remote machine using HTTP. This is called when user drops a file into the tab screen. 
   Show information alert after upload. */
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

   /* Change the active tab. This is called when user clicks on of tab's title */
   changeTab(index) {
      this._activeTab = index
      this.updateActiveTabTitle()
      this.updateActiveTab()
      this._tabs[index].emulator.getEl().focus()
   }

   /* Remove all tabs' screen beside the active one */
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

   /* Remove the inactive css class from active tab's title and add it to all other tabs' titles */
   updateActiveTabTitle() {
      const tabTitles = this._tabTitlesEl.childNodes
      for (let i = 0; i < tabTitles.length; i++) {
         tabTitles.item(i).classList.add('inactive')
      }
      tabTitles.item(this._activeTab).classList.remove('inactive')
   }

   /* Rearrange the width of each tab's title according to tab number */
   updateTabTitleStyle() {
      const tabTitles = this._tabTitlesEl.childNodes
      for (let i = 0; i < tabTitles.length; i++) {
         this._tabTitlesEl.childNodes.item(i).style.width = `${100 / this._tabs.length}%`
      }
   }

   /* Update the text of the the active tab's title */
   updateTabTitleText(index, title) {
      this._tabTitlesEl.childNodes.item(index).firstChild.innerHTML = title
   }

   /* Create a new tab */
   async newTab() {
      /* If busy, skip */
      if (this._busy) {
         return
      }
      /* Set busy flag to prevent conflicts */
      this._busy = true
      /* Create the tab screen root element */
      const termScreenEl = util.createEl(`<div class="term-tab hide"></div>`)
      /* Append it into DOM */
      this._tabScreensContainerEl.appendChild(termScreenEl)
      /* Instantiate TerminalEmulator */
      const emulator = new TerminalEmulator({
         profileManager: this._profileManager,
         termScreenEl,
         /* Play a sample bell sound if 'play bell command' is given by emulator */
         onBell: () => new Audio('/public/bell.mp3').play(),
         /* Update title when 'update title command' is given by emulator */
         onTitleUpdate: (title, emulator) => {
            this.updateTabTitleText(this.getTabIndex(emulator.getSessionId()), title)
            this._tabs[this.getTabIndex(emulator.getSessionId())].title = title
         }
      })

      /* Create the session for emulator */
      await emulator.createSession()

      /* Add new tab's data */
      this._tabs.push({ sessionId: emulator.getSessionId(), emulator, title: '~' })

      /* Create a button element to be used in closing the tab and add the event listener accordingly */
      const closeBtnEl = util.createEl('<button class="tab-title-close-btn">&#215;</button>')
      closeBtnEl.addEventListener('click', e => {
         e.stopPropagation()
         this.closeTab(this.getTabIndex(emulator.getSessionId()))
      })

      /* Create a div element to be used as the title of the tab */
      const tabTitleEl = util.createEl(`<div class="tab-title"><div>~</div></div>`)
      /* Add event listener which allows user to select a tab */
      tabTitleEl.addEventListener('click', () => this.changeTab(this.getTabIndex(emulator.getSessionId())))

      /* Append the elements into DOM */
      tabTitleEl.appendChild(closeBtnEl)
      this._tabTitlesEl.append(tabTitleEl)

      /* Set the newly created tab as the active one */
      this._activeTab = this.getTabIndex(emulator.getSessionId())
      this.updateActiveTabTitle()
      this.updateTabTitleStyle()
      this.updateActiveTab()

      /* Add 'drop file' event listener */
      termScreenEl.addEventListener('drop', e => {
         e.preventDefault()
         const files = e.dataTransfer.files
         /* Tab's title is used to decide where to upload the file */
         const targetPath = new RegExp(/.*@.*:(.*)/g).exec(this._tabs[this.getTabIndex(emulator.getSessionId())].title)[1]
         this.uploadFile(targetPath, files)
      })

      /* A fix to prevent browser from opening the dragged file */
      termScreenEl.addEventListener('dragover', e => {
         e.preventDefault()
      })

      /* Finally, set busy flag to down */
      this._busy = false
   }
}


module.exports = TerminalManager