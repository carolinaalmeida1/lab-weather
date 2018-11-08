const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('compile-sass', function(){
  return gulp.src('scss/*.scss')
  .pipe(sourcemaps.init())
  .pipe(concat("main.min.scss"))
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("public/css"));
});

gulp.task('watch', function () {
  gulp.watch('scss/*.scss', ['compile-sass']);
})

gulp.task('default', ['compile-sass', 'watch']);