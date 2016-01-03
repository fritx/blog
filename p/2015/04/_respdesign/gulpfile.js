var gulp = require('gulp')
var imagemin = require('gulp-imagemin')

gulp.task('imagemin', function(){
  gulp.src('*.{png,jpg}')
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(gulp.dest('.'))
})

gulp.task('default', ['imagemin'])
