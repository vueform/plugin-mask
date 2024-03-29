import license from 'rollup-plugin-license'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'dist',
      format: 'esm'
    },
    external: ['imask'],
    plugins: [
      terser(),
      license({
        banner: {
          content: `Vueform Mask Plugin v<%= pkg.version %> (https://github.com/vueform/plugin-mask)\n` + 
                    `Copyright (c) 2024-present Adam Berecz <adam@vueform.com>\n` + 
                    `Licensed under the MIT License`,
          commentStyle: 'ignored',
        }
      })
    ]
  },
  {
    input: 'src/plugin.js',
    output: {
      dir: 'dist',
      format: 'esm'
    },
    external: ['imask'],
    plugins: [
      terser(),
      license({
        banner: {
          content: `Vueform Mask Plugin v<%= pkg.version %> (https://github.com/vueform/plugin-mask)\n` + 
                    `Copyright (c) 2024-present Adam Berecz <adam@vueform.com>\n` + 
                    `Licensed under the MIT License`,
          commentStyle: 'ignored',
        }
      })
    ]
  },
]