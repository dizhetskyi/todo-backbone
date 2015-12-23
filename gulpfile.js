var gulp = require('gulp');
var browserSync = require('browser-sync').create();


gulp.task('browser', function() {
  
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

});