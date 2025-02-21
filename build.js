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

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const replacements = [
  { regex: /popup/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /header/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /menu-icon/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /navbar/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /title/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /credit/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /tabs/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /close-btn/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /section/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /section-title/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /section-title-container/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /keybind-slot/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /checkbox-item/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /subgroup/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /slider-container/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /subsection-title/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /section-title label/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /section-title-container/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /aim-enable/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /target-knocked/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /melee-lock/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /semiauto-enable/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /esp-enable/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /player-esp/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /grenade-esp/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /own-flashlight/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /others-flashlight/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /emote-spam-enable/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /emote-spam-speed/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /content-container/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /nav-tabs/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) },
  { regex: /nav-tab/g, replacement: makeid(Math.floor(Math.random() * (15 - 5+ 1)) + 1) }
];


const htmlPluginObf = {
  name: 'html-plugin',
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const content = await fs.promises.readFile(args.path, 'utf8');
      let minified = await minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      });
      for (const { regex, replacement } of replacements) {
        minified = minified.replace(regex, replacement);
      }
      return {
        contents: `export default ${JSON.stringify(minified)};`,
        loader: 'js',
      };
    });
  },
};

const htmlPlugin = {
  name: 'html-plugin',
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const content = await fs.promises.readFile(args.path, 'utf8');
      let minified = await minify(content, {
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

const regexReplacementPlugin = {
  name: 'regex-replacement',
  setup(build) {
      build.onLoad({ filter: /.*/ }, async (args) => {
        if (args.path.includes('loader.js') ||  args.path.includes('worker.js')) {
          console.log(args.path)
        } else {
          return null;
        }
          try {
              let contents = await fs.promises.readFile(args.path, 'utf8');
              
              for (const { regex, replacement } of replacements) {
                  contents = contents.replace(regex, replacement);
              }

              return {
                  contents,
                  loader: 'default'
              };
          } catch (error) {
              return null;
          }
      });
  }
};

async function bundleJS(release = false) {
  let plugins
  if (release) {
    plugins = [htmlPluginObf, regexReplacementPlugin]
  } else {
    plugins = [htmlPlugin]
  }
  esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: 'prod/extension/main.js',
    minify: true,
    sourcemap: false,
    treeShaking: true,
    keepNames: false,
    plugins: plugins,
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