//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var gulp          = require('gulp'),
  less            = require('gulp-less'),
  pug             = require('gulp-jade'),
  minifycss       = require('gulp-clean-css'),
  jshint          = require('gulp-jshint'),
  uglify          = require('gulp-uglify'),
  rename          = require('gulp-rename'),
  clean           = require('gulp-clean'),
  concat          = require('gulp-concat'),
  livereload      = require('gulp-livereload'),
  bower           = require('gulp-bower'),
  bowerfiles      = require('main-bower-files'),
  shell           = require('gulp-shell');

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('images-lite', function() {
  return gulp.src('app/lite/static/images/**/*.*')
    .pipe(gulp.dest('deploy/lite/static/images'))
    .pipe(livereload({auto:false}))
});
gulp.task('images-full', function() {
  return gulp.src('app/static/images/**/*.*')
    .pipe(gulp.dest('deploy/static/images'))
    .pipe(livereload({auto:false}))
});
gulp.task('images', function() {
  return gulp.start(['images-full','images-lite'])
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('app-scripts', function() {
  return gulp.src(['app/server/**/*.js'])
    .pipe(gulp.dest('deploy'))
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('scripts', function() {
  return gulp.src('app/static/scripts/**/*.js')
    .pipe(jshint({lookup:false}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('deploy/static/scripts'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('deploy/static/scripts'))
    .pipe(livereload({auto:false}))
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('views-pug', function() {
  return gulp.src(['app/static/*.pug','app/static/views/**/*.pug'],{base: 'app/static/'})
      .pipe(pug())
      .pipe(gulp.dest('deploy/static'))
      .pipe(livereload({auto:false}))
});

gulp.task('views-pug-lite', function() {
  return gulp.src(['app/lite/views/**/*.pug'],{base: 'app/lite/views/'})
      // .pipe(pug())
      .pipe(gulp.dest('deploy/lite/views'))
      .pipe(livereload({auto:false}))
});

gulp.task('views-html', function() {
  return gulp.src(['app/static/*.html','app/static/views/**/*.html'])
      .pipe(gulp.dest('deploy/static'))
      .pipe(livereload({auto:false}))
});

gulp.task('views', function() {
  return gulp.start('views-pug','views-pug-lite','views-html');
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('styles-app', function() {
  return gulp.src(['app/static/styles/**/*.less'])
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('deploy/static/styles'))
    .pipe(livereload({auto:false}))
});
gulp.task('styles', function() {
  return gulp.start('styles-app');
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

gulp.task('mongroup', function(){
  return gulp.src('app/server/mongroup.*')
      .pipe(gulp.dest('deploy'))
});
gulp.task('json', function(){
  return gulp.src('app/server/*.json')
      .pipe(gulp.dest('deploy'))
});

gulp.task('resources', function() {
  return gulp.start(['mongroup','json']);
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('watch', ['clean'], function() {
  livereload.listen();
  gulp.start('app-scripts','scripts','views','styles','resources','images','bower-files');

  // Watch Images
  gulp.watch('app/static/images/**/*.png', ['images-full']);
  gulp.watch('app/lite/static/images/**/*.png', ['images-lite']);
  // Watch Styles
  gulp.watch('app/static/styles/**/*.less', ['styles-app']);
  // Watch Scripts
  gulp.watch('app/static/scripts/**/*.js', ['scripts']);
  gulp.watch(['app/**/*.js','!app/static/**/*.js'], ['app-scripts']);
  // Watch Views files
  gulp.watch('app/static/**/*.pug', ['views-pug']);
  gulp.watch('app/static/**/*.html', ['views-html']);
  // Watch Resources
  gulp.watch('app/server/nodemon.json', ['nodemon']);
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('bower-clean', function(){
  return gulp.src(['app/static/components/*'])
    .pipe(clean());
})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('bower',['bower-clean'], function(){
  return bower()
    .pipe(gulp.dest('app/static/components'));
})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('bower-update', function(){
  return bower()
    .pipe(gulp.dest('app/static/components'));
})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('bower-files', function() {
  return gulp.src(bowerfiles(), {base: 'app/static/components'})
    .pipe(gulp.dest('deploy/static/components'));
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function() {
  return gulp.src(['deploy/*', '!deploy/components/'], {read: false})
    .pipe(clean());
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
gulp.task('build',['clean'], function() {
  return gulp.start('app-scripts','scripts','views','styles-app','bower-files','resources','images');
});