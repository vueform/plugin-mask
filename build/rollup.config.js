import license from 'rollup-plugin-license'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    terser(),
    license({
      banner: {
        content: `Vueform Mask Plugin v<%= pkg.version %> (https://github.com/vueform/plugin-mask)\n` + 
                  `Copyright (c) <%= moment().format('YYYY') %>-present Adam Berecz <adam@vueform.com>\n` + 
                  `Licensed under the MIT License`,
        commentStyle: 'ignored',
      }
    })
  ]
}