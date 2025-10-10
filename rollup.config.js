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
import CleanCSS from 'clean-css';

function cssPlugin({ minify }) {
  const cleanCSS = minify ? new CleanCSS({ level: 2 }) : null;

  return {
    name: 'css-string',
    transform(code, id) {
      if (id.endsWith('.css')) {
        let css = fs.readFileSync(id, 'utf-8');
        if (cleanCSS) {
          const { styles } = cleanCSS.minify(css);
          css = styles;
        }
        return {
          code: `export const globalStylesheet = ${JSON.stringify(css)};`,
          map: null,
        };
      }
    },
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const VERSION = packageJson.version;

const toMangle = [
  'getDerivedStateFromProps',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'getSnapshotBeforeUpdate',
  'getChildContext',
  'componentWillUnmount',
  'defaultProps',
  'vnode',
  'context',
  'props',
  'componentDidUpdate',
  'state',
  'context',
  'setState',
  'componentDidCatch',
  'getDerivedStateFromError',
  'forceUpdate',
  'revealOrder',
  'isReactComponent',
  'isPropagationStopped',
  'isDefaultPrevented',
  'persist',
  'nativeEvent',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'debounceRendering',
  'isPureReactComponent',

  'diffed',
  'onSettingChange',
  'settings',
  'onClose',
];

const toNotMangle = ['id', 'type'];

const exactMatchPattern = toMangle.length > 0 ? `^(${toMangle.join('|')})$|` : '';
const exactlyNotMatchPattern =
  toNotMangle.length > 0 ? `(?!${toNotMangle.map((v) => v + '$').join('|')})` : '';
const mangleRegex = new RegExp(`${exactMatchPattern}(?:^__${exactlyNotMatchPattern}.*$|_$)`);

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
    arguments: false,
    booleans: true,
    booleans_as_integers: false,
    collapse_vars: true,
    comparisons: true,
    computed_props: true,
    conditionals: true,
    dead_code: true,
    directives: true,
    drop_console: false,
    drop_debugger: false,
    ecma: 2025,
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
    evaluate: true,
    lhs_constants: true,
    loops: true,
    module: true,
    negate_iife: true,
    passes: 50,
    //pure_funcs: ["console.log", "console.info", "console.debug"],
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
    unsafe_extract_members: true,
    unsafe_merge_primitives: true,
    unsafe_all_let: true,
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
      regex: mangleRegex,
    },
    //nth_identifier: undefined
  },
  format: {
    ascii_only: false,
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

const MODES = {
  DEV: 'dev',
  BUILD: 'build',
  RELEASE: 'release',
};

export default (commandLineArgs = {}) => {
  const rawMode = (commandLineArgs.mode || (commandLineArgs.dev ? 'dev' : 'build'))
    .toString()
    .toLowerCase();
  const mode = Object.values(MODES).includes(rawMode) ? rawMode : MODES.BUILD;
  const isDev = mode === MODES.DEV;
  const shouldMinify = mode !== MODES.DEV;
  const EPOCH = Date.now() + 1000 * 60 * 60;

  return {
    input: './src/index.js',
    output: {
      dir: './dist/extension',
      format: 'es',
      entryFileNames: 'main.js',
      assetFileNames: '[name][extname]',
      // removed chunkFileNames / manualChunks so everything is emitted into main.js
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
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom', replacement: 'preact/compat' },
          { find: 'react-dom/client', replacement: 'preact/compat' },
        ],
      }),
      cssPlugin({ minify: shouldMinify }),
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
        presets: [['@babel/preset-react', { runtime: 'automatic', importSource: 'preact' }]],
        extensions: ['.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
      resolve({
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
      shouldMinify && terser(TERSER_OPTIONS),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
  };
};
