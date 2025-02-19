const fs = require("fs");
const { obfuscate } = require("js-confuser");
const { exec } = require("child_process")
const { promisify } = require("util");
const path = require("path");
const crx3 = require("crx3");
const esbuild = require("esbuild");
const { minify } = require('html-minifier-terser');


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
  await execPromise('xcopy /E /I src\\extension prod\\extension\\')
}

const htmlPlugin = {
  name: 'html-plugin',
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const content = await fs.promises.readFile(args.path, 'utf8');
      const minified = await minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      });
      return {
        contents: `export default ${JSON.stringify(minified)};`,
        loader: 'js',
      };
    });
  },
};


async function bundleJS(release = false) {
  esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: 'prod/extension/main.js',
    minify: true,
    sourcemap: false,
    treeShaking: true,
    keepNames: false,
    plugins: [htmlPlugin],
  }).then(async () => {
    const inputFilePath = 'prod/extension/main.js'
    const outputFilePath = 'prod/extension/main.js'

    const code = fs.readFileSync(inputFilePath, 'utf-8')

    if (release) {
      const result = await obfuscate(code, {
        target: "browser",
        preset: "high",
        pack: true,

        deadCode: 1, //
        dispatcher: true,
        globalConcealing: true,
        renameVariables: true,
        identifierGenerator: 'zeroWidth',

        // these things slow down the code
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: true,
        stringCompression: true,

        // these things break the code
        controlFlowFlattening: false,
        duplicateLiteralsRemoval: true, // // this doesnt break code, but it makes it 30x bigger
        flatten: false, //THIS IS NIGGER SHIT
        objectExtraction: true, //
        opaquePredicates: false,
        renameGlobals: false,
      });
      fs.writeFileSync(outputFilePath, `
// Copyright © Surplus Softworks.
// trust me, you will not get anywhere bro!

(function() {
  const whitelist = [
    'surviv',
    'survev',
    'resurviv',
    'zurviv',
    'expandedwater',
    '66.179.254.36',
    'eu-comp',
    '50v50',
    'surv',
    'zurv',
  ];

  if (!whitelist.some(domain => window.location.hostname.includes(domain))) {
    return;
  };
  ${result.code}
})();`)

    } else {
      fs.writeFileSync(outputFilePath, `
// Copyright © Surplus Softworks.

(function() {
  const apply = Reflect.apply;
  Function.prototype.constructor = new Proxy(Function.prototype.constructor, {
    apply(f, th, args) {
      if (args[0] == "debugger") return apply(f, th, [""]);
      return apply(f, th, args);
    }
  });
})();

(function() {

  const whitelist = [
    'surviv',
    'survev',
    'resurviv',
    'zurviv',
    'expandedwater',
    '66.179.254.36',
    'eu-comp',
    '50v50',
    'surv',
    'zurv',
  ];

  if (!whitelist.some(domain => window.location.hostname.includes(domain))) {
    return;
  };
  ${code}
})();`)
    }

    const extensionDir = path.resolve('prod/extension')
    const crxOutputPath = path.resolve('prod/Surplus.crx')
    crx3([extensionDir], {
      keyPath: null,
      crxPath: crxOutputPath,
    }).then(() => {
      fs.renameSync(crxOutputPath, 'prod/Surplus.zip');
    }).catch()
  });
}

async function build(argv) {
  try {
    await clear().then(async () => {
      await copyExtension().then(async () => {
        await bundleJS(argv.some(v => v.toLowerCase() == "release"))
      })
    })
  } catch (err) {
    console.log(err);
  }
}

build(process.argv.slice(2))