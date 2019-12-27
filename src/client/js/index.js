require('core-js/stable')
require('regenerator-runtime/runtime')

const ContentMatrix = global.ContentMatrix
const Renderer = global.Renderer
const OutputParser = global.OutputParser

const cm = new ContentMatrix({ cols: 100, rows: 15 })
const renderer = new Renderer({ termScreenEl: document.getElementById('term-screen'), contentMatrix: cm })
const outputParser = new OutputParser({ colorProfile: {}, contentMatrix: cm })

const outputs = [
   '\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground/pty-demo\u001b[00m$ ',
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
   '\u001b[104m+BLU \u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN ',
   '\u001b[106m+CYN \u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0;0m   \u001b[91m+RED \u001b[41mRED \u001b[101m+RED ',
   '\u001b[42mGRN \u001b[102m+GRN \u001b[43mYEL \u001b[103m+YEL ',
   '\u001b[44mBLU \u001b[104m+BLU \u001b[45mMAG ',
   '\u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN \u001b[47mWHT ',
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;0m   \u001b[32m GRN ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN ',
   '\u001b[43mYEL \u001b[103m+YEL \u001b[44mBLU \u001b[104m+BLU ',
   '\u001b[45mMAG \u001b[105m+MAG \u001b[46mCYN \u001b[106m+CYN ',
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
   '\u001b[107m+WHT \u001b[0m\r\n\u001b[0;1mBO \u001b[91m+RED ',
   '\u001b[41mRED \u001b[101m+RED \u001b[42mGRN \u001b[102m+GRN ',
   '\u001b[47mWHT \u001b[107m+WHT \u001b[0m\r\n',
   '\u001b[0m\r\n',
   '\u001b[01;32mhamit@hamit-n\u001b[00m:\u001b[01;34m~/playground/pty-demo\u001b[00m$ '
]


outputParser.parse(outputs.join(''))
renderer.render()