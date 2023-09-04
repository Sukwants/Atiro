const data = require('./data.js');

const config = data('config', {
  compiler: {
    path: null
  },
  file: {
    name: 'TEST'
  },
  judge: {
    comp: '',
    time: '5000',
    judg: 'text',
    grad: null,
    solv: null,
    make: null
  },
  update: {
    type: 'notice'
  }
}, true);

module.exports = {
  load: config.load,
  getValue: config.getValue,
  setValue: config.setValue,
  operate: config.operate
}