import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer'
import browserSync, { create } from 'browser-sync';
import useref from 'gulp-useref';				//concat files
import uglify from 'gulp-uglify';				//minify
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import cleanCSS from 'gulp-clean-css';	//minify
import imagemin from 'gulp-imagemin';
import cache from 'gulp-cache';					//cache unchaged images
import shell from 'gulp-shell';
import del from 'del';
import runSequence from 'run-sequence';

gulp.task('build-css', () => {
	return gulp.src('./app/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.reload({
			stream: true,
		}))
});

gulp.task('browserSync', () => {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});

gulp.task('useref', () => {
	return gulp.src('./app/*.html')
		.pipe(useref())																						//Concat CSS/JS
		.pipe(gulpIf('*.js', babel({presets: ['es2015']})))				//Transpile JS
		.pipe(gulpIf('*.js', uglify(															//Minify JS
			{compress: { drop_console: true }})))									//Strip console.logs			
		.pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'})))	//Minify CSS
		.pipe(gulp.dest('dist'))																	//Copy CSS/JS
});

gulp.task('images', () =>{
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', () => {																//Copy fonts to dit
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', () => {														//Delete the dist folder contents
  return del.sync('dist/**');
})

gulp.task('watch', ['browserSync', 'build-css'], () => {
	gulp.watch('./app/scss/**/*.scss', ['build-css']);
	gulp.watch(['app/js/**/*.js', 'test/**/*.test.js'], ['test']);			//Re-run tests whenever JS or test changes
  gulp.watch(['app/*.html', 'app/js/**/*.js'], browserSync.reload); 	//Also reloads the browser when HTML or JS changes					
});

gulp.task('test', 																		//Run tests once
	shell.task('karma start --single-run --browsers ChromeHeadless karma.conf.js')
);

gulp.task('build', (callback) => {												//Prep dist
  runSequence('clean:dist', 'build-css',
    ['useref', 'images', 'fonts'],
    callback
  )
});
gulp.task('deploy-ghp', 																	//Deploy to Github pages
	shell.task('git subtree push --prefix dist origin gh-pages')
);
gulp.task('default', (callback) => {											//Initial dev build then watch
  runSequence(['build-css','browserSync','watch'],
    callback
  )
});
