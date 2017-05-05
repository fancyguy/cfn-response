import CommonJS from 'rollup-plugin-commonjs';
import NodeResolve from 'rollup-plugin-node-resolve';
import TypeScript from 'rollup-plugin-typescript';
import Uglify from 'rollup-plugin-uglify';
import { minify as uglifier } from 'uglify-js-harmony';

const libraryName = 'CFNResponse';
const librarySlug = 'cfn-response';

export default function rollupConfig(format, minify) {
  let outputFile;
  let formatSuffix;

  if ('cjs' === format) {
    formatSuffix = '';
  } else {
    formatSuffix = '.' + format.toLowerCase();
  }

  const plugins = [
    NodeResolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: true,
    }),
    CommonJS(),
    TypeScript({
      typescript: require('typescript')
    }),
  ];

  if (minify) {
    plugins.push(Uglify({
      minimize: true,
      compress: {
        warnings: false
      },
      output: {
        comments: (node, comment) => {
          let text = comment.value;
          let type = comment.type;
          if ('comment2' === type) {
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      },
      mangle: true
    }, uglifier));
    outputFile = librarySlug.toLowerCase() + formatSuffix + '.min.js'
  } else {
    outputFile = librarySlug.toLowerCase() + formatSuffix + '.js'
  }

  const config = {
    moduleName: libraryName,
    entry: 'src/index.ts',
    sourceMap: false,
    plugins: plugins,
    external: [
      'https',
      'net',
      'url',

      'aws-sdk',
    ],
    globals: {
    },
    targets: [
      { dest: 'dist/' + outputFile, format: format }
    ]
  }

  return config;
}
