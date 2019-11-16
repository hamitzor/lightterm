require('core-js/stable')

var Convert = require('ansi-to-html')
var convert = new Convert()

console.log(convert.toHtml(`\u001b[0m\u001b[01;34mAndroid\u001b[0m \u001b[01;34mbackups\u001b[0m
   \u001b[01;34mbin\u001b[0m \u001b[01;34mDocuments\u001b[0m \u001b[01;34mDownloads\u001b[0m \u001b[01;34mPictures\u001b[0m
   \u001b[01;34mplayground\u001b[0m \u001b[01;34mPostman\u001b[0m \u001b[01;34mprojects\u001b[0m \u001b[01;34msnap\u001b[0m
   \u001b[01;34msoftware\u001b[0m \u001b[01;36mstoesd_ii_2019-20\u001b[0m `))