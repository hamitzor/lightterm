const DEBUG = false
const BUFFERED_RENDERING = true

/* Create an HMTL element with given string */
exports.createEl = str => {
   const div = document.createElement('div')
   div.innerHTML = str.trim()
   return div.firstChild
}

/* Log if 'DEBUG' is set */
exports.log = function (...v) {
   if (DEBUG) {
      console.trace(v)
   }
}

exports.DEBUG = DEBUG
exports.BUFFERED_RENDERING = BUFFERED_RENDERING