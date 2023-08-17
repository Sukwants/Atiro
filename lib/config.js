const data = require('./data.js');

const config = data('config', {
  file: {
    name: 'TEST'
  },
  option: {
    comp: '',
    time: '5000',
    judg: 'text',
    grad: null
  },
  update: {
    type: 'notice'
  }
});

module.exports = {
  loadConfig: config.load,
  getConfigValue: config.getValue,
  setConfigValue: config.setValue,
  operateConfig: config.operate
}