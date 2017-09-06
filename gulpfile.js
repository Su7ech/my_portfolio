var gulp        = require('gulp');
var sass        = require('gulp-sass');
var pug         = require('gulp-pug');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
var newer       = require('gulp-newer');
var sourcemaps  = require('gulp-sourcemaps');
var prefix      = require('gulp-autoprefixer');
var cssnano     = require('gulp-cssnano');
var postcss     = require('gulp-postcss');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var del         = require('del');

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
    gulp.watch('./src/scss/**/*.+(scss|sass)', ['build:css']);
    gulp.watch('./src/pugfiles/**/*.pug', ['build:html']);
    gulp.watch('./src/**/*.html', browserSync.reload);
});

gulp.task('build:css', function() {
    return gulp.src('./src/scss/**/*.+(scss|sass)')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});

gulp.task('build:html', function() {
    return gulp.src('./src/pugfiles/**/!(_)*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./src'))
        .pipe(browserSync.stream());
});

gulp.task('compress:img', function() {
    return gulp.src('./src/imgs/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('./src/'));
});

gulp.task('default', function(callback) {
    runSequence(['build:css', 'build:html', 'compress:img'], 'serve', callback);
})