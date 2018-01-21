

const fs = require('fs');
const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");

let configObj = {
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
    /*
    'gameFramework/workers/pathfinding': "./src/gameFramework/workers/pathfinding.js",
    'gameFramework/workers/AIWorker': "./src/gameFramework/workers/AIWorker.js"
    */
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../app")
  }
}


const workerFolder = './src/gameFramework/workers/';
const workerBaseString = 'gameFramework/workers/';

fs.readdirSync(workerFolder).forEach(file => {
  let str = workerBaseString+file;
  str = str.substr(0,str.length-3);
  configObj.entry[str] = workerFolder+file;
});

module.exports = env => {
  return merge(base(env),configObj);
};
