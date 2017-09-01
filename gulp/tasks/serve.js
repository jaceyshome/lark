var gulp = require('gulp');
var browserSync = require('browser-sync');
var ssi = require('browsersync-ssi');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {
  browserSync({
    open: false,
    port: 9000,
    ui: {
      port: 9001,
      weinre: {
          port: 9090
      }
    },
    server: {
      baseDir: ['./dist', './'],
      middleware: [
          ssi({
              baseDir: './dist',
              ext: '.html',
              version: '1.4.0'
          }),
          function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
          }
      ]
    }
  }, done);
});
