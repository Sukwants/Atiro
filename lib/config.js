const { data } = require('./data.js');

const config = data('config', {
  compiler: {
    path: null
  },
  file: {
    name: 'TEST'
  },
  judge: {
    reco: 'auto',
    comp: '',
    time: '5000',
    judg: 'text',
    grad: null,
    solv: null,
    make: null
  },
  update: {
    type: 'ignore'
  },
  browser: {
    path: null
  }
}, true);

module.exports = {
  load: config.load,
  getValue: config.getValue,
  setValue: config.setValue,
  operate: config.operate
}