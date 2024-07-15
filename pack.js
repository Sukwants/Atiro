const fs = require('fs');
const { execSync } = require('child_process');
const exe = require('@angablue/exe');

async function main() {
  const code = fs.readFileSync('./index.js').toString();

  fs.writeFileSync('./index.js', `#!/usr/bin/env node\n\nprocess.env.ATIRO_PACK = true;\n${code.replace(/^#!\/usr\/bin\/env node\r?\n/, '')}`);

  try {
    execSync('npx ncc build ./index.js -o ./dist/');
  } catch (error) {
    fs.writeFileSync('./index.js', code);
    console.error(error);
    process.exit(0);
  }

  fs.writeFileSync('./index.js', code);

  try {
    if (process.platform == 'win32') {
      await exe({
        entry: './dist/index.js',
        pkg: ["--public"],
        out: './dist/atiro-windows.exe',
        version: require('./package.json').version,
        target: 'node18-win-x64',
        icon: './assets/icon.ico',
        properties: {
          FileDescription: 'Atiro - Useless OI Tools',
          ProductName: 'Atiro',
          LegalCopyright: 'Copyright Atiro Contributors. MIT License.',
          OriginalFilename: 'atiro.exe'
        }
      });
    } else if (process.platform == 'linux') {
      execSync(`npx pkg ./dist/index.js -o ./dist/atiro-linux -t node18-linux-x64 --public`, { stdio: 'inherit' });
    } else if (process.platform == 'darwin') {
      execSync(`npx pkg ./dist/index.js -o ./dist/atiro-macos -t node18-macos-x64 --public`, { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(error);
  }
}

main();