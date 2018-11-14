const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: path.join(__dirname, '/src/ts/main.ts'),
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [ new CopyWebpackPlugin([
        { from: 'src/html/index.html' },
        { from: 'res', to: 'res/' },
        { from: 'src/css', to: 'css/' }
      ])],
};

