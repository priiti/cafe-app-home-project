// Config file to bundle all 'public' js and es6 js into bundle for usage in front end
const path = require('path');
const webpack = require('webpack');

const javascript = {
	test: /\.(js)$/,
	use: [{
		loader: 'babel-loader',
		options: {
			presets: ['es2015']
		}
	}],
};

const config = {
	entry: {
		App: './public/js/main.js'
	},
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'public', 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [javascript]
	}
}

process.noDeprecation = true;

module.exports = config;