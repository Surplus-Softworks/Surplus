import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { obfuscate } from 'js-confuser';
import { minify } from 'terser';
import * as rollup from 'rollup';
import rollupConfig from './rollup.config.js';

const packageJson = JSON.parse(await fs.promises.readFile('./package.json', 'utf-8'));
const VERSION = packageJson.version;
const DIST_DIR = path.join('dist', 'extension');
const SOURCE_EXTENSION_DIR = path.join('src', 'extension');
const DEFAULT_ARCHIVE_NAME = 'Surplus (DO NOT EXTRACT).zip';
const MANIFEST_PLACEHOLDER = '%VERSION%';
const MAIN_FILE = path.join(DIST_DIR, 'main.js');
const VENDOR_FILE = path.join(DIST_DIR, 'vendor.js');

const OBFUSCATE_OPTIONS = {
  target: 'browser',
  preset: false,
  pack: false,
  identifierGenerator: 'zeroWidth',
  renameVariables: true,
  renameGlobals: false,
  renameLabels: true,
  movedDeclarations: true,
  stringCompression: true,
  stringConcealing: false,
  stringSplitting: false,
  calculator: true,
  objectExtraction: true,
  globalConcealing: false,
  shuffle: true,
  duplicateLiteralsRemoval: true,
  controlFlowFlattening: false,
  dispatcher: false,
  opaquePredicates: false,
  deadCode: false,
  astScrambler: true,
  variableMasking: true,
  flatten: true,
  rgf: false,
  hexadecimalNumbers: false,
  compact: true,
  minify: true,
  preserveFunctionLength: true,
  lock: {
    selfDefending: true,
    integrity: true,
  },
};

const clearDist = async () => {
  await fs.promises.rm('dist', { recursive: true, force: true }).catch(() => {});
};

const copyDirectory = async (source, target) => {
  await fs.promises.mkdir(target, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(target, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
        return;
      }
      await fs.promises.copyFile(srcPath, destPath);
    })
  );
};

const writeManifestVersion = async () => {
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const manifest = await fs.promises.readFile(manifestPath, 'utf-8');
  const updated = manifest.replace(MANIFEST_PLACEHOLDER, VERSION);
  await fs.promises.writeFile(manifestPath, updated);
};

const copyStaticFiles = async () => {
  await copyDirectory(SOURCE_EXTENSION_DIR, DIST_DIR);
  await writeManifestVersion();
};

const createArchive = (filename = DEFAULT_ARCHIVE_NAME) => {
  const zipPath = path.join('dist', filename);
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(DIST_DIR, false);
    archive.finalize();
  });
};

const getRollupConfig = (dev) => {
  const configFactory = rollupConfig.default || rollupConfig;
  return configFactory({ dev });
};

const buildWithRollup = async (dev) => {
  console.log('Building with Rollup...');
  const config = getRollupConfig(dev);
  const { input, plugins, output, ...rest } = config;
  const bundle = await rollup.rollup({ input, plugins, ...rest });
  await bundle.write({ ...output });
  await bundle.close();
  console.log('Rollup build completed');
};

const obfuscateMain = async (dev) => {
  if (dev) return;
  if (!fs.existsSync(MAIN_FILE)) throw new Error('Main chunk not found for obfuscation');
  console.log('Obfuscating main.js...');
  const code = await fs.promises.readFile(MAIN_FILE, 'utf-8');
  const { code: obfuscated } = await obfuscate(code, OBFUSCATE_OPTIONS);
  await fs.promises.writeFile(MAIN_FILE, obfuscated);
  console.log('Obfuscation completed');
};

const combineChunks = async () => {
  if (!fs.existsSync(MAIN_FILE)) throw new Error('Main chunk missing for combination');

  const bundle = await rollup.rollup({
    input: MAIN_FILE,
    treeshake: false,
  });

  const { output } = await bundle.generate({
    format: 'es',
    exports: 'auto',
    compact: false,
    minifyInternalExports: true,
    inlineDynamicImports: true,
    freeze: false,
    sourcemap: false,
    interop: 'auto',
    hoistTransitiveImports: false,
  });

  await bundle.close();

  const generated = output[0].code;

  const stubTemplate = await fs.promises.readFile(path.join('stub.js'), 'utf-8');
  const finalCode = `/*\n© 2025 Surplus Softworks\n*/\n\n` + stubTemplate.split('__SURPLUS__')[0] + JSON.stringify(generated) + stubTemplate.split('__SURPLUS__')[1];

  await fs.promises.writeFile(MAIN_FILE, finalCode);
  if (fs.existsSync(VENDOR_FILE)) await fs.promises.unlink(VENDOR_FILE);

  const userscript = `// ==UserScript==
// @name         Surplus
// @version      ${VERSION}
// @description  A cheat for survev.io & more
// @author       mahdi, noam
// @match        *://*/*
// @run-at       document-start
// @icon         https://i.postimg.cc/W4g7cxLP/image.png
// @grant        none
// ==/UserScript==

${finalCode}`;
  await fs.promises.writeFile(path.join('dist', 'Surplus.user.js'), userscript);
};

const runBuild = async (argv) => {
  const devMode = argv.some((arg) => arg.toLowerCase() === 'dev');
  await clearDist();
  await copyStaticFiles();
  await buildWithRollup(devMode);
  await obfuscateMain(devMode);
  await combineChunks();
  await createArchive();
  console.log('Build completed successfully');
};

runBuild(process.argv.slice(2)).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
