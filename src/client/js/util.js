const DEBUG = false
const TERM_INDICATORS = false
const BUFFERED_RENDERING = false

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