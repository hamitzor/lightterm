const { watch, src, dest } = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const cleanCss = require('gulp-clean-css')

const sassFiles = ['src/client/scss/*.scss']
const compiledCssDir = 'src/client/compiled-css'
const minCssDir = 'src/client/public'

const sassTask = () => {
   return src(sassFiles)
      .pipe(sass())
      .pipe(dest(compiledCssDir))
      .pipe(cleanCss())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(minCssDir))
}

exports.default = () => {
   watch(sassFiles, { ignoreInitial: false }, sassTask)
}