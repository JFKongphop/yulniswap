const path = require('path');
const fs = require('fs');
const solc = require('solc');

const fullPath = process.argv[2];

const [folder, contract] = fullPath.split('/')

console.log(folder, contract)


if (!fullPath) {
  console.log('Invalid contract');
  process.exit(1);
}

const buildDir = path.resolve(__dirname, '..', 'build', fullPath);

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

const outputBytecodePath = path.join(buildDir, `${contract}.bytecode.json`);
const outputOpcodesPath = path.join(buildDir, `${contract}.opcode.txt`);
 
const inputPath = path.resolve(__dirname, '..', 'contracts', `${fullPath}.yul`);
console.log("input path", inputPath)
const source = fs.readFileSync(inputPath, 'utf-8');

const input = {
  language: 'Yul',
  sources: {
    key: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['evm.bytecode'],
      },
    },
  },
};

const compiledContract = solc.compile(JSON.stringify(input));
const parsed = JSON.parse(compiledContract);

if (JSON.parse(compiledContract).errors.length) throw new Error("Invalid compile contract");


const { object: bytecode, opcodes } = parsed.contracts.key[contract].evm.bytecode;

const lines = opcodes.trim().split(/\s+/);
const output = lines.join('\n');

fs.writeFileSync(outputBytecodePath, JSON.stringify(bytecode));
fs.writeFileSync(outputOpcodesPath, output);

console.log('Compiled and saved to:', buildDir);
