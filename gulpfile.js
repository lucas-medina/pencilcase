console.log('starting gulp');
/*
	Here is what it does
	- Checks for pencil that already exists. If not, copy template folder
	- Run common tasks for firstrun development environment
	  - Precompile and put CSS together
	  - Copy Javascript
	  - Minify images
	  - Sync 
*/

// Variables
var args = require('yargs').argv;
var folderRoot = './';
var folderTemplate = './_template';
var folderProjects = 'pencils/';
var folderPencil = args.pencil ? args.pencil.trim() : undefined;

// Gulp Requirements
var gulp = require('gulp');
var please = {
	browsersync: require('browser-sync'),
	concat: require('gulp-concat'),
	fs: require('fs'),
	imagemin: require('gulp-imagemin'),
	merge: require('merge-stream'),
	postcss: require('gulp-postcss'),
	// processhtml: require('gulp-processhtml'),
	remove: require('rimraf'),
	sequence: require('run-sequence'),
	sass: require('gulp-sass'),
	// sync: require('gulp-directory-sync')
};
var postcss = {
	autoprefixer: require('autoprefixer')
};

// Quick exception for leaving in case of failure on arguments
if (typeof folderPencil !== "string" || folderPencil.length == 0){
	process.exit();
}

// Helper functions
function pathFinder(relativePath = ""){
	return folderRoot + folderProjects + folderPencil + relativePath;
}

// Soooooo...
// Here the magic begins. Or ends.

// First things first
gulp.task('pen-add', function(){
	return please.fs.existsSync(pathFinder()) ? 
	false : gulp.src(folderTemplate + '/**/*')
		.pipe(gulp.dest(pathFinder('/src')));
});

// You can delete pens
gulp.task('pen-remove', function(){
	return please.remove(pathFinder(), function(){
		console.log(pathFinder() + ': removed.');
	});
});

// Styles go here
gulp.task('styles', function(){
	return gulp.src(pathFinder('/src/scss/style.scss'))
		.pipe(please.sass({outputStyle: 'expanded'}).on('error', please.sass.logError))
		.pipe(please.concat('main.css'))
		.pipe(please.postcss([postcss.autoprefixer({browsers: ['last 5 versions']})]))
		.pipe(gulp.dest(pathFinder('/dist/css/')))
});

// Images go here
gulp.task('images', function(){
	return gulp.src(pathFinder('/src/images/**/*'))
		.pipe(please.imagemin())
		.pipe(gulp.dest(pathFinder('/dist/images/')))
});

// Javascript, brah
gulp.task('scripts', function(){
	return gulp.src(pathFinder('/src/js/script.js'))
		.pipe(please.concat('main.js'))
		.pipe(gulp.dest(pathFinder('/dist/js/')))
});

// HTML goes here

gulp.task('html', function(){
	return gulp.src(pathFinder('/src/**/*.html'))
		.pipe(gulp.dest(pathFinder('/dist/')))
});

gulp.task('vendor', function(){
	var js =  gulp.src([pathFinder('/src/vendor/js/jquery.min.js'), pathFinder('/src/vendor/js/**/*.js')])
			 	  .pipe(please.concat('vendor.js'))
				  .pipe(gulp.dest(pathFinder('/dist/js/')));
	var css = gulp.src(pathFinder('/src/vendor/css/*.css'))
				  .pipe(please.concat('vendor.css'))
				  .pipe(gulp.dest(pathFinder('/dist/css/')));

	return please.merge(js, css);
});

gulp.task('browsersync', function(){
	please.browsersync.init({
		server : {
			baseDir: pathFinder('/dist/')
		}
	});

	gulp.watch(pathFinder('/src/scss/**/*.scss'), ['styles']);
	gulp.watch(pathFinder('/src/**/*.html'), ['html']);
	gulp.watch(pathFinder('/src/js/script.js'), ['scripts']);
	gulp.watch(pathFinder('/src/images/**/*'), ['images']);
	gulp.watch(pathFinder('/src/vendor/**/*'), ['vendor']);

	gulp.watch(pathFinder('/dist/**/*')).on('change', please.browsersync.reload);
});

// Default
gulp.task('default', function(){
	please.sequence('pen-add', ['html', 'styles', 'images', 'scripts', 'vendor'], 'browsersync', function(){
		console.log('way to go.');
	});
});