const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const sass = require('gulp-sass');
const zip = require('gulp-zip');

const handleDone = (done, onError = () => {}) => {
    return function (err) {
        if (err) onError(done);
        return done(err);
    };
};

copyTask = (srcPath, destPath, done) =>
    pump([
        src(srcPath),
        dest(destPath),
    ], handleDone(done));

/* Build Js */
const uglify = require('gulp-uglify');
const order = require("gulp-order2");
const concat = require('gulp-concat');

const  buildJsUglify = (done) =>
    pump([
        src(['node_modules/jquery/dist/jquery.js', 'node_modules/skel-framework/dist/skel.min.js', 'assets/js/lib/*.js', 'assets/js/*.js'], {sourcemaps: true}),
        uglify({mangle:{ reserved: ['JQuery']}}),
        dest('assets/js/dist', {sourcemaps: './'}),
    ], handleDone(done, () => buildJsCleanDist(done)));

const buildJsCopyMinified = (done) =>
    copyTask('assets/js/lib/min/*.min.js', 'assets/js/dist/', done)

const buildJsBundle = (done) => {
    pump([
        src(['assets/js/dist/*.js'], {sourcemaps: true}),
        order([
            'jquery.js',
            'jquery.*.js',
            'skel.min.js',
            'util.js',
            'main.js',
        ]),
        concat('bundle.min.js'),
        uglify({output: {comments: false }}), // Strip comments and further reduce size (marginally)
        dest('assets/js/', {sourcemaps: './'})
    ],  handleDone(done, buildJsCleanDist));
}

const clean = require('gulp-clean');
const buildJsCleanDist = (done) =>
    pump([
        src('assets/js/dist', {read: false}),
        clean(),
    ], handleDone(done));

const buildJsCleanBundle = (done) =>
    pump([
        src('assets/js/bundle.*', {read: false}),
        clean(),
    ], handleDone(done));

// Build JS series
const buildJs = series(buildJsCleanBundle, buildJsUglify, buildJsCopyMinified, buildJsBundle, buildJsBundle, buildJsCleanDist);

/* Build Scss */
sass.compiler = require('node-sass');

const css = (done) =>
    pump([
        src('./assets/scss/**/*.scss', {sourcemaps: true}),
        sass({outputStyle: 'compressed'}).on('error', sass.logError),
        dest('assets/css', {sourcemaps: './'}),
    ], handleDone(done));

/* Ghost Theme */

const hbs = (done) =>
    pump([
        src(['ghost/*.hbs', 'ghost/partials/**/*.hbs', '!node_modules/**/*.hbs']),
    ], handleDone(done));

const ghostCopyManifest = (done) => copyTask('package.json', 'ghost/dist/tmp/', done);
const ghostCopyAssets = (done) => copyTask('assets/**', 'ghost/dist/tmp/assets/', done);
const ghostCopyHbs = (done) => copyTask(['ghost/**', '!ghost/dist/', '!ghost/dist/**'], 'ghost/dist/tmp/', done);
const ghostClean = (done) =>
    pump([
        src('ghost/dist/tmp'),
        clean()
    ], handleDone(done));

// Bundle only hbs files - assets are served from
const ghostZip = (done) => {
    var targetDir = 'ghost/dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    pump([
        src([
            'ghost/dist/tmp/**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
        ]),
        zip(filename),
        dest(targetDir)
    ], handleDone(done));
}


/* Build assets */
const buildAssets = series(css, buildJs);
const watchAssets = () => watch(['assets/js/**/*.js', '!assets/js/bundle.*', '!assets/js/dist/*', 'assets/scss/**/*.scss'], buildAssets);
const assetsWatcher = series(buildAssets, watchAssets);

const shell = require('gulp-shell');
const serveJekyll = shell.task('yarn serve:static');
const serveSite = parallel(serveJekyll, assetsWatcher);

/* Build ghost */
const bundleGhost = series(buildAssets, ghostCopyManifest, ghostCopyHbs, ghostCopyAssets, ghostZip, ghostClean);

/* Asset Exports */
exports.buildassets = buildAssets;
exports.watchassets = assetsWatcher;
exports.serveSite = serveSite;

/* Ghost Exports */
exports.zipghost = bundleGhost;

/* Shared Export */
exports.default = serveSite;
