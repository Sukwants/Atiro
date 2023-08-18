const data = require('./data.js');

const config = data('config', {
  file: {
    name: 'TEST'
  },
  option: {
    comp: '',
    time: '5000',
    judg: 'text',
    grad: null,
    solv: null
  },
  update: {
    type: 'notice'
  }
});

module.exports = {
  load: config.load,
  getValue: config.getValue,
  setValue: config.setValue,
  operate: config.operate
}