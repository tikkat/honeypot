/* Modules & variables
-------------------------------------*/
var gulp          = require('gulp');
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    minifycss     = require('gulp-minify-css'),
    rename        = require('gulp-rename');


/* Paths
-------------------------------------*/
var paths = {
  scss:     'assets/stylesheets/main.scss',
  css:      'assets/stylesheets/main.css',
  cssDest:  'assets/stylesheets',
  html:     'index.html'
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


/* Watchers
-------------------------------------*/
gulp.task('watch', function() {
  gulp.watch(paths.scss, ['styles']);
  gulp.watch(paths.html, notifyLiveReload);
  gulp.watch(paths.css, notifyLiveReload);
});


gulp.task('default', ['express', 'styles', 'livereload', 'watch'], function() {

});
