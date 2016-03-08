// generated on 2016-01-06 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import runSequence from 'run-sequence';
import nodemon from 'nodemon';
import modRewrite  from 'connect-modrewrite';



import gulpProtractor from 'gulp-protractor';

const protractor = gulpProtractor.protractor;
const webdriver_update = gulpProtractor.webdriver_update;
const webdriver_standalone = gulpProtractor.webdriver_standalone;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('client/web/app/**/**/*.js'));
gulp.task('lint:test', lint('client/web/test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({ mangle: false })))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('angulartemplates', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/modules/*/**/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({ mangle: false })))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist/modules'));
});

gulp.task('sprite', () =>  {
  return gulp.src('app/images/sprites/*.png').pipe($.spritesmith({
    imgName: 'app/images/sprite.png',
    cssName: 'app/styles/_sprite.scss'
  })).pipe(gulp.dest('./'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['lint', 'styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    uiPort: 3002,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/modules/**/*.js',
    'app/modules/**/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    uiPort: 3002,    
    server: {
      baseDir: ['dist'],
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ]      
    }
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    uiPort: 3002,    
    ui: false,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ],      
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'angulartemplates', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});



// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);


// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// Protractor test runner task
gulp.task('protractor', ['webdriver_update'], () => {
  gulp.src([])
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('end', () => {
      console.log('E2E Testing complete');
      // exit with success.
      process.exit(0);
    })
    .on('error', (err) => {
      console.log('E2E Tests failed');
      process.exit(1);
    });
});

gulp.task('env:test', () => {
  //process.env.NODE_ENV = 'test';
});

// Drops the MongoDB database, used in e2e testing
gulp.task('dropdb', (done) => {
  // Use mongoose configuration
  var mongoose = require('../../api/config/lib/mongoose.js');

  mongoose.connect(function(db) {
    db.connection.db.dropDatabase(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('Successfully dropped db: ', db.connection.db.databaseName);
      }
      db.connection.db.close(done);
    });
  });
});

/*
gulp.task('nodemon', () => {
  return nodemon({
    script: '../../api/server.js',
    nodeArgs: ['--debug']
  });
});
*/

gulp.task('test:e2e', function (done) {
  runSequence('env:test', 'protractor', done);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
