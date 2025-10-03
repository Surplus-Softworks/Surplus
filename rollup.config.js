import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const VERSION = packageJson.version;

const TERSER_OPTIONS = {
  parse: {
    bare_returns: true,
    shebang: true,
    html5_comments: false,
    spidermonkey: false,
  },
  compress: {
    defaults: true,
    arrows: true,
    arguments: true,
    booleans: true,
    booleans_as_integers: true,
    collapse_vars: true,
    comparisons: true,
    computed_props: true,
    conditionals: true,
    dead_code: true,
    directives: true,
    drop_console: true,
    drop_debugger: true,
    ecma: 2020,
    evaluate: true,
    expression: false,
    global_defs: {},
    hoist_funs: true,
    hoist_props: true,
    hoist_vars: true,
    if_return: true,
    inline: true,
    join_vars: true,
    keep_classnames: false,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: false,
    lhs_constants: true,
    loops: true,
    module: true,
    negate_iife: true,
    passes: 999,
    pure_funcs: ["console.log", "console.info", "console.debug"],
    pure_getters: true,
    pure_new: true,
    reduce_vars: true,
    reduce_funcs: true,
    sequences: true,
    side_effects: true,
    switches: true,
    toplevel: true,
    typeofs: true,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_math: true,
    unsafe_symbols: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
    unused: true,
  },
  mangle: {
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    toplevel: true,
    safari10: false,
    properties: {
      regex: /_$/,
    },
  },
  format: {
    ascii_only: true,
    braces: false,
    comments: false,
    ecma: 2020,
    ie8: false,
    keep_numbers: false,
    indent_level: 0,
    indent_start: 0,
    inline_script: true,
    keep_quoted_props: false,
    max_line_len: false,
    preamble: null,
    preserve_annotations: false,
    quote_keys: false,
    quote_style: 0,
    safari10: false,
    semicolons: true,
    shorthand: false,
    shebang: false,
    webkit: false,
    wrap_iife: true,
    wrap_func_args: true,
  },
};

export default (commandLineArgs) => {
  const isDev = commandLineArgs.dev === true;
  const EPOCH = Date.now() + 1000 * 60 * 60;

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
        presets: [
          ["@babel/preset-react", { "runtime": "automatic" }]
        ],
        extensions: ['.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
      resolve({
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
      terser(TERSER_OPTIONS)
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
  };
};
