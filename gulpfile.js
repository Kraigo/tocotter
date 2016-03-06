'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    return gulp
        .src(['public/styles/sass/main.sass'])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('public/styles/'));
});

//Watch task
gulp.task('watch',function() {
    return gulp
        .watch('public/styles/sass/*.sass', ['styles'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});

gulp.start('watch');