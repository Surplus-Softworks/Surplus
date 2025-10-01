import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { string } from 'rollup-plugin-string';
import { minify } from 'terser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (commandLineArgs) => {
  const isDev = commandLineArgs.dev === true;
  const isProd = !isDev;
  const EPOCH = Date.now() + (1000 * 60 * 60);
  const VERSION = "1.4.6";

  const terserPlugin = () => ({
    name: 'surplus-terser',
    async renderChunk(code) {
      const result = await minify(code, {
        compress: {
          ecma: 2020,
          passes: 3,
          drop_console: true,
          drop_debugger: true,
          keep_fargs: false,
          module: true,
          pure_getters: true,
          toplevel: true,
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
        toplevel: true,
      });

      return { code: result.code ?? code, map: null };
    },
  });

  return {
    input: './src/index.js',
    output: {
      file: './dist/extension/main.js',
      format: 'iife',
      name: 'SurplusBundle',
      compact: true,
      inlineDynamicImports: true,
      preferConst: true,
      freeze: false,
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
          { find: '@', replacement: path.resolve(__dirname, 'src') }
        ]
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
      terserPlugin(),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
  };
};
