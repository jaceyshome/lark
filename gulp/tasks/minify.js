var gulp = require('gulp');
var pump = require('pump');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var config = require('../config');
var minify = require('gulp-minify');

gulp.task('minify-js', function () {
    return pump([
            gulp.src(config.minify.src),
            minify({
                ext:{
                    src:'.js',
                    min:'.min.js'
                },
                exclude: ['app'],
                ignoreFiles: ['.combo.js', '-min.js']
            }),
            gulp.dest(config.minify.dest)
        ]
    );
});

gulp.task('minify', function (cb) {
    return runSequence(
        ['minify-js'],
        cb
    );
});
