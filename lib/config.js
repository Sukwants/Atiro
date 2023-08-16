const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configDirePath = path.join(__dirname, '..', 'data');
const configFilePath = path.join(__dirname, '..', 'data', 'config.json');

const defaultConfig = {
  file: {
    name: 'TEST'
  },
  option: {
    comp: '',
    time: '5000',
    judg: 'text',
    grad: null
  }
};
const config = {};

let checkConfigKey = (type, key) => {
  return defaultConfig[type] !== undefined && defaultConfig[type][key] !== undefined;
};
let getConfigValueTruly = (type, key) => {
  return config[type][key];
};
let setConfigValue = (type, key, value) => {
  try {
    config[type][key] = value;
    if (!fs.existsSync(configDirePath)) {
      fs.mkdirSync(configDirePath);
    }
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log(chalk.green('[Success]'), 'Set the config successfully.');
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on setting the config.');
    process.exit(0);
  }
};
let unsetConfigValue = (type, key) => {
  try {
    delete config[type][key];
    if (!fs.existsSync(configDirePath)) {
      fs.mkdirSync(configDirePath);
    }
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log(chalk.green('[Success]'), 'Unset the config successfully.');
  } catch (error) {
    console.log(chalk.gray('[Mysterious Error]'), 'Failed on unsetting the config.');
    process.exit(0);
  }
};

module.exports = {
  loadConfig: () => {
    try {
      const _config = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) : {};
      for (let type in defaultConfig) {
        config[type] = {};
        if (_config[type]) {
          for (let key in defaultConfig[type]) {
            config[type][key] = _config[type][key];
          }
        }
      }
    } catch (error) {
      console.log(chalk.gray('[Mysterious Error]'), 'Failed on reading config.');
      process.exit(0);
    }
  },
  getConfigValue: (type, key) => {
    return config[type][key] !== undefined ? config[type][key] : defaultConfig[type][key];
  },
  operateConfig: ((key, options) => {
    key = key.split('.');
    let type = key[0];
    key = key[1];
    if (!type || !key || !checkConfigKey(type, key)) {
      console.log(chalk.red('[Error]'), `No config key ${type}.${key} found.`);
    } else {
      if (options.get) {
        console.log(`${type}.${key}: ${getConfigValueTruly(type, key)}`);
      } else if (options.set) {
        setConfigValue(type, key, options.set);
      } else if (options.unset) {
        unsetConfigValue(type, key);
      } else {
        console.log(chalk.yellow('[Warning]'), 'No operation specified.');
      }
    }
  })
}
