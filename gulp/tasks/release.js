var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');
var changelog = require('conventional-changelog');
var fs = require('fs');
var bump = require('gulp-bump');
var args = require('../args');
var git = require('gulp-git');
var gulpInstall = require('gulp-install');

function getPackageJsonVersion() {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

// utilizes the bump plugin to bump the
// semver for the repo
gulp.task('bump-version', function () {
    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: args.bump})) //major|minor|patch|prerelease
        .pipe(gulp.dest('./'));
});

// generates the CHANGELOG.md file based on commit
// from git commit messages
gulp.task('changelog', function (callback) {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

    return changelog({
        repository: pkg.repository.url,
        version: pkg.version,
        file: './CHANGELOG.md'
    }, function (err, log) {
        fs.writeFileSync('./CHANGELOG.md', log);
    });
});

gulp.task('release-commit', function () {
    var version = getPackageJsonVersion();
    return gulp.src([ './package.json', './CHANGELOG.md', './bower.json', 'dist/' ])
        .pipe(git.add())
        .pipe(git.commit('Release version ' + version));
});

gulp.task('release-tag', function () {
    var version = getPackageJsonVersion();
    git.tag(version, 'Release ' + version);
});

gulp.task('update-dependencies', function () {
    return gulp.src([ './package.json' ])
        .pipe(gulpInstall());
});

// calls the listed sequence of tasks in order
gulp.task('prepare-release', function (callback) {
    return runSequence(
        'update-dependencies',
        'build',
        'minify',
        'bump-version',
        'changelog',
        callback);
});

gulp.task('release', function (callback) {
    return runSequence(
        'prepare-release',
        'release-commit',
        'release-tag',
        callback
    );
});
