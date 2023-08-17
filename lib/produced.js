const data = require('./data.js');

const produced = data('produced', {
  update: {
    latest_version: '0.0.0',
    last_update_time: 0
  }
});

module.exports = {
  load: produced.load,
  getValue: produced.getValue,
  setValue: produced.setValue
}