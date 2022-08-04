// Module
import Gulp from "gulp";
import { deleteAsync } from "del";
import GulpTs from "gulp-typescript";
import GulpJs from "gulp-bro";
import NodeBabelify from "babelify";
import GulpUglify from "gulp-uglify";
import NodeUglifyify from "uglifyify";
import GulpGHPage from "gulp-gh-pages";
import GulpWebserver from "gulp-webserver";

// Compiler
const Tsconfig = GulpTs.createProject("tsconfig.json");

// Routes
const routes = {
  deploy: "build/**/*",
  server: "build",
  del: ["build", ".publish"],
  ts: {
    watch: "src/script/**/*.ts",
    src: "src/script/main.ts",
    dest: "build/script",
  },
  js: {
    watch: "src/script/**/*.js",
    src: "src/script/main.js",
    dest: "build/script",
  },
};

// Task
const GHPage = () => Gulp.src(routes.deploy).pipe(GulpGHPage());
const Watch = () => {
  Gulp.watch(routes.ts.dest, Ts);
  Gulp.watch(routes.js.dest, Js);
};
const Server = () =>
  Gulp.src(routes.server).pipe(GulpWebserver({ livereload: true, open: true }));
const Delete = () => deleteAsync(routes.del);
const Js = () =>
  Gulp.src(routes.js.src)
    .pipe(
      GulpJs({
        transform: [
          NodeBabelify.configure({ presets: ["@babel/preset-env"] }),
          ["NodeUglifyify", { global: true }],
        ],
      })
    )
    .pipe(GulpUglify())
    .pipe(Gulp.dest(routes.js.dest));
const Ts = () =>
  Gulp.src(routes.ts.src).pipe(GulpTs()).pipe(Gulp.dest(routes.ts.dest));

// Gulp task
const preset = Gulp.series([Delete]);
const assets = Gulp.series([Js, Ts]);
const postDev = Gulp.parallel([Server, Watch]);

export const build = Gulp.series([preset, assets]);
export const dev = Gulp.series([build, postDev]);
export const deploy = Gulp.series([build, GHPage, preset]);
