const chalk = require('chalk');

function atiro_or_orita() {
  console.log(
`
${chalk.bold('Atiro for sure!')}

1. ${chalk.bold('Simpler Installation:')} Atiro's installation is simpler, requiring only
   Node.js and g++, while Orita needs to be compiled and installed along
   with additional tools like CMake. 🤣 👉 🤡
2. ${chalk.bold('Friendlier Commands:')} Atiro provides clear commands, easy to understand
   and operate. Orita, on the other hand, has unique operation logic that
   might require more learning and memorization. 🤣 👉 🤡
3. ${chalk.bold('Clearer README Doc:')} Atiro's README doc offers concise usage guidelines.
   It also provides straightforward examples. Orita's doc may require much
   time understanding the setup and usage instructions. 🤣 👉 🤡
4. ${chalk.bold('Better Support for Judging-assisting Programs:')} Atiro supports checker,
   interactor, solver and generator. While Orita also supports so, Atiro's
   command parameters and options are more intuitive. 🤣 👉 🤡
5. ${chalk.bold('Powerful OJ Tools:')} You can get samples and submit codes with Atiro.
   However, Orita, doesn't includes it at all! How can you imagine an OI
   helper without OJ tools? 🤣 👉 🤡

${chalk.bold('In conclusion, opting for Atiro over Orita is undoubtedly the correct choice.')}

${chalk.gray('Written in Season of Leaves Falling, Atiro Year O')}
`
  );
}

function art_of_code() {
  console.log(
`
${chalk.bold('ART OF CODE')}    ${chalk.gray('/  by Atiro')}

Fleeting moments, code takes flight,

Unleashing thoughts, the mind ignites,

Crafting solutions, problems we mend,

Kindling logic, round the bend,

Coders at heart, our passion unwinds,

Creating worlds, boundless and kind,

For in OI's embrace, brilliance we find.

${chalk.gray('Tender Autumn, Atiro Year O')}
`
  );
}

module.exports = {
  atiro_or_orita: atiro_or_orita,
  art_of_code: art_of_code
}