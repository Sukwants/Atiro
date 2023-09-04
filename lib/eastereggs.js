const chalk = require('chalk');

function atiro_or_orita() {
  console.log(
`
${chalk.bold('Atiro for sure!')}

1. ${chalk.bold('Simpler Installation:')} Atiro's installation is simpler, requiring only
   the installation of Node.js and g++, while Orita needs to be compiled
   and installed on Windows or Linux, along with additional tools like
   CMake. 
2. ${chalk.bold('Friendlier Commands:')} Atiro provides clear commands with parameters and
   options, easy to understand and operate. Orita, on the other hand,
   utilizes unique commands and parameters that might require more learning
   and memorization.
3. ${chalk.bold('Clearer README Doc:')} Atiro's README doc offers concise installation, and
   usage guidelines. It also provides straightforward examples of the
   commands. Orita's doc may require more time understanding the setup and
   usage instructions.
4. ${chalk.bold('Better Support for Compiler:')} Atiro offers options to specify the path to
   the g++ compiler, allowing users to define their compiler path. In
   contrast, Orita requires users to manually ensure that g++ is globally
   accessible.
5. ${chalk.bold('Better Support for Judging-assisting Programs:')} Atiro supports checker,
   interactor, solver and generator. This versatility makes Atiro more
   helpful. While Orita also supports so, Atiro's command parameters and
   options are more intuitive.

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