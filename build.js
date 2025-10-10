import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { obfuscate } from 'js-confuser';
import * as rollup from 'rollup';
import rollupConfig from './rollup.config.js';
import { minify } from 'fiber';

const packageJson = JSON.parse(await fs.promises.readFile('./package.json', 'utf-8'));
const VERSION = packageJson.version;
const DIST_DIR = path.join('dist', 'extension');
const SOURCE_EXTENSION_DIR = path.join('src', 'extension');
const DEFAULT_ARCHIVE_NAME = 'Surplus (DO NOT EXTRACT).zip';
const MANIFEST_PLACEHOLDER = '%VERSION%';
const MAIN_FILE = path.join(DIST_DIR, 'main.js');

const MODES = {
  DEV: 'dev',
  BUILD: 'build',
  RELEASE: 'release',
};

const STUB_OBFUSCATE_OPTIONS = {
  target: 'browser',
  calculator: true,
  compact: true,
  hexadecimalNumbers: true,
  deadCode: true,
  dispatcher: true,
  duplicateLiteralsRemoval: true,
  flatten: true,
  globalConcealing: true,
  identifierGenerator: 'zeroWidth',
  minify: true,
  movedDeclarations: true,
  objectExtraction: true,
  renameVariables: true,
  renameGlobals: true,
  shuffle: true,
  stringConcealing: true,
  stringCompression: true,
  stringEncoding: true,
  stringSplitting: true,
  astScrambler: true,
  pack: true,
  renameLabels: true,
  preserveFunctionLength: true,
  lock: {
    tamperProtection: true,
    selfDefending: true,
    integrity: true,
  },
  variableMasking: true,

  preset: false,
};

const clearDist = async () => {
  await fs.promises.rm('dist', { recursive: true, force: true }).catch(() => { });
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

const getRollupConfig = (mode) => {
  const configFactory = rollupConfig.default || rollupConfig;
  return configFactory({ mode });
};

const buildWithRollup = async (mode) => {
  console.log(`Building with Rollup (${mode})...`);
  const config = getRollupConfig(mode);
  const { input, plugins, output, ...rest } = config;
  const bundle = await rollup.rollup({ input, plugins, ...rest });
  await bundle.write({ ...output });
  await bundle.close();
  console.log('Rollup build completed');
};

const combineChunks = async (mode) => {
  if (!fs.existsSync(MAIN_FILE)) throw new Error('Main chunk missing for combination');

  const { input, plugins, output2, ...rest } = getRollupConfig(mode);

  const bundle = await rollup.rollup({
    input: MAIN_FILE,
    plugins,
    ...rest,
  });

  const { output } = await bundle.generate({
    format: 'esm',
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

  let generated = output[0].code;

  // Create min.test.js with minimal beautification (only newlines)
  const { code: beautifiedCode } = await minify(generated, {
    compress: false,
    mangle: false,
    format: {
      beautify: true,
      indent_level: 0,
      max_line_len: false,
    }
  });
  await fs.promises.writeFile(path.join('dist', 'min.test.js'), beautifiedCode);
  console.log('Created min.test.js with minimal beautification');

  const stubTemplate = await fs.promises.readFile(path.join('stub.js'), 'utf-8');
  const stubSegments = stubTemplate.split('__SURPLUS__');
  if (stubSegments.length !== 2)
    throw new Error('Stub template is missing the __SURPLUS__ placeholder');

  let stubCode = `${stubSegments[0]}${JSON.stringify(generated)}${stubSegments[1]}`;

  if (mode === MODES.RELEASE) {
    console.log('Obfuscating stub template (includes main bundle string)...');
    const { code: obfuscatedStub } = await obfuscate(stubCode, STUB_OBFUSCATE_OPTIONS);
    stubCode = obfuscatedStub;
  }

  const finalCode = `/*
© 2025 Surplus Softworks
*/

!function() {

const whitelist = [
  'surviv',
  'survev',
  'resurviv',
  'expandedwater',
  '66.179.254.36',
  'eu-comp',
  '50v50',
  '127'
];

if (!whitelist.some(domain => globalThis.location.hostname.includes(domain))) {
  return;
}

${stubCode}

}()`;

  await fs.promises.writeFile(MAIN_FILE, finalCode);

  const userscriptMetadata = `// ==UserScript==
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
  await fs.promises.writeFile(path.join('dist', 'Surplus.user.js'), userscriptMetadata);
};

const runBuild = async (argv) => {
  const modeArg = argv
    .map((arg) => arg.toLowerCase())
    .find((arg) => Object.values(MODES).includes(arg));
  const mode = modeArg || MODES.BUILD;
  console.log(`Running Surplus build in "${mode}" mode`);
  await clearDist();
  await copyStaticFiles();
  await buildWithRollup(mode);
  await combineChunks(mode);
  await createArchive();
  console.log('Build completed successfully');
};

runBuild(process.argv.slice(2)).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
