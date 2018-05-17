const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

const paths = {
    input: {
        html: 'src/**/*.html',
        styles: 'src/styles/main.scss',
        img: 'src/image/**.*',
        js: 'src/script/**/*.js'
    }
}

gulp.task('clean', function () {
    return del('build');
})

// HTML
gulp.task('html', function () {
    return gulp.src(paths.input.html)
        .pipe(gulp.dest('build/'))
})

//  Styles
gulp.task('sass', function () {
  return gulp.src(paths.input.styles)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

//  Image
gulp.task('img', function () {
    return gulp.src(paths.input.img)
        .pipe(gulp.dest('build/image/'))
})

//Script
gulp.task('scripts', function() {
    return gulp.src(paths.input.js)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('build/js'));
  });

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
    browserSync.watch('build/**/**.*').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch(paths.input.html, gulp.parallel('html'));
    gulp.watch('src/styles/**/*.scss', gulp.parallel('sass'));
    gulp.watch(paths.input.img, gulp.parallel('img'));
    gulp.watch(paths.input.js, gulp.parallel('scripts'));
});

gulp.task('build', 
            gulp.series('clean', 
                        gulp.parallel('html', 'sass', 'img', 'scripts'), 
                        gulp.parallel('watch', 'browser-sync')
                    )
        );