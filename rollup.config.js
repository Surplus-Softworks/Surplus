import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { string } from 'rollup-plugin-string';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (commandLineArgs) => {
  const isDev = commandLineArgs.dev === true;
  const EPOCH = Date.now() + 1000 * 60 * 60;
  const VERSION = '1.4.6';

  return {
    input: './src/index.js',
    output: {
      dir: './dist/extension',
      format: 'es',
      entryFileNames: 'main.js',
      chunkFileNames: 'vendor.js',
      assetFileNames: '[name][extname]',
      manualChunks(id) {
        if (id.includes('node_modules')) return 'vendor';
        return null;
      },
    },
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
    },
    preserveEntrySignatures: false,
    context: 'globalThis',
    plugins: [
      alias({
        entries: [
          { find: '@', replacement: path.resolve(__dirname, 'src') },
        ],
      }),
      string({
        include: '**/*.html',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        EPOCH: EPOCH.toString(),
        VERSION: JSON.stringify(VERSION),
        DEV: isDev.toString(),
        preventAssignment: true,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
        extensions: ['.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
      resolve({
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
  };
};
