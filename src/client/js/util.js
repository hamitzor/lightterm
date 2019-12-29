const DEBUG = true
const TERM_INDICATORS = false
const BUFFERED_RENDERING = true

exports.createEl = str => {
   const div = document.createElement('div')
   div.innerHTML = str.trim()
   return div.firstChild
}

exports.log = function (...v) {
   if (DEBUG) {
      console.trace(v)
   }
}

exports.delay = function (t) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve()
      }, t)
   })
}

exports.DEBUG = DEBUG
exports.TERM_INDICATORS = TERM_INDICATORS
exports.BUFFERED_RENDERING = BUFFERED_RENDERING