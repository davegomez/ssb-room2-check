const cliWidth = require('cli-width');
const pad = require('pad');
const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const pkg = require('../package.json');
import {startSSB} from './ssb';

const uri = process.argv[2];
const u = new URL(uri);

function printHorizontalLine() {
  console.log('\n' + Array(cliWidth()).fill('-').join('') + '\n');
}

// Header
console.log(`ssb-room2-check@${pkg.version}`);

printHorizontalLine();

// Generic info about the SSB URI
console.log(`Detected SSB URI:\n    ${uri}\n`);
console.log('Query params:');
let longest = 0;
u.searchParams.forEach((_val, name) => {
  longest = Math.max(name.length, longest);
});
u.searchParams.forEach((val, name) => {
  console.log(`    * ${pad(name, longest + 2)}${val}`);
});

printHorizontalLine();

// Execute scenarios
(async () => {
  const action = u.searchParams.get('action');

  if (action === 'consume-alias') {
    const ssb = startSSB();
    console.log(`Consuming alias...`);
    const [err] = await run(ssb.roomClient.consumeAliasUri)(uri);
    if (err) console.error(err.message);
    else console.log(`Success`);
    printHorizontalLine();
  }

  console.log('Done. This will close in 20 seconds.');
  await sleep(20e3);
})();