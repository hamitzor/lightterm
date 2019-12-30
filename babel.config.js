/* Babel configuration. Babel is used because some advanced features of JavaScript is used both in client-side
and server-side application. An example of these advanced features is 'arrow functions' */

module.exports = function (api) {
   api.cache(true)

   const presets = [
      ["@babel/env", {
         useBuiltIns: "entry",
         corejs: 3,
         targets: {
            "browsers": "> 1%, not op_mini all",
            "node": 11
         }

      }]
   ]

   return {
      presets
   }
}