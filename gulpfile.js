"use strict";

const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const hb = require("gulp-hb");
const layouts = require("handlebars-layouts");
const sourcemaps = require("gulp-sourcemaps");

const srcPaths = {
  scripts: ["./src/js/**/*"],
  fonts: ["./src/fonts/**/*"],
  images: ["./src/img/**/*"],
  styles: ["./src/sass/**/*.scss"],
  cssEntries: [
    "./src/sass/application.scss",
    "./src/sass/application-dark.scss"
  ],
  static: ["./src/demo/**/*"],
  templates: ["src/*.hbs", "src/pages/**/*.hbs"],
  partials: ["./src/partials/*.hbs"],
  helpers: [
    "./node_modules/handlebars-layouts/index.js",
    "./src/helpers/index.js"
  ]
};

hb.handlebars.registerHelper(layouts(hb.handlebars));

function clean() {
  return del(["dist/*"]);
}

// Copy demo, img, js, fonts folders from src to dist
function copy() {
  return gulp
    .src([...srcPaths.static, ...srcPaths.images, ...srcPaths.fonts], {
      base: "./src",
      encoding: false
    })
    .pipe(gulp.dest("dist"));
}

function copyJS() {
  return gulp.src(srcPaths.scripts).pipe(gulp.dest("dist/js"));
}

// Handle handlebars
function hbs() {
  return gulp
    .src(srcPaths.templates)
    .pipe(
      hb({
        partials: srcPaths.partials,
        helpers: srcPaths.helpers
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("dist"));
}

// Handle sass

function styles() {
  return gulp
    .src(srcPaths.cssEntries)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        precision: 10,
        outputStyle: "compressed"
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./dist/css"));
}

// Development
exports.watch = function watch() {
  gulp.watch(srcPaths.scripts, gulp.series(copyJS));
  gulp.watch(srcPaths.styles, gulp.series(styles));
  gulp.watch([...srcPaths.templates, ...srcPaths.partials], gulp.series(hbs));
  gulp.watch(
    [...srcPaths.static, ...srcPaths.images, ...srcPaths.fonts],
    gulp.series(copy)
  );
};

const build = gulp.parallel(hbs, styles, copy, copyJS);
exports.build = build;
exports.default = gulp.series(clean, build);
