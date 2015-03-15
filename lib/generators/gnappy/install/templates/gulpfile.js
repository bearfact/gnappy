var gulp = require('gulp');
var del = require('del');
var gulp_less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var coffee = require("gulp-coffee");
var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var SprocketsChain = require("sprockets-chain");
var recess = require('gulp-recess');

var isCoffee = function(file) {
  return file.path.indexOf(".coffee") > -1
}

var isLess = function(file) {
  return file.path.indexOf(".less") > -1
}

var needsMinify = function(file) {
  return file.path.indexOf(".min") < 0
}

gulp.task('clean', function(cb) {
  del([
    'public/assets/build/*',
    'public/assets/*.css',
    'public/assets/*.js',
    'public/assets/*.json'
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
    .pipe(gulpif(isLess, gulp_less().on('error', gutil.log)))
    .pipe(minifyCSS({
      keepBreaks: false,
      debugger: true
    }).on('error', gutil.log))
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
    .pipe(uglify())
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
    .pipe(ngAnnotate())
    .pipe(gulpif(needsMinify, uglify()))
    .pipe(gulp.dest('./public/assets/build'));
});

gulp.task('compile', ['clean', 'build_application_js', 'build_vendor_js', 'build_application_css', 'build_vendor_css'], function() {
  return gulp.src(['public/assets/build/*.css', 'public/assets/build/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('lint', function () {
  return gulp.src('./app/assets/stylesheets/less/dashboard.css.less')
  .pipe(recess())
  .pipe(recess.reporter())
  .pipe(gulp.dest('./public/assets/build/'));
});


gulp.task('default', ['compile'])
