const fs = require("fs");
const esbuild = require("esbuild");
const { minify } = require('html-minifier-terser');
const path = require("path");
const archiver = require("archiver");
const { obfuscate } = require("js-confuser")
const Terser = require("terser");

const VERSION = "1.14"
const DIST_DIR = 'dist/extension';
const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
};
const MINIFY_OPTIONS = {
  compress: {
      passes: 3,
      drop_console: true,
      drop_debugger: true,
      unsafe: true,
      unsafe_math: true,
      unsafe_comps: true,
      unsafe_proto: true
  },
  mangle: {
      toplevel: true
  },
  output: {
      comments: false
  }
}
const OBFUSCATE_OPTIONS = {
  target: 'browser',
  minify: true,
  identifierGenerator: 'zeroWidth',
  renameLabels: true,
  renameVariables: true,
  renameGlobals: true,
  variableMasking: false,
  stringEncoding: false,
  stringSplitting: false,
  stringCompression: false,
  duplicateLiteralsRemoval: false,
  dispatcher: false,
  rgf: false,
  controlFlowFlattening: false,
  calculator: false,
  movedDeclarations: true,
  opaquePredicates: false,
  shuffle: false,
  preserveFunctionLength: false,
  astScrambler: false,
  objectExtraction: false,
  deadCode: false,
  compact: true,
  pack: true, 

  preset: false,
}

async function clear() {
  try {
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
  } catch (err) {
    console.error("Error clearing directory:", err);
  }
}

async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function copyFiles() {
  await fs.promises.mkdir(DIST_DIR, { recursive: true });
  await copyDirectory("src/extension", DIST_DIR);
  let manifestContents = fs.readFileSync(DIST_DIR + "/manifest.json", "utf-8");
  manifestContents = manifestContents.replace("%VERSION%", VERSION);
  fs.writeFileSync(DIST_DIR + "/manifest.json", manifestContents);
}

async function zip(filename = 'Surplus (DO NOT EXTRACT).zip') {
  const zipPath = `dist/${filename}`;
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve();
    });

    archive.on("error", (err) => reject(err));
    archive.pipe(output);
    archive.directory(DIST_DIR, false);
    archive.finalize();
  });
}

const htmlPlugin = {
  name: 'html-plugin',
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const content = await fs.promises.readFile(args.path, 'utf8');
      const minified = await minify(content, HTML_MINIFY_OPTIONS);
      return {
        contents: `export default ${JSON.stringify(minified)};`,
        loader: 'js',
      };
    });
  },
};

async function buildBundle(dev = true) {
  const EPOCH = Date.now() + (1000 * 60 * 60 * 24 * 7);
  await esbuild.build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: `${DIST_DIR}/main.js`,
    minify: true,
    sourcemap: false,
    treeShaking: true,
    plugins: [htmlPlugin],
    define: {
      EPOCH: EPOCH.toString(),
      VERSION: VERSION,
      DEV: dev.toString()
    }
  });

  let mainContent = fs.readFileSync(`${DIST_DIR}/main.js`, 'utf-8');
  const minified = await Terser.minify(mainContent)
  if (!dev) {
    const obfuscated = await obfuscate(minified.code, OBFUSCATE_OPTIONS)
    mainContent = obfuscated.code
  }
  const wrapperCode = `// Copyright © Surplus Softworks\n
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

  if (!whitelist.some(domain => globalThis.location.hostname.includes(domain))) {
    return;
  };

  ${mainContent}
})();`;

  fs.writeFileSync(`dist/extension/main.js`, wrapperCode);
  fs.writeFileSync(`dist/Surplus.user.js`, `// ==UserScript==
// @name         Surplus
// @version      ${VERSION}
// @description  A cheat for survev.io & more
// @author       mahdi, noam
// @match        *://*/*
// @run-at       document-start
// @icon         https://i.postimg.cc/W4g7cxLP/image.png
// ==/UserScript==

${wrapperCode}`);
}

async function build(argv) {
  try {
    await clear();
    await copyFiles();
    await buildBundle(argv.some(v => v.toLowerCase() == "dev"));
    await zip();
    console.log('Build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build(process.argv.slice(2));
