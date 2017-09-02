var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var config = require('../config');
var replace = require('gulp-replace');
var tap = require('gulp-tap');
var fs = require('fs');
var process = require('process');

/**
 * Update demo page global relative path
 * @param file - html template
 * It will
 *   @example
 *      change <!--#set var="sitePath" value="<%=sitePathValue%>" -->
 *      to     <!--#set var="sitePath" value="../" -->
 *
 */
function parsePath(file) {

    var sitePath = '';
    var offset = 2;

    var sourceDepth = file.path.replace(file.cwd, '').split(/\/|\\/).length - offset;
    for (var i = 0; i < sourceDepth; i++) {
        sitePath += "../";
    }

    if (sitePath === '') {
        sitePath = '../';
    }

    //HACK: for ssi include path for style guide docs. which has to include "dist/"
    if(file.path.includes("/dist/docs/") || file.path.includes("\\dist\\docs\\") ) {
        sitePath += '/dist/';
    }

    //set global site path value
    file.contents = new Buffer(String(file.contents)
        .replace(new RegExp(config.template.sitePathValueVariable, 'g'), sitePath)

    );
}

/**
 * Scan the html template, find and update the file config, so the ssi server will find the sources by the relative path value on loading the page.
 * @param file - html template
 *
 * Add ssi variable ${sitePath} to ssi include path
 *   @example
 *      change <!--#include virtual="demo/partials/head-libs.html" -->
 *      to     <!--#include virtual="${sitePath}demo/partials/head-libs.html" -->
 *
 *   But it will skip the condition if the path start with "." such as "./", "../"
 *   @example in /demo/partials/header-mobile-navigation.html
 *             <!--#include virtual="./secondary-navigation.html" -->
 *
 *
 * Add ssi variable <!--#echo var="sitePath" --> to assets and source file path
 *   @example
 *      change <img src="assets/img/0.gif" />
 *      to     <img src="<!--#echo var="sitePath" -->assets/img/0.gif" />
 *
 *
 * Add ssi variable <!--#echo var="sitePath" --> to in html page css style url
 *   @example https://regex101.com/r/mG9rO3/3
 *   @example
 *      change background-image:url('assets/img/temp/demo.png');
 *      to     background-image:url('<!--#echo var="sitePath" -->assets/img/temp/demo.png');
 *
 */

function addSitePathVariable(file) {

    file.contents = new Buffer(String(file.contents)
        .replace(new RegExp('<!--#include virtual="([^\.].+?)"', 'g'), function(match, includePath) {
            //add variable ${sitePath} to ssi include virtual path
            return '<!--#include virtual="'+ config.template.ssiIncludeVariable + includePath + '"';
        })
        .replace(new RegExp('="(assets|src|app|..\/)(\/.+?)"', 'g'), function(match, p1, p2) {
            //add variable <!--#echo var="sitePath" --> to assets path. e.g. src="assets/img/0.gif"
            return '="'+ config.template.assetSitePathVariable + p1 + p2 + '"';
        })
        .replace(new RegExp(/url\(\s?(\'|")?\s?assets\/(.+?)\)/g), function(match, p1, p2) {
            //add variable <!--#echo var="sitePath" --> to in html page css style url
            return 'url('+ p1 + config.template.assetSitePathVariable + "assets/" + p2 + ")";
        })

    );
}

/**
 * Copy demo html from src to dist folder
 */
gulp.task('copy-demo', function () {
    return gulp.src(config.demo.src, {base: config.outputRoot})
        .pipe(tap(parsePath))
        .pipe(tap(addSitePathVariable))
        .pipe(gulp.dest(config.demo.dest));
});

/**
 * Copy src html demo templates
 */
gulp.task('copy-src-template', function () {
    return gulp.src(config.template.src)
        .pipe(tap(addSitePathVariable))
        .pipe(gulp.dest(config.template.dest));
});

/**
 * Build template task
 */
gulp.task('build-template', function (callback) {
    return runSequence(
        'copy-demo',
        'copy-src-template',
        callback
    );
});