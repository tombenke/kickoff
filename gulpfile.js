var gulp = require('gulp');
var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var through = require('gulp-through');
var debug = require('gulp-debug');
var order = require('gulp-order');
var buffer = require('vinyl-buffer');
var markdown = require('gulp-markdown');

gulp.task('docgen', function() {
    gulp.src('docs/*.md', { base: process.cwd() })
        .pipe(buffer())
        .pipe(markdown())
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(through('subs', function(file, config) {
            var content = file.contents.toString();
            console.log('================================');
            console.log('subs.content: ', content);
            gulp.src('docs/pageTemplate.html')
                .pipe(buffer())
                .pipe(mustache({body: content}))
                .pipe(debug())
                .pipe(rename(file.path))
                .pipe(gulp.dest());
        }, {})());
});