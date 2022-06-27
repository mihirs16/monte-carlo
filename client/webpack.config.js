const path = require('path');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: './src/client.ts',
    module: {
        noParse: /gun\.js$/,
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				type: 'asset/resource'
			}
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'vscode': require.resolve('monaco-languageclient/vscode-compatibility')
        },
        fallback: {
            fs: 'empty',
            child_process: 'empty',
            net: 'empty',
            crypto: 'empty',
            path: require.resolve("path-browserify")
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [new MonacoEditorWebpackPlugin()]
};
