var src = "src/",
    dest = "dest/",
    // Modules
    gulp = require('gulp'),
    uglify = require('gulp-uglify');


gulp.task('scripts', function() {
  return gulp.src([src + 'js/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(dest + "js/"));
});

// Clean - Deletes all the files before recompiling to ensure no unused files remain
gulp.task('clean', function(cb) {
    setTimeout(function () {
        del([dest], cb);
    }, 1000);
});
