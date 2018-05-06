const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const jpegtran = require('imagemin-jpegtran');
const pngquant = require('imagemin-pngquant');
const del =	require('del');
const plumber = require('gulp-plumber');

gulp.task('less', function(){
	return gulp.src('src/less/*.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'src'
		}
	});
});

gulp.task('watch', ['browserSync', 'less'], function(){
	gulp.watch('src/less/*.less', ['less']);
	gulp.watch('src/js/*.js', browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('del', function(){
	return del('result');
});

gulp.task('replace', function(){
	return gulp.src('src/**/*')
	.pipe(gulp.dest('result'));
});

// задача стили

gulp.task('styles', function(){
	return gulp.src('result/css/*.css')
	.pipe(autoprefixer(['last 15 versions', '> 1%'], {cascade: true}))
	.pipe(gulp.dest('result/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cssnano({zindex: false}))
  .pipe(gulp.dest('result/css'));
});

// задача картинки

gulp.task('images', function() {
	return gulp.src('result/img/**/*.{png,jpg,gif}')
		.pipe(imagemin({ 
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [jpegtran(), pngquant()]
		}))
		.pipe(gulp.dest('result/img'));
});

// задача скрипты

gulp.task('scripts', function() {
    return gulp.src('result/js/*.js')
        .pipe(gulp.dest('result/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('result/js'));
    });
