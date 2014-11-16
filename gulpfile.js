var gulp = require('gulp');
var prompt = require('gulp-prompt');

gulp.task('default', function() {
    gulp.src('README.md')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'appname',
            message: 'The name of the application:',
            default: 'anonymous'}], function(res) {
                console.log('questionnaire: ', res);
            }));
});
