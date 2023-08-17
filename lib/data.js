const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { check } = require('./checker');

module.exports = (cate, defaults) => {
  const direPath = path.join(__dirname, '..', 'data');
  const filePath = path.join(__dirname, '..', 'data', `${cate}.json`);

  const data = {};

  function load() {
    try {
      const _data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};
      for (let type in defaults) {
        data[type] = {};
        if (_data[type]) {
          for (let key in defaults[type]) {
            data[type][key] = _data[type][key];
          }
        }
      }
    } catch (error) {
      console.log(chalk.gray('[Mysterious Error]'), 'Failed on reading.');
      process.exit(0);
    }
  }
  
  function checkKey(type, key) {
    return defaults[type] !== undefined && defaults[type][key] !== undefined;
  }
  
  function getValue(type, key) {
    return data[type][key] !== undefined ? data[type][key] : defaults[type][key];
  }
  
  function getValueTruly(type, key) {
    return data[type][key];
  }
  
  function setValue(type, key, value) {
    try {
      data[type][key] = value;
      if (!fs.existsSync(direPath)) {
        fs.mkdirSync(direPath);
      }
      fs.writeFileSync(filePath, JSON.stringify(data));
      console.log(chalk.green('[Success]'), 'Set the successfully.');
    } catch (error) {
      console.log(chalk.gray('[Mysterious Error]'), 'Failed on setting.');
      process.exit(0);
    }
  }
  
  function unsetValue(type, key) {
    try {
      delete data[type][key];
      if (!fs.existsSync(direPath)) {
        fs.mkdirSync(direPath);
      }
      fs.writeFileSync(filePath, JSON.stringify(data));
      console.log(chalk.green('[Success]'), 'Unset successfully.');
    } catch (error) {
      console.log(chalk.gray('[Mysterious Error]'), 'Failed on unsetting.');
      process.exit(0);
    }
  }
  
  function operate(key, options) {
    key = key.split('.');
    let type = key[0];
    key = key[1];
    if (!type || !key || !checkKey(type, key)) {
      console.log(chalk.red('[Error]'), `No key ${type}.${key} found.`);
    } else {
      if (options.get) {
        console.log(`${type}.${key}: ${getValueTruly(type, key)}`);
      } else if (options.set) {
        setValue(type, key, options.set);
      } else if (options.unset) {
        unsetValue(type, key);
      } else {
        console.log(chalk.red('[Error]'), 'No operation specified.');
      }
    }
  }

  return {
    load: load,
    checkKey: checkKey,
    getValue: getValue,
    getValueTruly: getValueTruly,
    setValue: setValue,
    unsetValue: unsetValue,
    operate: operate
  }
}
