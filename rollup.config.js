import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import packageJson from './package.json'

const extensions = ['.js', '.ts']
const external = Object.keys(packageJson.dependencies)

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/redux-action-cache.js',
    format: 'cjs',
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
  },
  external,
  plugins: [
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      extensions,
      runtimeHelpers: true,
    }),
    resolve({
      extensions,
    }),
    commonjs({
      extensions,
    }),
    terser(),
  ],
}
