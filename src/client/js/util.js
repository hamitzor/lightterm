exports.delay = function (t) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve()
      }, t)
   })
}