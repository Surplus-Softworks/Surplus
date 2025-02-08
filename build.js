const fs = require("fs");
const { obfuscate } = require("js-confuser");
const { exec } = require("child_process")
const { promisify } = require("util");
const path = require("path");
const crx3 = require("crx3");
const esbuild = require("esbuild");

const error = console.error;
console.error = function (...args) {
  if (args.some(arg => arg && arg.code === 'ERR_INVALID_ARG_TYPE')) {
    console.log('crx3 key blabla');
    return;
  }
  error.apply(console, args);
};


const execPromise = promisify(exec)

async function clear() {
  const prodDir = 'prod'
  try {
    if (fs.existsSync(prodDir)) {
      fs.rmSync(prodDir, { recursive: true, force: true })
    }
  } catch (err) {
    console.error("Error clearing the directory:", err)
  }
}

async function copyExtension() {
  await execPromise('xcopy /E /I extension prod\\extension\\')
}

async function bundleJS(release = false) {
  esbuild.build({
    entryPoints: ['./src/index.js'],  
    bundle: true,                     
    outfile: 'prod/extension/main.js',
    minify: true,                     
    sourcemap: false,                 
  }).then(async () => {
    const inputFilePath = 'prod/extension/main.js'
    const outputFilePath = 'prod/extension/main.js'

    const code = fs.readFileSync(inputFilePath, 'utf-8')

    if (release) {
      const result = await obfuscate(code, {
        target: 'browser',
        compact: true,
        hexadecimalNumbers: true,
        deadCode: 1,
        identifierGenerator: 'zeroWidth',
        minify: true,
        movedDeclarations: true,
        renameVariables: true,
        stringConcealing: true,
        astScrambler: true,
        preserveFunctionLength: true,
        renameLabels: true,
        objectExtraction: true,
        variableMasking: true,
        lock: {
          integrity: true,
          selfDefending: true,
          tamperProtection: true,
          countermeasures: '',
        },
        dispatcher: 1,
        shuffle: true,
        calculator: true,
        opaquePredicates: 1,
        stringEncoding: true,
        stringSplitting: true,
        stringCompression: true,
        duplicateLiteralsRemoval: true,
        flatten: true,
        pack: true,
      });
      fs.writeFileSync(outputFilePath, `// Copyright © Surplus Softworks.\n// trust me, you will not get anywhere bro!\n\n(function() { ${result.code} })();`)
    } else {
      fs.writeFileSync(outputFilePath, `\n//Copyright © Surplus Softworks.\n\n(function() { ${code} })();`)
    }
    
    const extensionDir = path.resolve('prod/extension')
    const crxOutputPath = path.resolve('prod/Surplus.crx')
    crx3([extensionDir], {
      keyPath:null,
      crxPath: crxOutputPath,
    }).then(()=>{
      fs.renameSync(crxOutputPath, 'prod/Surplus.zip');
    }).catch()
  });
}

async function build(argv) {
  try {
    await clear().then(async ()=>{
      await copyExtension().then(async ()=>{
        await bundleJS(argv.some(v=>v.toLowerCase()=="release"))
      })
    })
  } catch(err) {
    console.log(err);
  }
}

build(process.argv.slice(2))