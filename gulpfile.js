const gulp         = require('gulp')
const del          = require('del');
const browserSync  = require('browser-sync');
const cleanCss     = require('gulp-clean-css');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const groupMedia   = require('gulp-group-css-media-queries');
const autoprefixer = require('autoprefixer');
const concat       = require('gulp-concat')
const image        = require('gulp-imagemin');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');

//Удаляет папку build
gulp.task('clean', function () {
  return del('./build');
});
//переносит html файлы в папку build
gulp.task('html', function () {
  return gulp.src('./src/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
//компилирует sass файлы
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('libsCSS', function () {
  return gulp.src('./src/sass/plugins/*.css')
    .pipe(plumber())
    .pipe(groupMedia())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(concat('libs.min.css'))
    .pipe(cleanCss({
      level: 2,
      format: 'beautify'
    }
    ))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('scripts', function () {
  return gulp.src('./src/js/main.js')
    .pipe(plumber())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('libsJS', function () {
  return gulp.src('./src/js/plugins/*.js')
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('img', function () {
  return gulp.src('./src/img/*')
    .pipe(plumber())
    .pipe(image())
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('./build/img'));
});

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/*')
    .pipe(plumber())
    .pipe(gulp.dest('./build/fonts'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    reloadOnRestart: true,
    // tunnel: 'my-project-name'
  });

  gulp.watch('./src/*.html', gulp.parallel('html'));
  gulp.watch('./src/sass/*.sass', gulp.parallel('sass'));
  gulp.watch('./src/sass/plugins/*.css', gulp.parallel('libsCSS'));
  gulp.watch('./src/js/main.js', gulp.parallel('scripts'));
  gulp.watch('./src/js/plugins/*.js', gulp.parallel('libsJS'));
  gulp.watch('./src/img/*', gulp.parallel('img'));
  gulp.watch('./src/fonts/*', gulp.parallel('fonts'));
});


gulp.task('dev', gulp.series(
  'clean',
  'html',
  'sass',
  'libsCSS',
  'scripts',
  'libsJS',
  'img',
  'fonts',
  'server'
));