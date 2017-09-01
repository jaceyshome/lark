var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('../config');

// deletes all files in the output path
gulp.task('clean', function () {
  return gulp.src(config.outputRoot, {read: false})
      .pipe(clean());
});