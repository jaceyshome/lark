var gulp = require('gulp');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var config = require('../config');

//Concat lark framework
gulp.task('build-lark', function() {
    return gulp.src(config.lark.src)
        .pipe(concat('lark.js'))
        .pipe(gulp.dest(config.lark.dest));
});

//Concat app source files into dist app folder
gulp.task('build-app', function() {
    return gulp.src(config.app.src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.app.dest));
});

gulp.task('build-app-templates', function() {
    return gulp.src(config.app.template.src)
        .pipe(concat('templates.html'))
        .pipe(gulp.dest(config.app.template.dest));
});

//Copy unmodified assets
gulp.task('copy-assets', function () {
    return gulp.src(config.assets.src)
        .pipe(gulp.dest(config.assets.dest));
});

gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        ['build-lark', 'build-app', 'build-app-templates', 'build-template', 'copy-assets'],
        callback
    );
});
