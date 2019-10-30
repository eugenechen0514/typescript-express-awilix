const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');
const del = require("del");

// setting
const srcGlobs = {
    js: 'src/**/*.js',
    ts: 'src/**/*.ts',
    hbs: 'src/**/*.hbs',
    html: 'src/**/*.html',
    config: 'config/*.json',
    map: 'resource/map/**/*',
};

const destGlobs = {
    build: 'build',
    dist: 'dist',
    map: 'build/resource/map',
    config: 'build/config',
};

// task
function clean() {
    return del([destGlobs.build]);
}

function script() {
    // var tsResult = gulp.src("src/**/*.ts", { sourcemaps: true }) // or tsProject.src()
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(destGlobs.build));
}

function config() {
    return gulp.src([srcGlobs.config])
        .pipe(gulp.dest(destGlobs.config));
}

function views() {
    return gulp.src([srcGlobs.hbs, srcGlobs.html])
        .pipe(gulp.dest(destGlobs.build));
}

function watch() {
    gulp.watch([srcGlobs.js, srcGlobs.ts, srcGlobs.hbs], {ignoreInitial: true}, script);
}

function copyBuildToDist() {
    return gulp.src([destGlobs.build])
        .pipe(gulp.dest(destGlobs.dist));
}

// define complex tasks
const build = gulp.parallel(views, config, script);
const deploy = gulp.series(clean, build, copyBuildToDist);
const dev = gulp.series(clean, gulp.parallel(build, watch));


exports.clean = clean;
exports.config = config;
exports.build = build;
exports.watch = watch;
exports.deploy = deploy;
exports.dev = dev;
exports.default = dev;
