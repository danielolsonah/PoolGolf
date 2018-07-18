module.exports = {
	entry: __dirname + '/client/index.js',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	module: {
		rules: [{
			test: /\.js?$/,
			include: __dirname + '/client',
			exclude: __dirname + '/node_modules',
			loader: 'babel-loader',
			query: {
				presets: ['env']
			}
		}]
	}
}