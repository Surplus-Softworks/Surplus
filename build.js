const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { obfuscate } = require("js-confuser");
const rollup = require("rollup");
const rollupConfig = require("./rollup.config.js");

const VERSION = "1.4.6"
const DIST_DIR = 'dist/extension';

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
  objectExtraction: true,
  deadCode: false,
  compact: true,
  pack: true,

  preset: false,
}

const STUB_OBFUSCATE_OPTIONS = {
  target: 'browser',
  calculator: 1,
  compact: true,
  hexadecimalNumbers: true,
  deadCode: 1,
  dispatcher: true,
  duplicateLiteralsRemoval: 1,
  flatten: 1,
  globalConcealing: 1,
  identifierGenerator: 'zeroWidth',
  minify: true,
  movedDeclarations: true,
  objectExtraction: 1,
  renameVariables: true,
  renameGlobals: true,
  shuffle: 1,
  stringConcealing: 1,
  stringCompression: 1,
  stringEncoding: 1,
  stringSplitting: 1,
  astScrambler: true,
  pack: true,
  renameLabels: true,
  preserveFunctionLength: true,
  lock: {
    tamperProtection: true,
    selfDefending: true,
    integrity: true,
  },
  variableMasking: 1,
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

async function buildBundle(dev = true) {
  console.log('Building with Rollup...');

  // Get rollup configuration with command line args
  const configFn = rollupConfig.default || rollupConfig;
  const config = configFn({ dev });

  try {
    // Build with Rollup
    const bundle = await rollup.rollup({
      input: config.input,
      plugins: config.plugins,
    });

    // Generate output
    await bundle.write({
      file: config.output.file,
      format: config.output.format,
      name: config.output.name,
    });

    await bundle.close();

    console.log('Rollup build completed');

    let mainContent = fs.readFileSync(`${DIST_DIR}/main.js`, 'utf-8');

    if (!dev) {
      console.log('Obfuscating code...');
      mainContent = await obfuscate(mainContent, OBFUSCATE_OPTIONS);
      const stub = `try { (() => { setTimeout(${JSON.stringify(mainContent.code)}); })(); } catch {}`;
      const obfuscatedStub = await obfuscate(stub, STUB_OBFUSCATE_OPTIONS);
      mainContent = obfuscatedStub.code;
      console.log('Obfuscation completed');
    }

    const wrapperCode = `// Copyright © Surplus Softworks

(function() {
  const whitelist = [
    'surviv',
    'survev',
    'resurviv',
    'expandedwater',
    '66.179.254.36',
    'eu-comp',
    '50v50',
    'surv',
    'zurv',
  ];

  if (!whitelist.some(domain => globalThis.location.hostname.includes(domain))) {
    return;
  }

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
// @grant        none
// ==/UserScript==

${wrapperCode}`);
  } catch (error) {
    console.error('Build error:', error);
    throw error;
  }
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
