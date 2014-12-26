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
var livereload = require('gulp-livereload');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var shell = require('gulp-shell');
var express = require('express');
var coffeescript = require('coffee-script');
var http = require('http');
var path = require('path');
var dev = (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev')

var isCoffee = function(file){
  return file.path.indexOf(".coffee") > -1
}

var isLess = function(file){
  return file.path.indexOf(".less") > -1
}

gulp.task('clean', function(cb) {
  del([
    'public/assets/build/*'
  ], { dot: true }, cb);
});


gulp.task('build_application_css', function() {
  return gulp.src(files["application.css"])
  .pipe(concat('application.less'))
  .pipe(gulpif(isLess, gulp_less()))
  .pipe(gulpif(!dev, minifyCSS({
    keepBreaks: false
  })))
  .pipe(gulp.dest('./public/assets/build'));
});

gulp.task('build_vendor_css', function() {
  return gulp.src(files["vendor.css"])
  .pipe(concat('vendor.css'))
  .pipe(minifyCSS({
    keepBreaks: false
  }))
  .pipe(gulp.dest('./public/assets/build'));
});


gulp.task('build_application_js', function() {
  return gulp.src(files["application.js"])
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
  return gulp.src(files["vendor.js"])
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


gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app/assets/stylesheets/**/*.less').on('change', livereload.changed);
  gulp.watch('app/assets/javascripts/**/*.coffee').on('change', livereload.changed);
});

gulp.task('rails-start', shell.task([
  'rails s -p 3001'
]));

gulp.task('rails-stop', shell.task([
  "kill `cat ./tmp/pids/server.pid`"
]));

gulp.task('start_server', function() {
  var app = express();
  var fs = require('fs');

  app.use(express.static(__dirname + '/public'));

  app.get('/*.coffee', function(req, res, next){
    var name = req.params[0];
    fs.readFile(__dirname + '/' + name + '.coffee', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var js = coffeescript.compile(data);
      res.type('application/json');
      res.send(js);
    });

  });

  app.get('/*.less', function (req, res, next) {
    var name = req.params[0];
    fs.readFile(__dirname + '/' + name + '.less', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.type('text/css');
      less.render(data, function (err, output) {
        if (err) {
          return console.log(err);
        }
        res.type('text/css');
        res.send(output.css);
      });
    });
  });

  app.get('/*.css', function (req, res, next) {
    var name = req.params[0];
    fs.readFile(__dirname + '/' + name + '.css', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.type('text/css');
      res.send(data);
    });
  });

  app.get('/*', function (req, res, next) {
    var name = req.params[0];
    fs.readFile(name, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.type('application/json');
      res.send(data);
    });
  });


  http.createServer(app).listen(5000);

});




gulp.task('default', ['start_server', 'watch'])
