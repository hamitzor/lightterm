const DEBUG = false

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

exports.postJson = async (url, data) => {
   const res = await fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
   const json = await res.json()
   return json
}

exports.fetchJson = async url => {
   const res = await fetch(url)
   const json = await res.json()
   return json
}

exports.DEBUG = DEBUG