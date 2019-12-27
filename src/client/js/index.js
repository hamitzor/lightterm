require('core-js/stable')
require('regenerator-runtime/runtime')
const profileManager = require('./profile-manager')

const Context = require('./context')
const Renderer = require('./renderer')
const OutputParser = require('./output-parser')

const context = new Context({ cols: 120, rows: 35 })
global.context = context
const renderer = new Renderer({ termScreenEl: document.getElementById('term-tab'), context })
const outputParser = new OutputParser({ colorProfile: {}, context })

profileManager.updateStyleSheet()
console.log(profileManager.getCellSize())

let outputs1 = [
   '\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;34m~/playground \u001b[1;30m$\u001b[0m ',
   'colortest-16',
   '\r\n',
   '\u001b[0m\r\n',
   '\u001b[0;0m   \u001b[30m BLK \u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU ',
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN ',
   '\u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n\u001b[0;0m   \u001b[90m+BLK ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;0m   \u001b[31m RED ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN ',
   '\u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU ',
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN ' +
   '\u001b[106m+CYN \u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n' +
   '\u001b[0;0m   \u001b[91m+RED \u001b[41mRED \u001b[101m+RED ' +
   '\u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL ' +
   '\u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ' +
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ' +
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;0m   \u001b[32m GRN ' +
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN ' +
   '\u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU ' +
   '\u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN ' +
   '\u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[30m BLK \u001b[41mRED \u001b[101m+RED ',
   '\u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;1mBO \u001b[90m+BLK ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN ',
   '\u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU ',
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN ',
   '\u001b[106m+CYN \u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[30m BLK \u001b[41mRED \u001b[101m+RED ',
   '\u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;1mBO \u001b[90m+BLK ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN ',
   '\u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU ',
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN ',
   '\u001b[106m+CYN \u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[30m BLK \u001b[41mRED \u001b[101m+RED ',
   '\u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;1mBO \u001b[90m+BLK ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN ',
   '\u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU ',
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN ',
   '\u001b[106m+CYN \u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;1mBO \u001b[31m RED \u001b[41mRED ',
   '\u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL ',
   '\u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0m\r\n',
   '\u001b[0m\r\n',
   '\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;34m~/playground \u001b[1;30m$\u001b[0m This is a command...'
]

let outputs2 = ['Kurek. ', ' Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak...bye \nTarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak... Tarak...']

outputs2 = ['\u001b[01;34m~/playground \u001b[1;30m$\u001b[0m ',
   'cd /home/hamit/projects/js/light-terminal-OLD\r\n',
   '\u001b[01;34m~/projects/js/light-terminal-OLD \u001b[1;30m$\u001b[0m ',
   'yarn watch\r\n',
   '\u001b[2m$ webpack --watch --mode development\u001b[22m\r\n',
   '\r\nwebpack is watching the files…\r\n\r\n',
   'Hash: \u001b[1md5e287b37462ded386cb70ca1129e904',
   '0d086ab0\u001b[39m\u001b[22m\r\nVersion: webpack \u001b[1m4.41.2\u001b[39m\u001b[22m\r\nChild\r\n    ',
   'Hash: \u001b[1md5e287b37462ded386cb\u001b[39m\u001b[22m\r\n    Time: \u001b[1m2497\u001b[39m\u001b[22mms\r\n    ',
   'Built at: 12/27/2019 \u001b[1m1:28:20 PM\u001b[39m\u001b[22m\r\n                   \u001b[1mAsset\u001b[39m\u001b[22m      \u001b[1mSize\u001b[39m\u001b[22m  \u001b[1mChunks\u001b[39m\u001b[22m  \u001b[1m\u001b[39m\u001b[22m       ',
   '          \u001b[1m\u001b[39m\u001b[22m\u001b[1mChunk Names\u001b[39m\u001b[22m\r\n        \u001b[1m\u001b[32mbundle.server.js\u001b[39m\u001b[22m  1.01 MiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\r\n    \u001b[1m\u001b[32mbundle.server.js.map\u001b[39m\u001b[22m   610 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\r\n    ',
   'Entrypoint \u001b[1mmain\u001b[39m\u001b[22m = \u001b[1m\u001b[32mbundle.server.js\u001b[39m\u001b[22m \u001b[1m\u001b[32mbundle.server.js.map\u001b[39m\u001b[22m\r\n    [../../config.json] \u001b[1m/home/hamit/projects/js/light-terminal-OLD/config.json\u001b[39m\u001b[22m 19 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./app.js\u001b[39m\u001b[22m] 483 bytes',
   ' {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/command-controller.js\u001b[39m\u001b[22m] 515 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/create-session-controller.js\u001b[39m\u001b[22m] 561 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m ',
   '[built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/home-controller.js\u001b[39m\u001b[22m] 139 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./index.js\u001b[39m\u001b[22m] 17 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/command-router.js\u001b[39m\u001b[22m] 185 bytes',
   ' {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/create-session-router.js\u001b[39m\u001b[22m] 199 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/home-router.js\u001b[39m\u001b[22m] 162 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    ',
   '[\u001b[1m./routers/index.js\u001b[39m\u001b[22m] 273 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./session-manager/index.js\u001b[39m\u001b[22m] 3.28 KiB {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [events] \u001b[1mexternal "events"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m ',
   '[built]\u001b[39m\u001b[22m\r\n    [http] \u001b[1mexternal "http"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [path] \u001b[1mexternal "path"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [querystring] \u001b[1mexternal "querystring"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mma',
   'in\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n        + 123 hidden modules\r\nChild\r\n    Hash: \u001b[1m70ca1129e9040d086ab0\u001b[39m\u001b[22m\r\n    Time: \u001b[1m1937\u001b[39m\u001b[22mms\r\n    Built at: 12/27/2019 \u001b[1m1:28:19 PM\u001b[39m\u001b[22m\r\n            \u001b[1mAsset\u001b[39m\u001b[22m     \u001b[1mSize\u001b[39m\u001b[22m  \u001b[1mChunks\u001b[39m\u001b[22m  \u001b[1m\u001b[39m\u001b[22m      ',
   '           \u001b[1m\u001b[39m\u001b[22m\u001b[1mChunk Names\u001b[39m\u001b[22m\r\n        \u001b[1m\u001b[32mbundle.js\u001b[39m\u001b[22m  675 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\r\n    \u001b[1m\u001b[32mbundle.js.map\u001b[39m\u001b[22m  490 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\r\n    Entrypoint \u001b[1mm',
   'ain\u001b[39m\u001b[22m = \u001b[1m\u001b[32mbundle.js\u001b[39m\u001b[22m \u001b[1m\u001b[32mbundle.js.map\u001b[39m\u001b[22m\r\n    [../../../node_modules/webpack/buildin/global.js] \u001b[1m(webpack)/buildin/global.js\u001b[39m\u001b[22m 472 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [./index.js] \u001b[1m../client/js/index.js\u001b[39m\u001b[22m 10.9 KiB {\u001b[1m\u001b[33m',
   'main\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n        + 333 hidden modules\r\n']

outputs1 = [
   '\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground\u001b[00m$ ',
   'colortest-16b\r\n',
   '\r\nTable for 16-color terminal escape sequences.\r\nReplace ESC with \\033 in bash.\r\n\r\n',
   'Background | Foreground colors\r\n---------------------------------------------------------------------\r\n',
   '\u001b[0m ESC[40m   | \u001b[40m\u001b[30m [30m  \u001b[40m\u001b[31m [31m  ',
   '\u001b[40m\u001b[32m [32m  \u001b[40m\u001b[33m [33m  \u001b[40m\u001b[34m [34m  ',
   '\u001b[40m\u001b[35m [35m  \u001b[40m\u001b[36m [36m  \u001b[40m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[40m   | \u001b[40m\u001b[1;30m [1;30m\u001b[40m\u001b[1;31m [1;31m',
   '\u001b[40m\u001b[1;32m [1;32m',
   '\u001b[40m\u001b[1;33m [1;33m\u001b[40m\u001b[1;34m [1;34m',
   '\u001b[40m\u001b[1;35m [1;35m\u001b[40m\u001b[1;36m [1;36m',
   '\u001b[40m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[41m   | ',
   '\u001b[41m\u001b[30m [30m  ',
   '\u001b[41m\u001b[31m [31m  ',
   '\u001b[41m\u001b[32m [32m  \u001b[41m\u001b[33m [33m  ',
   '\u001b[41m\u001b[34m [34m  ',
   '\u001b[41m\u001b[35m [35m  ',
   '\u001b[41m\u001b[36m [36m  ',
   '\u001b[41m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[41m   | ',
   '\u001b[41m\u001b[1;30m [1;30m',
   '\u001b[41m\u001b[1;31m [1;31m\u001b[41m\u001b[1;32m [1;32m',
   '\u001b[41m\u001b[1;33m [1;33m',
   '\u001b[41m\u001b[1;34m [1;34m',
   '\u001b[41m\u001b[1;35m [1;35m',
   '\u001b[41m\u001b[1;36m [1;36m',
   '\u001b[41m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[42m   | \u001b[42m\u001b[30m [30m  ',
   '\u001b[42m\u001b[31m [31m  ',
   '\u001b[42m\u001b[32m [32m  ',
   '\u001b[42m\u001b[33m [33m  ',
   '\u001b[42m\u001b[34m [34m  ',
   '\u001b[42m\u001b[35m [35m  ',
   '\u001b[42m\u001b[36m [36m  \u001b[42m\u001b[37m [37m  ',
   '\u001b[0m\r\n\u001b[0m ESC[42m   | ',
   '\u001b[42m\u001b[1;30m [1;30m',
   '\u001b[42m\u001b[1;31m [1;31m',
   '\u001b[42m\u001b[1;32m [1;32m',
   '\u001b[42m\u001b[1;33m [1;33m',
   '\u001b[42m\u001b[1;34m [1;34m',
   '\u001b[42m\u001b[1;35m [1;35m\u001b[42m\u001b[1;36m [1;36m',
   '\u001b[42m\u001b[1;37m [1;37m',
   '\u001b[0m\r\n--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[43m   | ',
   '\u001b[43m\u001b[30m [30m  ',
   '\u001b[43m\u001b[31m [31m  ',
   '\u001b[43m\u001b[32m [32m  ',
   '\u001b[43m\u001b[33m [33m  ',
   '\u001b[43m\u001b[34m [34m  \u001b[43m\u001b[35m [35m  ',
   '\u001b[43m\u001b[36m [36m  ',
   '\u001b[43m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[43m   | ',
   '\u001b[43m\u001b[1;30m [1;30m',
   '\u001b[43m\u001b[1;31m [1;31m',
   '\u001b[43m\u001b[1;32m [1;32m\u001b[43m\u001b[1;33m [1;33m',
   '\u001b[43m\u001b[1;34m [1;34m',
   '\u001b[43m\u001b[1;35m [1;35m',
   '\u001b[43m\u001b[1;36m [1;36m',
   '\u001b[43m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[44m   | ',
   '\u001b[44m\u001b[30m [30m  ',
   '\u001b[44m\u001b[31m [31m  \u001b[44m\u001b[32m [32m  ',
   '\u001b[44m\u001b[33m [33m  ',
   '\u001b[44m\u001b[34m [34m  ',
   '\u001b[44m\u001b[35m [35m  ',
   '\u001b[44m\u001b[36m [36m  ',
   '\u001b[44m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[44m   | ',
   '\u001b[44m\u001b[1;30m [1;30m\u001b[44m\u001b[1;31m [1;31m',
   '\u001b[44m\u001b[1;32m [1;32m',
   '\u001b[44m\u001b[1;33m [1;33m',
   '\u001b[44m\u001b[1;34m [1;34m',
   '\u001b[44m\u001b[1;35m [1;35m',
   '\u001b[44m\u001b[1;36m [1;36m',
   '\u001b[44m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n\u001b[0m ESC[45m   | ',
   '\u001b[45m\u001b[30m [30m  ',
   '\u001b[45m\u001b[31m [31m  ',
   '\u001b[45m\u001b[32m [32m  ',
   '\u001b[45m\u001b[33m [33m  ',
   '\u001b[45m\u001b[34m [34m  ',
   '\u001b[45m\u001b[35m [35m  \u001b[45m\u001b[36m [36m  ',
   '\u001b[45m\u001b[37m [37m  ',
   '\u001b[0m\r\n\u001b[0m ESC[45m   | ',
   '\u001b[45m\u001b[1;30m [1;30m',
   '\u001b[45m\u001b[1;31m [1;31m',
   '\u001b[45m\u001b[1;32m [1;32m',
   '\u001b[45m\u001b[1;33m [1;33m',
   '\u001b[45m\u001b[1;34m [1;34m\u001b[45m\u001b[1;35m [1;35m',
   '\u001b[45m\u001b[1;36m [1;36m',
   '\u001b[45m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\r\n\r\n',
   '\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground\u001b[00m$\u001b[0m This is a command...']

outputs1 = ['\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground\u001b[00m$ ',
   'colortest-16b\r\n',
   '\r\nTable for 16-color terminal escape sequences.\r\nReplace ESC with \\033 in bash.\r\n\r\nBackground | Foreground colors\r\n',
   '---------------------------------------------------------------------\r\n',
   '\u001b[0m ESC[40m   | \u001b[40m\u001b[30m [30m  ',
   '\u001b[40m\u001b[31m [31m  ',
   '\u001b[40m\u001b[32m [32m  \u001b[40m\u001b[33m [33m  ',
   '\u001b[40m\u001b[34m [34m  \u001b[40m\u001b[35m [35m  ',
   '\u001b[40m\u001b[36m [36m  ',
   '\u001b[40m\u001b[37m [37m  \u001b[0m\r\n\u001b[0m ESC[40m   | ',
   '\u001b[40m\u001b[1;30m [1;30m',
   '\u001b[40m\u001b[1;31m [1;31m',
   '\u001b[40m\u001b[1;32m [1;32m\u001b[40m\u001b[1;33m [1;33m',
   '\u001b[40m\u001b[1;34m [1;34m\u001b[40m\u001b[1;35m [1;35m',
   '\u001b[40m\u001b[1;36m [1;36m',
   '\u001b[40m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n\u001b[0m ESC[41m   | ',
   '\u001b[41m\u001b[30m [30m  ',
   '\u001b[41m\u001b[31m [31m  \u001b[41m\u001b[32m [32m  ',
   '\u001b[41m\u001b[33m [33m  \u001b[41m\u001b[34m [34m  ',
   '\u001b[41m\u001b[35m [35m  ',
   '\u001b[41m\u001b[36m [36m  \u001b[41m\u001b[37m [37m  ',
   '\u001b[0m\r\n\u001b[0m ESC[41m   | ',
   '\u001b[41m\u001b[1;30m [1;30m\u001b[41m\u001b[1;31m [1;31m',
   '\u001b[41m\u001b[1;32m [1;32m',
   '\u001b[41m\u001b[1;33m [1;33m\u001b[41m\u001b[1;34m [1;34m',
   '\u001b[41m\u001b[1;35m [1;35m',
   '\u001b[41m\u001b[1;36m [1;36m\u001b[41m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[42m   | \u001b[42m\u001b[30m [30m  ',
   '\u001b[42m\u001b[31m [31m  ',
   '\u001b[42m\u001b[32m [32m  \u001b[42m\u001b[33m [33m  ',
   '\u001b[42m\u001b[34m [34m  \u001b[42m\u001b[35m [35m  ',
   '\u001b[42m\u001b[36m [36m  ',
   '\u001b[42m\u001b[37m [37m  \u001b[0m\r\n\u001b[0m ESC[42m   | ',
   '\u001b[42m\u001b[1;30m [1;30m',
   '\u001b[42m\u001b[1;31m [1;31m\u001b[42m\u001b[1;32m [1;32m',
   '\u001b[42m\u001b[1;33m [1;33m',
   '\u001b[42m\u001b[1;34m [1;34m\u001b[42m\u001b[1;35m [1;35m',
   '\u001b[42m\u001b[1;36m [1;36m\u001b[42m\u001b[1;37m [1;37m',
   '\u001b[0m\r\n--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[43m   | \u001b[43m\u001b[30m [30m  ',
   '\u001b[43m\u001b[31m [31m  ',
   '\u001b[43m\u001b[32m [32m  \u001b[43m\u001b[33m [33m  ',
   '\u001b[43m\u001b[34m [34m  \u001b[43m\u001b[35m [35m  ',
   '\u001b[43m\u001b[36m [36m  \u001b[43m\u001b[37m [37m  ',
   '\u001b[0m\r\n\u001b[0m ESC[43m   | ',
   '\u001b[43m\u001b[1;30m [1;30m\u001b[43m\u001b[1;31m [1;31m',
   '\u001b[43m\u001b[1;32m [1;32m',
   '\u001b[43m\u001b[1;33m [1;33m\u001b[43m\u001b[1;34m [1;34m',
   '\u001b[43m\u001b[1;35m [1;35m\u001b[43m\u001b[1;36m [1;36m',
   '\u001b[43m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[44m   | \u001b[44m\u001b[30m [30m  ',
   '\u001b[44m\u001b[31m [31m  ',
   '\u001b[44m\u001b[32m [32m  \u001b[44m\u001b[33m [33m  ',
   '\u001b[44m\u001b[34m [34m  \u001b[44m\u001b[35m [35m  ',
   '\u001b[44m\u001b[36m [36m  ',
   '\u001b[44m\u001b[37m [37m  \u001b[0m\r\n\u001b[0m ESC[44m   | ',
   '\u001b[44m\u001b[1;30m [1;30m',
   '\u001b[44m\u001b[1;31m [1;31m\u001b[44m\u001b[1;32m [1;32m',
   '\u001b[44m\u001b[1;33m [1;33m\u001b[44m\u001b[1;34m [1;34m',
   '\u001b[44m\u001b[1;35m [1;35m',
   '\u001b[44m\u001b[1;36m [1;36m\u001b[44m\u001b[1;37m [1;37m',
   '\u001b[0m\r\n--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[45m   | \u001b[45m\u001b[30m [30m  ',
   '\u001b[45m\u001b[31m [31m  ',
   '\u001b[45m\u001b[32m [32m  \u001b[45m\u001b[33m [33m  ',
   '\u001b[45m\u001b[34m [34m  \u001b[45m\u001b[35m [35m  ',
   '\u001b[45m\u001b[36m [36m  ',
   '\u001b[45m\u001b[37m [37m  \u001b[0m\r\n\u001b[0m ESC[45m   | ',
   '\u001b[45m\u001b[1;30m [1;30m',
   '\u001b[45m\u001b[1;31m [1;31m\u001b[45m\u001b[1;32m [1;32m',
   '\u001b[45m\u001b[1;33m [1;33m',
   '\u001b[45m\u001b[1;34m [1;34m\u001b[45m\u001b[1;35m [1;35m',
   '\u001b[45m\u001b[1;36m [1;36m',
   '\u001b[45m\u001b[1;37m [1;37m\u001b[0m\r\n--------------------------------------------------------------------- \r\n',
   '\u001b[0m ESC[46m   | ',
   '\u001b[46m\u001b[30m [30m  \u001b[46m\u001b[31m [31m  ',
   '\u001b[46m\u001b[32m [32m  ',
   '\u001b[46m\u001b[33m [33m  \u001b[46m\u001b[34m [34m  ',
   '\u001b[46m\u001b[35m [35m  \u001b[46m\u001b[36m [36m  ',
   '\u001b[46m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[46m   | \u001b[46m\u001b[1;30m [1;30m',
   '\u001b[46m\u001b[1;31m [1;31m',
   '\u001b[46m\u001b[1;32m [1;32m\u001b[46m\u001b[1;33m [1;33m',
   '\u001b[46m\u001b[1;34m [1;34m\u001b[46m\u001b[1;35m [1;35m',
   '\u001b[46m\u001b[1;36m [1;36m',
   '\u001b[46m\u001b[1;37m [1;37m\u001b[0m\r\n',
   '--------------------------------------------------------------------- \r\n\u001b[0m ESC[47m   | ',
   '\u001b[47m\u001b[30m [30m  ',
   '\u001b[47m\u001b[31m [31m  \u001b[47m\u001b[32m [32m  ',
   '\u001b[47m\u001b[33m [33m  \u001b[47m\u001b[34m [34m  ',
   '\u001b[47m\u001b[35m [35m  \u001b[47m\u001b[36m [36m  ',
   '\u001b[47m\u001b[37m [37m  \u001b[0m\r\n',
   '\u001b[0m ESC[47m   | \u001b[47m\u001b[1;30m [1;30m',
   '\u001b[47m\u001b[1;31m [1;31m\u001b[47m\u001b[1;32m [1;32m\u001b[47m\u001b[1;33m [1;33m',
   '\u001b[47m\u001b[1;34m [1;34m\u001b[47m\u001b[1;35m [1;35m',
   '\u001b[47m\u001b[1;36m [1;36m\u001b[47m\u001b[1;37m [1;37m',
   '\u001b[0m\r\n--------------------------------------------------------------------- \r\n',
   '\r\n\r\n',
   '\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground\u001b[00m$ A new command']


outputs1 = ['\u001b]0;hamit@hamit-n: ~/playground\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground\u001b[00m$ ',
   'cd /home/hamit/projects/js/light-terminal-OLD\r\n',
   '\u001b]0;hamit@hamit-n: ~/projects/js/light-terminal-OLD\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/projects/js/light-terminal-OLD\u001b[00m$ ',
   'yarn watch\r\n',
   '\u001b[2K',
   '\u001b[1G\u001b[2m$ webpack --watch --mode development\u001b[22m\r\n',
   '\r\nwebpack is watching the files…\r\n\r\n',
   'Hash: \u001b[1md5e287b37462ded386cb70ca1129e9040d086ab0\u001b[39m\u001b[22m\r\nVersion: webpack \u001b[1m4.41.2\u001b[39m\u001b[22m\r\nChild\r\n    Hash: \u001b[1md5e287b37462ded386cb\u001b[39m\u001b[22m\r\n    Time: \u001b[1m2470\u001b[39m\u001b[22mms\r\n    Built at: 12/27/2019 \u001b[1m8:48:49 PM\u001b[39m\u001b[22m\r\n                   \u001b[1mAsset\u001b[39m\u001b[22m      \u001b[1mSize\u001b[39m\u001b[22m  \u001b[1mChunks\u001b[39m\u001b[22m  \u001b[1m\u001b[39m\u001b[22m                 \u001b[1m\u001b[39m\u001b[22m\u001b[1mChunk Names\u001b[39m\u001b[22m\r\n        \u001b[1m\u001b[32mbundle.server.js\u001b[39m\u001b[22m  1.01 MiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\r\n    \u001b[1m\u001b[32mbundle.server.js.map\u001b[39m\u001b[22m   610 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\r\n    Entrypoint \u001b[1mmain\u001b[39m\u001b[22m = \u001b[1m\u001b[32mbundle.server.js\u001b[39m\u001b[22m \u001b[1m\u001b[32mbundle.server.js.map\u001b[39m\u001b[22m\r\n    [../../config.json] \u001b[1m/home/hamit/projects/js/light-terminal-OLD/config.json\u001b[39m\u001b[22m 19 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./app.js\u001b[39m\u001b[22m] 483 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/command-controller.js\u001b[39m\u001b[22m] 515 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/create-session-controller.js\u001b[39m\u001b[22m] 561 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./controllers/home-controller.js\u001b[39m\u001b[22m] 139 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./index.js\u001b[39m\u001b[22m] 17 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/command-router.js\u001b[39m\u001b[22m] 185 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/create-session-router.js\u001b[39m\u001b[22m] 199 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/home-router.js\u001b[39m\u001b[22m] 162 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./routers/index.js\u001b[39m\u001b[22m] 273 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [\u001b[1m./session-manager/index.js\u001b[39m\u001b[22m] 3.28 KiB {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [events] \u001b[1mexternal "events"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [http] \u001b[1mexternal "http"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [path] \u001b[1mexternal "path"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [querystring] \u001b[1mexternal "querystring"\u001b[39m\u001b[22m 42 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n        + 123 hidden modules\r\nChild\r\n    Hash: \u001b[1m70ca1129e9040d086ab0\u001b[39m\u001b[22m\r\n    Time: \u001b[1m1787\u001b[39m\u001b[22mms\r\n    Built at: 12/27/2019 \u001b[1m8:48:48 PM\u001b[39m\u001b[22m\r\n            \u001b[1mAsset\u001b[39m\u001b[22m     \u001b[1mSize\u001b[39m\u001b[22m  \u001b[1mChunks\u001b[39m\u001b[22m  \u001b[1m\u001b[39m\u001b[22m                 \u001b[1m\u001b[39m\u001b[22m\u001b[1mChunk Names\u001b[39m\u001b[22m\r\n        \u001b[1m\u001b[32mbundle.js\u001b[39m\u001b[22m  675 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\r\n    \u001b[1m\u001b[32mbundle.js.map\u001b[39m\u001b[22m  490 KiB    \u001b[1mmain\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\r\n    Entrypoint \u001b[1mmain\u001b[39m\u001b[22m = \u001b[1m\u001b[32mbundle.js\u001b[39m\u001b[22m \u001b[1m\u001b[32mbundle.js.map\u001b[39m\u001b[22m\r\n    [../../../node_modules/webpack/buildin/global.js] \u001b[1m(webpack)/buildin/global.js\u001b[39m\u001b[22m 472 bytes {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n    [./index.js] \u001b[1m../client/js/index.js\u001b[39m\u001b[22m 10.9 KiB {\u001b[1m\u001b[33mmain\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\r\n        + 333 hidden modules\r\n',
   '\u001b]0;hamit@hamit-n: ~/projects/js/light-terminal-OLD\u0007\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/projects/js/light-terminal-OLD\u001b[00m$ ']
const delay = function (t) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve()
      }, t)
   })
}

