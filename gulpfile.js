// 4 gulp - создаем константу src (взяли из return src - 3 gulp) для присвоения возможностей gulp, с мопощью плагина 'gulp', который мы установили
// 5 gulp - присваиваем dest возможности gulp
// 17 gulp - присваиваем watch возможности gulp
// 38 gulp -
// 47 gulp -
const { src, dest, watch, parallel, series } = require('gulp');
// 1 gulp - создаем константу scss (или др. имя) для конвертации scss в scc с мопощью плагина 'gulp-sass', который мы установили
const scss = require('gulp-sass');
// 9 gulp - создаем константу concat (или др. имя) для присвоения возможностей gulp-concat, с мопощью плагина 'gulp-concat', который мы установили
const concat = require('gulp-concat'); 
// 12 gulp - создаем константу autoprefixer (или др. имя) для присвоения возможностей gulp-autoprefixer, с мопощью плагина 'gulp-autoprefixer', который мы установили
const autoprefixer = require('gulp-autoprefixer');
// 24 gulp - создаем константу uglify (или др. имя) для присвоения возможностей gulp-uglify, с мопощью плагина 'gulp-uglify', который мы установили
const uglify = require('gulp-uglify');
// 41 gulp - 
const imagemin = require('gulp-imagemin');
// 31 gulp - создаем константу browserSync (или др. имя) для присвоения возможностей browser-sync', с мопощью плагина 'browser-sync', который мы установили
// 32 gulp - create для инициализации нового ...
const browserSync = require('browser-sync').create();

// 33 gulp - 
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    // 40 gulp
    notofy: false
  })
}

// 2 gulp - создаем функцию styles (или др. имя)
function styles() {
  // 3 gulp - необходимо указать путь для преобразования scss
  return src('app/scss/style.scss')
    // 6 gulp - Конвертируем scss в CSS через gulp-sass, {outputStyle: 'expanded'} - тип структурирования файла css
    // лучше использовать compressed
    .pipe(scss({outputStyle: 'expanded'})) 
    // 10 gulp - преобразовываем файл style.scss в style.min.css
    .pipe(concat('style.min.css'))
    // 13 gulp - настраиваем autoprefixer
    .pipe(autoprefixer({
      // 14 gulp - поддежка последних 10ти версий браузеров
      overrideBrowserslist: ['last 10 versions'],
      // 15 gulp - autoprefixer для гридов
      grid: true
    }))
    // 7 gulp - в итоге преобразовывем файл style.scss в style.css в папку app/css
    // 11 gulp - после concat для gulp это путь для файла style.min.css
    .pipe(dest('app/css'))
    // 34 gulp - 
    .pipe(browserSync.stream())
}

// 21 gulp - создаем функцию с именем scripts (или др. имя) для мониторинга изменений в скриптах
function scripts() {
  // 22 gulp - необходимо указать путь для преобразования js файлов
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/mixitup/dist/mixitup.min.js',
    'app/js/main.js'
  ])
  // 23 gulp - преобразовываем файлы js в один main.min.js
  .pipe(concat('main.min.js'))
  // 25 gulp - унифицирует файл main.min.js (compressed)
  .pipe(uglify())
  // 26 gulp - отправляет файл main.min.js в папку app/js
  .pipe(dest('app/js'))
  // 35 gulp -
  .pipe(browserSync.stream())
}

// 42 gulp - 
function images(){
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(dest('dist/images'))
}

// 44 gulp - 
function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
    // 46 gulp - 
  ], {base: 'app'})
  .pipe(dest('dist'))
}

// 16 gulp - создаем функцию с именем watching (или др. имя) для мониторинга изменений в файле scss
function watching() {
  // 18 gulp - watch следит за изменениями в папке scss, ** - и всех вложеных папках, *.scss - все файлы с разширением scss
  // 19 gulp - если watch увидел изменения выполняется функция styles
  watch(['app/scss/**/*.scss'], styles);
  // 28 gulp - watch следит за изменениями в папке js, ** - и всех вложеных папках, *.js - все файлы с разширением js
  // 29 gulp - если watch увидел изменения выполняется функция scripts
  // 30 gulp - внутри пути к файлу добавляем исключение '!app/js/main.min.js'
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  // 36 gulp -
  watch(['app/**/*.html']).on('change', browserSync.reload)
}

// 8 gulp - для работы функции styles используем exports, теперь мы можем через терминал создать css файл
exports.styles = styles;
// 27 gulp - для работы функции scripts в терминале используем scripts
exports.scripts = scripts;
// 37 gulp -
exports.browsersync = browsersync;
// 20 gulp - для работы функции watching в терминале используем exports
exports.watching = watching;
// 43 gulp - 
exports.images = images;
// 45 gulp -
// 48 gulp - 
exports.build = series(images, build);

// 39 gulp -
exports.default = parallel(styles, scripts, browsersync, watching);