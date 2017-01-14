/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    livereload = require('gulp-livereload');

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/site.js";
paths.views = "./Views/**/*.cshtml";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task('reload', () => {
    gulp.src(paths.js).pipe(livereload())
})

gulp.task('watch', function () {
    livereload.listen()
    gulp.watch(paths.js, ['reload']);
    gulp.watch(paths.views, ['reload']);
});