/*=============================================================*/
/* REQUIRES */
var 	gulp    = require("gulp"),
	uglify      = require("gulp-uglify"),
	sass        = require("gulp-sass"),
	sourcemaps  = require("gulp-sourcemaps"),
	plumber     = require("gulp-plumber"),
	webpack     = require("webpack-stream"),
	rename      = require("gulp-rename"),
	browserSync = require("browser-sync").create();

/*=============================================================*/
/* TASKS */
// Se trabajan las tareas de sass con gulp y las de javascript con Webpack porque
// por el momento Webpack no permite especificar multiples carpetas de destino.
// La tarea de sass es una típica tarea de gulp. Las de vendor se trabajan en una tarea
// separada para poder ponerlas en la misma carpeta output.
gulp.task("sass", function() {
	return gulp.src("src/styles/combos/*.scss", {base: "src/styles/combos"})
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(rename({suffix: ".min"}))
	.pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("src/styles/outputs"))
	.pipe(browserSync.stream());
});

gulp.task("sass-local-vendor", function() {
	return gulp.src("src/styles/local-vendor/*.scss", {base: "src/styles/local-vendor"})
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(rename({suffix: ".min"}))
	.pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("src/styles/outputs"))
	.pipe(browserSync.stream());
});

// Esta tarea usa Webpack, porque permite hacer un bundle de los js y manejar
// jQuery sin hacer conflicto con la versión vieja de jQuery en VTex.
gulp.task("scripts", function() {
	return gulp.src("src/scripts/combos/*.js", {base: "src/scripts/combos"})
	.pipe(webpack(require('./webpack.config.js'))) // Llama las configuraciones
	.pipe(gulp.dest("src/scripts/outputs"));
});

gulp.task("browserSync", function() {
	return browserSync.init({
		server: {
			baseDir: "./src",
			index: "inicio.html"
		}
	});
});


/*=============================================================*/
/* WATCH */
gulp.task("watch", function() {
	// Mira todas las carpetas de styles excepto vendor y outputs.
	gulp.watch("src/styles/!(outputs)/*.scss", ["sass", "sass-local-vendor"]);
	// Mira todas sólo la carpeta outputs ya que es la que sufre el cambio despues
	// de la compilación de Webpack. Ese proceso se demora un poco especialmente por
	// la generación de sourcemaps y porque compila todas las librerias de JQuery.
	gulp.watch("src/scripts/outputs/*.js", ["scripts"])/*.on('change', browserSync.reload)*/;
	// Mira los cambios en los htmls.
	gulp.watch(["src/inicio.html", "src/pages/*.html"]).on('change', browserSync.reload);
});

/*=============================================================*/
/* DEFAULT TASK */
gulp.task("default", ["sass", "sass-local-vendor", "scripts", "browserSync", "watch"]);
