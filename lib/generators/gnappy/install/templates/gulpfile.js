var files = require('./assets.json');
var gulp = require('gulp');
var del = require('del');
var gulp_less = require('gulp-less');
var less = require('less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var coffee = require("gulp-coffee");
var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var SprocketsChain = require("sprockets-chain");
var dev = false; // = (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev')

var isCoffee = function(file) {
  return file.path.indexOf(".coffee") > -1
}

var isLess = function(file) {
  return file.path.indexOf(".less") > -1
}

gulp.task('clean', function(cb) {
  del([
    'public/assets/build/*'
  ], {
    dot: true
  }, cb);
});


gulp.task('build_application_css', function() {
  var sc = new SprocketsChain();
  sc.appendPath("app/assets/stylesheets");
  sc.appendPath("vendor/assets/components");
  var chain = sc.depChain("application.css");

  return gulp.src(chain)
    .pipe(concat('application.less'))
    .pipe(gulpif(isLess, gulp_less()))
    .pipe(gulpif(!dev, minifyCSS({
      keepBreaks: false
    })))
    .pipe(gulp.dest('./public/assets/build'));
});

gulp.task('build_vendor_css', function() {
  var sc = new SprocketsChain();
  sc.appendPath("app/assets/stylesheets");
  sc.appendPath("vendor/assets/stylesheets");
  sc.appendPath("vendor/assets/components");
  var chain = sc.depChain("vendor.css");

  return gulp.src(chain)
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS({
      keepBreaks: false
    }))
    .pipe(gulp.dest('./public/assets/build'));
});


gulp.task('build_application_js', function() {
  var sc = new SprocketsChain();
  sc.appendPath("app/assets/javascripts");
  sc.appendPath("vendor/assets/components");
  var chain = sc.depChain("application.js");

  return gulp.src(chain)
    .pipe(gulpif(isCoffee,
      coffee({
        bare: true
      }) // Compile coffeescript
      .on("error", gutil.log)
    ))
    .pipe(concat('application.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulp.dest('./public/assets/build'));
});

gulp.task('build_vendor_js', function() {
  var sc = new SprocketsChain();
  sc.appendPath("app/assets/javascripts");
  sc.appendPath("vendor/assets/javascripts");
  sc.appendPath("vendor/assets/components");
  var chain = sc.depChain("vendor.js");

  return gulp.src(chain)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/assets/build'));
});

gulp.task('compile', ['clean', 'build_application_js', 'build_vendor_js', 'build_application_css', 'build_vendor_css'], function() {
  if (!dev) {
    return gulp.src(['public/assets/build/**/*.css', 'public/assets/build/**/*.js'])
      .pipe(rev())
      .pipe(gulp.dest('./public/assets/build'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./'));
  }
});



gulp.task('default', ['compile'])
