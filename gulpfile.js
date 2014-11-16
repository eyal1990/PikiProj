var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var del = require('del');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');

gulp.task('styles-prod', function() {
  return gulp.src('scss/design.scss')
    .pipe(sass({ compass: true, style: 'expanded' }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dest/css'));
});

gulp.task('styles', function () {
  return gulp.src('scss/design.scss')
      .pipe(sass({ compass: true, style: 'expanded' }))
      .pipe(gulp.dest('css/'));
})

gulp.task('scripts-prod', function() {
  return gulp.src('js/*.js')
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js/'));
});

gulp.task('templates-prod', function() {
    return gulp.src('templates/*.html')
        .pipe(gulp.dest('dest/templates/'));
})

gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
    .pipe(gulp.dest('images/'));
});

gulp.task('images-prod', function() {
  return gulp.src('images/**/*')
      .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dest/images/'));
});

gulp.task('clean', function(cb) {
    del(['dest/'], cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('replace', function() {
  gulp.src('index.html')
      .pipe(htmlreplace({
        'js': [
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.min.js',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular-animate.min.js',
            'js/main.min.js'
        ],
        "css": ['css/design.min.css']
      }))
      .pipe(gulp.dest('dest/'));
});

gulp.task('delete-css-map', function(cb) {
    del(['dest/css/*.map'], cb)
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('js/**/*.js');

  // Watch image files
  gulp.watch('images/**/*', ['images']);
    
  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch('**/*').on('change', livereload.changed);

});

gulp.task('prod', function() {
    runSequence('clean', ['styles-prod', 'scripts-prod', 'templates-prod', 'images-prod', 'replace'], 'delete-css-map');
    return gulp.src('/').pipe(notify({ message: 'Prod task complete' }));
});