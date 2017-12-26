var gulp = require('gulp')
var htmlmin = require('gulp-html-minifier2')
var uglify = require('gulp-uglify')
var pump = require('pump')
var concat = require('gulp-concat')
var sass = require('gulp-sass')
var uglifycss = require('gulp-uglifycss')
var gls = require('gulp-live-server')

gulp.task('moveIndex', function(){
	gulp.src('./src/index.html')
		.pipe(htmlmin({collapseWhitespace:true}))
		.pipe(gulp.dest('./dist/'))
})

gulp.task('javascript', function(cb){
	pump([
		gulp.src('./src/assets/js/*.js'),
		concat('main.js'),
		uglify(),
		gulp.dest('./dist/js')
	], cb)	
})

gulp.task('sass', function(){
	gulp.src('./src/assets/scss/*.scss')
	.pipe(sass())
		.pipe(uglifycss({
			"maxLineLen": 80,
			"uglifyComments": true
		}))
	.pipe(gulp.dest('./dist/css'))
})

gulp.task('serve', function(){
	var server = gls.static('./dist', 8000)
	server.start()
	gulp.watch(['./dist/css/*.css', './dist/js/*.js', './dist/index.html'], function (file) {
		server.notify.apply(server, [file]);
	});
})

gulp.task('default', ['moveIndex', 'javascript', 'sass', 'serve'], function(){
	gulp.watch('./src/*.html', ['moveIndex'])
	gulp.watch('./src/assets/js/*.js', ['javascript'])
	gulp.watch('./src/assets/scss/*.scss', ['sass'])
	console.log('Watching for files...')
})
