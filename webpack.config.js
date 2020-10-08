const path = require('path');
const uglifyjs = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: { // se pueden especificar varios entry points
		"movies-inicio": "./src/scripts/combos/movies-inicio.js",
		"movies-producto": "./src/scripts/combos/movies-producto.js",
		"movies-categoria": "./src/scripts/combos/movies-categoria.js",
		"movies-departamento": "./src/scripts/combos/movies-departamento.js",
		"movies-contenido-estatico": "./src/scripts/combos/movies-contenido-estatico.js",
		"movies-login": "./src/scripts/combos/movies-login.js",
		"movies-corporate-pages": "./src/scripts/combos/movies-corporate-pages.js",
		"movies-myaccount": "./src/scripts/combos/my-account.js"
	},
	output: { // solo se puede especificar una carpeta output
		filename: '[name].bundle.min.js',
		path: path.resolve(__dirname, 'src/scripts/outputs')
	},
	devtool: "source-map",
	watch: true,
	module: {
    rules: [
      { // Remplaza la palabra "window.jQuery" por "window.jq" que es el que tiene el jQuery del bundle.
        test: /jquery\.fancybox\.js$/,
        loader: "string-replace-loader",
        enforce: "pre",
        options: {
          search: "window.jQuery",
          replace: "window.jq",
          flags: "g"
        }
      }
    ]
  },
	plugins: [
		new uglifyjs({
			sourceMap: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
		  name: "movies-commons",
		  filename: "[name].bundle.min.js",
		  minChunks: 3
		})
	]
};
