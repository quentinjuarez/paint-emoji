import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import AutoImport from 'unplugin-auto-import/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

// https://vitejs.dev/config/
export default () => {
  const isDev = process.env.NODE_ENV !== 'production'
  const baseUrl = isDev ? '/' : '/shape-to-emoji'

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
      __TILE_SIZE__: 16,
      __TILES_PER_ROW__: 32
    },
    build: {
      outDir: 'docs'
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