const run = async function () {

   const JOIN = false

   var tTotal0 = performance.now()
   if (!JOIN) {
      for (let i = 0; i < outputs1.length; i++) {
         await delay(0)
         var t0 = performance.now()
         outputParser.parse(outputs1[i])
         var t1 = performance.now()
         console.log("PARSING =  " + (t1 - t0))
         var t0 = performance.now()
         renderer.render()
         var t1 = performance.now()
         console.log("RENDERING =  " + (t1 - t0))
      }
   }
   else {
      var t0 = performance.now()
      console.log('OUTPUT LENGHT = ', outputs1.join('').length)
      outputParser.parse(outputs1.join(''))
      var t1 = performance.now()
      console.log("PARSING =  " + (t1 - t0))
      var t0 = performance.now()
      renderer.render()
      var t1 = performance.now()
      console.log("RENDERING =  " + (t1 - t0))
   }
   var tTotal1 = performance.now()
   console.log("TOTAL =  " + (tTotal1 - tTotal0))

   await delay(1000)
   profileManager.updateText({ cursorBlinkInterval: 2000 })
   profileManager.updateStyleSheet()
   profileManager.updateText({ fontSize: 18 })
   profileManager.updateStyleSheet()
   renderer.render()

   let fontFamilies = [
      `'Courier Prime', monospace;`,
      //`'Ubuntu Mono', monospace;`
   ]

   for (let i = 0; i < fontFamilies.length; i++) {
      profileManager.updateText({ fontFamily: fontFamilies[i] })
      profileManager.updateStyleSheet()
      renderer.render()
   }

}

run()