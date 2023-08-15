const config = require('./config.js');
const compile = require('./compiler.js');
const run = require('./runner.js');
const check = require('./checker.js');

module.exports = (file, data, options) => {
  file = file || config.getConfigValue('file', 'name');
  data = data || file;
  compile(file, options);
  run(file, data, options);
  check(data, options);
}