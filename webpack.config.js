var debug = process.env.NODE_ENV !== "production";
const path = require('path')

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./index.js",
  output: {
    	path: path.join(__dirname, "test"), 
    	filename: "cc-ui.min.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use:[ 
          {
    		loader: 'url-loader?limit=100000' 	
    	  } 
        ]        
      }


    ]
  }
};