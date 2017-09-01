var gulp = require('gulp');
var pump = require('pump');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var config = require('../config');
var uglify = require('gulp-uglify');

gulp.task('minify-js', function () {
    return pump([
            gulp.src(config.minify.js.src),
            uglify(),
            gulp.dest(config.minify.js.dest)
        ]
    );
});

gulp.task('minify', function (cb) {
    return runSequence(
        ['minify-js'],
        cb
    );
});
