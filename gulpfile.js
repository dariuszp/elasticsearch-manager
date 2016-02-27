'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function() {
    return gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/bootstrap/dist/js/bootstrap.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/elasticsearch/elasticsearch.angular.js'
    ])
        .pipe(uglify())
        .pipe(concat('base.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('default', [
    'js'
]);