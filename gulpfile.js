/* Modules & variables
-------------------------------------*/
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    minifycss     = require('gulp-minify-css'),
    rename        = require('gulp-rename'),
    images        = require('gulp-imagemin'),
    bourbon       = require('node-bourbon').includePaths,
    neat          = require('node-neat').includePaths;


/* Paths
-------------------------------------*/
var paths = {
  scss:     'client/stylesheets/main.scss',
  allScss:  'client/stylesheets/**/*.scss',
  css:      'build/stylesheets/main.css',
  cssDest:  'build/stylesheets',
  html:     'index.html',
  imgDest:  'build/img',
  allJs:    'client/**/*.js',
  js:       'client/app.module.js',
  jsDest:   'build/js'
};


/* Tasks
-------------------------------------*/
//Server
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname));
  app.listen(4000);
});

//Live-reload
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});


//Styles
gulp.task('styles', function() {
  return gulp.src(paths.scss)
  .pipe(sass({
    errLogToConsole: true,
    includePaths: require('node-neat').includePaths,
    onError: function(err) {
      return notify().write(err);
    }
  }))
  .pipe(autoprefixer())
  .pipe(gulp.dest(paths.cssDest))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest(paths.cssDest));
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// Javascript minifyer
// gulp.task('js', function () {
//   gulp.src(['src/**/module.js', 'src/**/*.js'])
//     .pipe(sourcemaps.init())
//       .pipe(concat('app.js'))
//       .pipe(ngAnnotate())
//       .pipe(uglify())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('.'))
// });
// For later:
// https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917

// Image minifyer
gulp.task('images', function(){
  gulp.src(['client/images/*.jpg', 'client/images/*.png'])
    .pipe(images({
      progressive: true
    }))
    .pipe(gulp.dest(paths.imgDest));
});

/* Watchers
-------------------------------------*/
gulp.task('watch', function() {
  gulp.watch(paths.allScss, ['styles']);
  gulp.watch(paths.allJs, ['js']);
  gulp.watch(paths.html, notifyLiveReload);
  gulp.watch(paths.css, notifyLiveReload);
});


gulp.task('default', ['express', 'styles', 'livereload', 'watch'], function() {

});
