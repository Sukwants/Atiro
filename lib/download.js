const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

module.exports = async (resource) => {
  switch (resource) {
    case 'testlib':
      const res = await axios('https://raw.githubusercontent.com/MikeMirzayanov/testlib/master/testlib.h');
      fs.writeFileSync('./testlib.h', res.data);
      break;
    default:
      console.log(chalk.blue('[Notice]'), `Don't recognize any "${resource}".`);
      break;
  }
}
