import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import del from 'del';
import stripCssComments from 'gulp-strip-css-comments';
import runSequence from 'run-sequence';
import watch from 'gulp-watch';
import glob from 'glob';
import es from 'event-stream';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import mainBowerFiles from 'gulp-main-bower-files';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import minifyCss from 'gulp-minify-css';
import gulpFilter from 'gulp-filter';
import debug from 'gulp-debug';


//----------------------------------------//
// Paths config
//----------------------------------------//

const paths = {
  'app': './',
  'public': '../public/',
  'css': {
    'src': '../app/assets/sass/',
    'dist': '../public/assets/css/'
  },
  'js': {
    'src': '../app/assets/js/',
    'dist': '../public/assets/js/'
  },
  'img': {
    'src': '../app/assets/img/',
    'dist': '../public/assets/img/'
  },
  'views': {
    'src': '../app/views/',
    'dist': '../public/views/'
  }
};






//----------------------------------------//
// Clean
//----------------------------------------//

gulp.task('clean', (cb) => {
  del([paths.public], {force: true}).then( function() {
    cb();
  });
});











//----------------------------------------//
// Bower
//----------------------------------------//

gulp.task('bower-css', function(){
  let filterCSS = gulpFilter('**/*.css');
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterCSS)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(concat('libs.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.css.dist))
});

gulp.task('bower-js', function(){
  let filterJS = gulpFilter('**/*.js');

  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({
          overrides: {
            bootstrap: {
              main: [
                './dist/js/bootstrap.js'
              ]
            }
          }
        }))
    .pipe(filterJS)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dist))
});








//----------------------------------------//
// Sass
//----------------------------------------//

gulp.task('sass', () => {
  return gulp.src(paths.css.src + 'main.scss')
    .pipe(rename('compiled.css'))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(['last 5 versions', 'ie 6-11']))
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(stripCssComments({preserve: false}))
    .pipe(gulp.dest(paths.css.dist));
});








//----------------------------------------//
// Javascript
//----------------------------------------//

gulp.task('js', (done) => {
  glob(paths.app + 'main.js', function(err, files) {
    if(err) done(err);

    var tasks = files.map(function(file) {

      return browserify({ entries: [file] })
        .transform(babelify, { presets: ["es2015"] })
        .bundle()
        .pipe(source('compiled.js'))
        .pipe(gulp.dest(paths.js.dist))
      });

      es.merge(tasks).on('end', done);

    })
});









//----------------------------------------//
// Images
//----------------------------------------//

gulp.task('img', function () {
  gulp.src(paths.img.src + '**/*.{jpg,gif,ico,png,svg}')
  .pipe(imagemin())
  .pipe(gulp.dest(paths.img.dist));
});










//----------------------------------------//
// Images
//----------------------------------------//

gulp.task('views', function () {
  gulp.src(paths.views.src + '**/*.html')
  .pipe(gulp.dest(paths.views.dist));
});









//----------------------------------------//
// Watch
//----------------------------------------//

gulp.task('watch', () => {

  // SASS
  gulp.watch(paths.css.src + '**/*.scss', function() {
    runSequence('sass');
  });

  // Javascript
  gulp.watch(paths.js.src + '**/*.js', function() {
    runSequence(['js']);
  });

  // Images
  gulp.watch(paths.img.src + '**/*.{jpg,gif,ico,png,svg}', function() {
    runSequence(['img']);
  });

  // Images
  gulp.watch(paths.views.src + '**/*.html', function() {
    runSequence(['views']);
  });

});








//----------------------------------------//
// Group tasks
//----------------------------------------//

gulp.task('bower', function(callback) {
  runSequence('clean', 'bower-css', 'bower-js', callback);
});

gulp.task('default', function(callback) {
  runSequence('clean', 'bower', 'sass', 'js', 'img', 'views', callback);
});
