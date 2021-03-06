const util = require('./util')
const ProfileManager = require('./terminal-emulator/profile-manager')
const TerminalEmulator = require('./terminal-emulator/terminal-emulator')

/* Class which is responsible for managing multiple terminal emulators (tabs) */
class TerminalManager {

   constructor({ tabScreensContainerEl, tabTitlesEl, newTabBtnEl }) {
      /* It needs some elements like, a container element for tab screens, tab titles etc. */
      this._tabScreensContainerEl = tabScreensContainerEl
      this._tabTitlesEl = tabTitlesEl
      this._newTabBtnEl = newTabBtnEl
   }

   async initialize() {
      /* It instantiates ProfileManager to be used in emulators it creates later */
      this._profileManager = new ProfileManager()
      await this._profileManager.initialize()
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
   async resize() {
      /* Resize each tab. No need to specify new row and column numbers since emulator has access to profile
      manager instance */
      for (let i = 0; i < this._tabs.length; i++) {
         await this._tabs[i].emulator.resize()
      }
   }

   /* Force all emulators to recreate their screens. This method is used when styling (font-size, font-family) or
   screen size is updated. */
   async recreateScreens() {
      for (let i = 0; i < this._tabs.length; i++) {
         await this._tabs[i].emulator.recreateScreen()
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
      if (this._tabs.length < 2) {
         document.getElementById(`close-tab-${this._tabs[0].emulator.getSessionId()}`).style.display = 'none'
      }
      this.updateActiveTab()
      this.updateActiveTabTitle()
      this.updateTabTitleStyle()
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
         this._tabTitlesEl.childNodes.item(i).style.width = `${
            100 / this._tabs.length}%`
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
         onBell: () => new Audio('/bell.mp3').play(),
         /* Update title when 'update title command' is given by emulator */
         onTitleUpdate: (title, emulator) => {
            this.updateTabTitleText(this.getTabIndex(emulator.getSessionId()), title)
         }
      })

      /* Create the session for emulator */
      await emulator.createSession()

      /* Add new tab's data */
      this._tabs.push({ sessionId: emulator.getSessionId(), emulator })

      /* Create a button element to be used in closing the tab and add the event listener accordingly */
      const closeBtnEl = util.createEl(`<button id="close-tab-${emulator.getSessionId()}" class="tab-title-close-btn">&#215;</button>`)
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

      if (this._tabs.length === 1) {
         document.getElementById(`close-tab-${this._tabs[0].emulator.getSessionId()}`).style.display = 'none'
      }

      if (this._tabs.length > 1) {
         document.getElementById(`close-tab-${this._tabs[0].emulator.getSessionId()}`).style.display = 'inline-block'
      }

      /* Set the newly created tab as the active one */
      this._activeTab = this.getTabIndex(emulator.getSessionId())
      this.updateActiveTabTitle()
      this.updateTabTitleStyle()
      this.updateActiveTab()

      /* A fix to prevent browser from opening the dragged file */
      termScreenEl.addEventListener('dragover', e => {
         e.preventDefault()
      })

      /* Finally, set busy flag to down */
      this._busy = false
   }
}


module.exports = TerminalManager