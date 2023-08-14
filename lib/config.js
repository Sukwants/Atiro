const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const configDirePath = path.join(__dirname, '..', 'data');
const configFilePath = path.join(__dirname, '..', 'data', 'config.json');

const defaultConfig = {
  file: {
    name: 'TEST'
  },
  options: {
    comp: '',
    time: '5000',
    judg: 'text'
  }
};
const config = {};

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
  checkConfigKey: (type, key) => {
    return defaultConfig[type] !== undefined && defaultConfig[type][key] !== undefined;
  },
  getConfigValueTruly: (type, key) => {
    return config[type][key];
  },
  setConfigValue: (type, key, value) => {
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
  },
  unsetConfigValue: (type, key) => {
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
  }
}
