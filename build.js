const fs = require("fs");
const esbuild = require("esbuild");
const { minify } = require('html-minifier-terser');
const path = require("path");
const archiver = require("archiver");

const VERSION = "1.9"
const DIST_DIR = 'dist/extension';
const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
};

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
}

async function zipAndRemove(filename = 'Surplus (DO NOT EXTRACT).zip') {
  const zipPath = `dist/${filename}`;
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      await fs.promises.rm(DIST_DIR, { recursive: true, force: true });
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

async function buildBundle(release = true) {
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
      RELEASE: release
    }
  });

  const mainContent = fs.readFileSync(`${DIST_DIR}/main.js`, 'utf-8');
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
// @version      1.8
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
    await zipAndRemove();
    console.log('Build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build(process.argv.slice(2));
