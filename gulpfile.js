var path = require('path'),
    util = require('util'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    jstify = require('jstify'),
    _ = require('lodash'),
    scp2 = require('scp2'),
    $ = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    mainBowerFiles = require('main-bower-files'),
    eventStream = require('event-stream'),
    npmPackage = require('./package.json');

var config = {
  version: npmPackage.version,
  debug: true,//Boolean($.util.env.debug),
  production: Boolean($.util.env.production) || (process.env.NODE_ENV === 'production')
};

// used across test tasks
var ghostDriver;
var testServer;


function handleError(error) {
  console.error(error.toString());
  this.emit('end');
}


gulp.task('install', function() {
  $.bower();
});


gulp.task('bump', function() {
  var env = $.util.env,
      type = (env.major) ? 'major' : (env.patch) ? 'patch' : 'minor';

  gulp.src(['./bower.json', './package.json'])
    .pipe($.bump({ type: type }))
    .pipe(gulp.dest('./'));
});


gulp.task('build', function() {
  return runSequence(['javascript', 'stylesheets', 'assets'], 'integrate');
});


gulp.task('serve', $.serve({
  root: 'dist',
  port: 8080
}));


gulp.task('preprocess', function() {
  return gulp.src('src/app/**/*.js')
    .pipe($.cached('jslint'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .on('error', handleError);
});


gulp.task('javascript', /*['preprocess'],*/ function() {
  var bundleName = util.format('bundle-%s.js', config.version),
      componentsPath = 'src/components';

  var bundleStream = browserify(
      {
        entries: ['./src/app/main.js'],
        debug: true
      }
    )
    .transform('jstify', {
      engine: 'lodash',
      noMinify: true,
      minifierOpts: false // because the minifier complains about template tags
    })
    .transform('browserify-shim')
    .bundle()
    .on('error', handleError);

  bundleStream
    .pipe(source(bundleName))
    .pipe($.streamify($.sourcemaps.init({loadMaps: true})))
    .pipe($.streamify($.concat(bundleName)))
    .pipe($.if(!config.debug, $.streamify($.uglify())))
    .pipe($.streamify($.sourcemaps.write()))
    .pipe(gulp.dest('dist'))
    .on('error', handleError);
});


gulp.task('stylesheets', function() {
  var bundleName = util.format('styles-%s.css', config.version);

  var components = gulp.src(mainBowerFiles())
    .pipe($.filter(['**/*.css', '**/*.scss']))
    .pipe($.concat('components.css'));

  var app = gulp.src('src/css/styles.scss')
    .pipe($.plumber())
    .pipe($.compass({
      project: path.join(__dirname, 'src'),
      sass: 'css',
      css: '../temp/css'
    }))
    .pipe($.concat('app.css'));

  return eventStream.merge(components, app)
    .pipe($.order([
      '**/components.css',
      '**/app.css'
    ]))
    .pipe($.concat(bundleName))
    .pipe($.if(!config.debug, $.csso()))
    .pipe(gulp.dest('dist/css'))
    .pipe($.if(!config.production, $.csslint()))
    .pipe($.if(!config.production, $.csslint.reporter()));
});


gulp.task('assets', function() {
  // Our stuff
  return gulp.src('src/assets/**')
    .pipe($.cached('assets'))
    .pipe(gulp.dest('dist'))
    .on('error', handleError);
});


gulp.task('clean', function() {
  return gulp.src(['dist', 'temp'], { read: false })
    .pipe($.rimraf());
});


gulp.task('integrate', function() {
  var srcs = gulp.src(['dist/*.js', 'dist/css/*.css'], { read: false });
  return gulp.src('src/index.html')
    .pipe($.inject(srcs, { ignorePath: ['/dist/'], addRootSlash: false }))
    .pipe(gulp.dest('./dist'))
    .on('error', handleError);
});


gulp.task('integrate-test', function() {
  return runSequence('integrate', 'test-run');
});


gulp.task('watch', ['integrate', 'test-setup'], function() {
  var browserSync = require('browser-sync');

  gulp.watch('src/css/**/*.scss', function() {
    return runSequence('stylesheets', 'integrate-test');
  });

  gulp.watch(['src/app/**/*.js', 'src/app/**/*.html'], function() {
    return runSequence('javascript', 'integrate-test');
  });

  gulp.watch(['src/assets/**', 'src/index.html'], function() {
    return runSequence('javascript', 'assets', 'integrate-test');
  });

  $.util.log('Initalize BrowserSync on port 8081');
  browserSync.init({
    files: 'dist/**/*',
    proxy: 'localhost:8080',
    port: 8081,
    reloadOnRestart: false
  });
});


gulp.task('watch-sans-test', ['integrate', 'watch-setup'], function() {
  gulp.watch('src/css/**/*.scss', function() {
    return runSequence('stylesheets', 'integrate');
  });

  gulp.watch(['src/app/**/*.js', 'src/app/**/*.html'], function() {
    return runSequence('javascript', 'integrate');
  });

  gulp.watch(['src/assets/**', 'src/index.html'], function() {
    return runSequence('javascript', 'assets', 'integrate');
  });
});


gulp.task('test-setup', function(cb) {
  var cmdAndArgs = npmPackage.scripts.start.split(/\s/),
      cmdPath = path.dirname(require.resolve('phantomjs')),
      cmd = path.resolve(cmdPath, require(path.join(cmdPath, 'location')).location),
      exec = require('exec-wait'),
      Promise = require('bluebird');

  ghostDriver = exec({
    name: 'Ghostdriver',
    cmd: cmd,
    args: ['--webdriver=4444', '--ignore-ssl-errors=true'],
    monitor: { stdout: 'GhostDriver - Main - running on port 4444' },
    log: $.util.log
  });

  testServer = exec({
    name: 'Test server',
    cmd: cmdAndArgs[0] + (process.platform === 'win32' ? '.cmd' : ''),
    args: cmdAndArgs.slice(1),
    monitor: { url: 'http://localhost:8080/', checkHTTPResponse: false },
    log: $.util.log,
    stopSignal: 'SIGTERM'
  });

  return testServer.start()
    .then(ghostDriver.start)
    .then(function() {
      process.once('SIGINT', function() {
        return ghostDriver.stop()
          .then(testServer.stop)
          .then(function() {
            process.exit();
          });
      });
      return Promise.resolve();
    });
});


gulp.task('watch-setup', function(cb) {
  var cmdAndArgs = npmPackage.scripts.start.split(/\s/),
      cmdPath = path.dirname(require.resolve('phantomjs')),
      cmd = path.resolve(cmdPath, require(path.join(cmdPath, 'location')).location),
      exec = require('exec-wait'),
      Promise = require('bluebird');

  testServer = exec({
    name: 'Test server',
    cmd: cmdAndArgs[0] + (process.platform === 'win32' ? '.cmd' : ''),
    args: cmdAndArgs.slice(1),
    monitor: { url: 'http://localhost:8080/', checkHTTPResponse: false },
    log: $.util.log,
    stopSignal: 'SIGTERM'
  });

  return testServer.start()
    .then(function() {
      process.once('SIGINT', function() {
        return testServer.stop()
          .then(function() {
            process.exit();
          });
      });
      return Promise.resolve();
    });
});


gulp.task('test-run', function() {
  var Promise = require('bluebird');

  $.util.log('Running protractor');

  return new Promise(function(resolve, reject) {
    gulp.src(['tests/*.js'])
      .pipe($.plumber())
      .pipe($.protractor.protractor({
        configFile: 'protractor.config.js',
        args: ['--seleniumAddress', 'http://localhost:4444/wd/hub',
               '--baseUrl', 'http://localhost:8080/']
      }))
      .on('end', function() {
        resolve();
      })
      .on('error', function() {
        resolve();
      });
  });
});


gulp.task('test-teardown', function() {
  return ghostDriver.stop()
    .then(testServer.stop);
});


gulp.task('test', function() {
  return runSequence('test-setup', 'test-run', 'test-teardown');
});


gulp.task('default', ['build']);
