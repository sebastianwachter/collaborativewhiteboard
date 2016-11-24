'use strict';

// grab our gulp packages
var gulp  = require('gulp'),

    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    uglifyJS = require('gulp-uglify'),
    uglifyCSS = require('gulp-uglifycss'),
    autoprefixer = require('gulp-autoprefixer');

// default task
gulp.task('default', ['watch']);

// build css from sass
gulp.task('build-css', () => {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(uglifyCSS())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/styles/'))
    .pipe(notify({ message: 'CSS task complete' }));
});

// minify & uglify js
gulp.task('build-js', () => {
  return gulp.src(['source/javascript/partials/*.js', 'source/javascript/main.js'])
    .pipe(concat('script.js'))
    .pipe(uglifyJS())
    .pipe(gulp.dest('public/scripts/'))
    .pipe(notify({ message: 'JavaScript task complete' }));
});

gulp.task('watch', ['build-js', 'build-css'], () => {
  gulp.watch('source/javascript/**/*.js', ['build-js']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
});
