var gulp = require('gulp');
var react = require('gulp-react');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var serve = require('gulp-serve');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

gulp.task('clean', function () {
    return gulp.src(['dist', 'examples/dist'])
        .pipe(clean({ read: false }));
});

gulp.task('copy', ['clean'], function () {
    return gulp.src('*.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('jsx', ['clean'], function () {
    return gulp.src('*.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist/'));
});

gulp.task('bundle', ['copy', 'jsx'], function () {
    return gulp.src('dist/react9p.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: ['reactify']
        }))
        .pipe(rename('react9p.bundle.js'))
        .pipe(gulp.dest('dist/'));
});

/*gulp.task('build-examples', function () {
    return gulp.src('react9p.jsx')
        .pipe(react())
        .pipe(watchify({
            watch: false
        })
        .pipe(gulp.dest('examples/dist'));
});*/

gulp.task('example-copy', ['copy', 'jsx'], function () {
    return gulp.src(['examples/*.{html,png}', 'dist/*.js'])
        .pipe(gulp.dest('examples/dist'));
});

gulp.task('example-browserify', ['example-copy', 'clean'], function () {
    return gulp.src('examples/example.jsx')
        .pipe(browserify({
            insertGlobals: true,
            transform: ['reactify']
        }))
        .pipe(rename('example.js'))
        .pipe(gulp.dest('examples/dist'));
});

gulp.task('example-serve', ['example-browserify'], serve('examples/dist'));

gulp.task('example-watch', ['example-serve'], function () {
    livereload.listen();
    gulp.watch(['react9p.jsx', 'examples/*.{html,png,js}'], ['example-browserify']);
    gulp.watch('examples/dist/*').on('change', function(file) {
        setTimeout((function () { livereload.changed(file); }), 3000);
    });
});

gulp.task('default', ['example-watch']);

