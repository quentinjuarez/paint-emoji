import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import AutoImport from 'unplugin-auto-import/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

// https://vitejs.dev/config/
export default ({ command }) => {
  const isDev = command === 'serve'
  const baseUrl = '/' //isDev ? '/' : '/shape-to-emoji'
  const apiUrl = isDev ? 'http://localhost:4001' : 'https://srv592035.hstgr.cloud/server' // 'http://88.223.92.39/server' //'https://quentinjuarez.alwaysdata.net'

  return defineConfig({
    server: {
      port: 5175
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
          { 'vue-i18n': ['useI18n'] },
          { 'vue-router': ['useRouter', 'useRoute'] }
        ],
        dirs: ['./src/stores', './src/utils', './src/composables'],
        dts: './src/types/auto-imports.d.ts',
        vueTemplate: true
      }),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
        runtimeOnly: false
      }),
      Components({
        dirs: ['src/components'],
        extensions: ['vue'],
        dts: './src/types/components.d.ts'
      }),
      vue()
    ]
  })
}
