var path = require('path');
var gulp = require('gulp');
var size = require('gulp-size');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');

var src = 'src/';
var dist = 'dist/';

gulp.task('stab', function() {
  return gulp.src(src+'stab.js')
    .pipe(concat('stab.js'))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(concat('stab.min.js'))
    .pipe(gulp.dest(dist))
    .pipe(size());
});

gulp.task('all', function() {
  return gulp.src([src+"stab.js", src+'stab.event.js', src+'stab.ajax.js', src+'stab.anim.js', src+'stab.router.js', src+'stab.tmpl.js', src+'stab.tap.js'])
    .pipe(concat('stab.all.js'))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(concat('stab.all.min.js'))
    .pipe(gulp.dest(dist))
    .pipe(size());
});

gulp.task('core', function() {
  return gulp.src([src+"stab.js", src+'stab.event.js', src+'stab.ajax.js'])
    .pipe(concat('stab.core.js'))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(concat('stab.core.min.js'))
    .pipe(gulp.dest(dist))
    .pipe(size());
});

gulp.task('default', ['stab', 'all', 'core']);
