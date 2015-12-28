var fs = require('fs');
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlReplace = require('gulp-html-replace');
var less = require('gulp-less');
var dc = require('gulp-drop-comments')

var CONF = {
    src: 'src',
    build: 'dist/Next-door-to-Uncle-Wang',
    bower: 'bower_components'
};

gulp.task('default', ['build']);

gulp.task('build', ['style', 'js', 'html', 'manifest']);

gulp.task('style', ['style-css', 'style-image', 'style-font']);

gulp.task('style-css', function () {
    return gulp.src([
        CONF.src + '/style/less/style.less'
    ])
        .pipe(less())
        .pipe(dc())
        .pipe(minifycss())
        .pipe(gulp.dest(CONF.build + '/style/css'));
});

gulp.task('style-image', function () {
    return gulp.src([
        CONF.src + '/style/images/**/*'
    ])
        .pipe(gulp.dest(CONF.build + '/style/images'));
});

gulp.task('style-font', function () {
    return gulp.src([
        CONF.src + '/style/fonts/**/*'
    ])
        .pipe(gulp.dest(CONF.build + '/style/fonts'));
});

gulp.task('js', ['js-core', 'js-main', 'js-background']);

gulp.task('js-core', function () {
    return gulp.src([
        CONF.src + '/js/core/*.js'
    ])
        .pipe(concat('core.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CONF.build + '/js'));
});

gulp.task('js-main', function () {
    return gulp.src([
        CONF.src + '/js/modules/*.js',
        CONF.src + '/js/app/*.js',
        CONF.src + '/js/bondage.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CONF.build + '/js'));
});

gulp.task('js-background', function () {
    return gulp.src([CONF.src + '/js/background/*.js'])
        .pipe(concat('background.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CONF.build + '/js'));
});

gulp.task('html', function () {
    return gulp.src([CONF.src + '/*.html'])
        .pipe(htmlReplace({
            js: ['js/core.js', 'js/main.js'],
            css: 'style/css/style.css'
        }))
        .pipe(gulp.dest(CONF.build));
});

gulp.task('manifest', ['html'], function (cb) {
    var manifest = JSON.parse(fs.readFileSync(CONF.src + '/manifest.json').toString());
    manifest.background.scripts = ['js/background.js'];
    fs.writeFileSync(CONF.build + '/manifest.json', new Buffer(JSON.stringify(manifest)));
    cb();
});

gulp.task('clean', function () {
    return gulp.src(CONF.build, {read: false})
        .pipe(clean());
});

gulp.task('dev', function () {
    gulp.src(['./bower_components/queue-async/queue.js'])
        .pipe(gulp.dest(CONF.src + '/js/core/'));
    gulp.src(['./bower_components/less/dist/less.min.js'])
        .pipe(gulp.dest(CONF.src + '/dev/'));
});