import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

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
  plugins: [
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
    }),
    uglify(),
  ],
}
