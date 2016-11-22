var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var RevAll = require('gulp-rev-all');
var revReplace = require("gulp-rev-replace");
var browserSync = require('browser-sync').create();
var stylus = require('gulp-stylus');
var nib = require('nib');
var _ = require('lodash');

gulp.task('browserify', function() {
  gulp.src('src/js/static/*.js')
   .pipe(gulp.dest('build/js'))
  return gulp.src('src/js/*.js')
    .pipe(browserify({
      insertGlobals: false,
      debug: false
    }))
    .pipe(gulp.dest('build/js'))
});

gulp.task('stylus', function() {
  return gulp.src(['src/css/*.styl'])
    .pipe(stylus({
      compress: false,
      use: nib(),
      'import': ['nib']
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('vendor', function() {
  return gulp.src('src/vendor/**/*')
    .pipe(gulp.dest('build/vendor/'))
})


gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img/'))
})


gulp.task('jade', function() {
  return gulp.src('src/template/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('build/site'));
});


gulp.task('watch', function() {
  gulp.watch(['src/js/**/*'], ['browserify']);
  gulp.watch(['src/template/**/*'], ['jade']);
  gulp.watch(['src/css/**/*'], ['stylus']);
  gulp.watch(['src/img/**/*'], ['img']);
});


gulp.task('serve', function() {
  browserSync.init({
    open: false,
    port: 80,
    server: {
      baseDir: "build",
    }
  });
  gulp.watch(['build/site/**/*']).on('change', function() {
    setTimeout(browserSync.reload, 1000)
  });
});

// build for test or production

gulp.task('revision', ['build'], function() {
  var rev = new RevAll();
  return gulp.src('build/**/*.+(js|css|jpg|jpeg|ico|png|gif|svg)')
    .pipe(rev.revision())
    .pipe(gulp.dest('final/'))
    .pipe(rev.manifestFile())
    .pipe(gulp.dest('final/'));
})

gulp.task('revreplace', ['revision'], function() {
  var manifest = gulp.src('final/rev-manifest.json');
  return gulp.src('build/site/**/*')
    .pipe(revReplace({
      manifest: manifest,
      replaceInExtensions: ['.html']
    }))
    .pipe(gulp.dest('final/site'));
});

gulp.task('build', ['browserify', 'stylus', 'jade', 'vendor', 'img']);
gulp.task('preview', ['build', 'watch', 'serve'])