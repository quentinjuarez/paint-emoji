import { defineConfig } from 'vite'
import { resolve } from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default ({ command }) => {
  const isDev = command === 'serve'
  const baseUrl = '/' //isDev ? '/' : '/shape-to-emoji'
  const apiUrl = isDev ? 'http://localhost:4001' : 'https://quentinjuarez-server.up.railway.app'

  return defineConfig({
    server: {
      port: 5555
    },
    base: baseUrl,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      __BASE_URL__: `'${baseUrl}'`,
      __DEV__: isDev,
      __VERSION__: `'${version}'`,
      __API_URL__: `'${apiUrl}'`
    },
    build: {
      outDir: 'dist'
    },
    plugins: [
      AutoImport({
        imports: [
          { pinia: ['storeToRefs'] },
          'vue',
          { 'vue-router': ['useRouter', 'useRoute'] }
        ],
        dirs: ['./src/stores', './src/utils', './src/composables'],
        dts: './src/types/auto-imports.d.ts',
        vueTemplate: true
      }),
      Components({
        dirs: ['src/components'],
        extensions: ['vue'],
        dts: './src/types/components.d.ts'
      }),
      tailwindcss(),
      vue()
    ]
  })
}
