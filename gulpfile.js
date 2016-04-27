

/* REQUIRES --------------------*/

var gulp = require('gulp'),
    autoprefix = require('gulp-autoprefixer'),
    cache = require('gulp-cached'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    error = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-cssnano'),
    minifyHTML = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify');

var src = './src/',
    dist = './dist/',
    css = 'css/',
    js = 'js/',
    img = 'img/',
    paths = {
      src: {
        base: src,
        css: src + css,
        js: src + js,
        img: src + img
      },
      dist: {
        base: dist,
        css: dist + css,
        js: dist + js,
        img: dist + img
      }
    };


/* SCRIPTS --------------------*/

// JS compiler
gulp.task('scripts', function() {
  gulp.src('./src/js/*.js')
    // .pipe(uglify().on('error', error.log))
    .pipe(gulp.dest('./dist/js/'));
});

// JSHint task
gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


/* STYLES --------------------*/

// Less compiler
gulp.task('less', function () {
  gulp.src(paths.src.css + 'main.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', error.log))
    .pipe(sourcemaps.write())
    .pipe(autoprefix())
    // .pipe(minifyCss())
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task('lessWatch', function() {
  gulp.watch(paths.src.css + '**/*.less', ['less']);
});


/* MARKUP & ASSETS --------------------*/

// minify html
gulp.task('minifyHTML', function() {
	gulp.src(paths.src.base + '*.html')
		.pipe(changed(paths.dist.base))
		// .pipe(minifyHTML())
		.pipe(gulp.dest(paths.dist.base));
});

// minify new images
gulp.task('imagemin', function() {
  gulp.src(paths.src.img + '*')
    .pipe(changed(paths.src.img))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.img));
});


/* UTILITY --------------------*/

// build out all paths that haven't yet been built
gulp.task('build', function() {
  gulp.src([paths.src.base + '*', paths.src.base + '**/*', '!' + paths.src.base + '**/*.less'])
    .pipe(changed(paths.dist.base))
    .pipe(gulp.dest(paths.dist.base));
});


/* DEFAULT --------------------*/

gulp.task('default', ['build', 'less', 'imagemin', 'minifyHTML', 'jshint', 'scripts']);


/* WATCH --------------------*/
gulp.task('watch', function() {

  // build all
  gulp.watch([paths.src.base + '*', paths.src.base + '**/*', '!' + paths.src.base + '**/*.less'], ['build'])

  // watch for JS changes
  gulp.watch('./src/js/**/*.js', ['jshint', 'scripts']);

  // watch for CSS changes
  gulp.watch(paths.src.css + '*.less', ['less']);

  // watch for HTML changes
  gulp.watch(paths.src.base + '*.html', ['minifyHTML']);

  // watch for images
  gulp.watch([paths.src.img + '*.{jpg|jpeg|png}'], ['imagemin']);
});
