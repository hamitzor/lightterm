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