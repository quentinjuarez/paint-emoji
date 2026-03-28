import { defineConfig } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default () => {
  const apiUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4001'
      : 'https://quentinjuarez-server.up.railway.app'

  return defineConfig({
    server: {
      port: 5557
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@ui': resolve(__dirname, '../../packages/ui/src'),
        '@shared': resolve(__dirname, '../../packages/shared/src')
      }
    },
    define: {
      __VERSION__: `'1.0.0'`,
      __API_URL__: `'${apiUrl}'`
    },
    build: {
      outDir: 'dist'
    },
    plugins: [
      AutoImport({
        imports: ['pinia', 'vue', 'vue-router', '@vueuse/core'],
        dirs: [
          resolve(__dirname, '../../packages/shared/src/stores'),
          resolve(__dirname, '../../packages/shared/src/utils')
        ],
        dts: './src/types/auto-imports.d.ts',
        vueTemplate: true
      }),
      Components({
        dirs: [
          'src/components',
          resolve(__dirname, '../../packages/ui/src/components'),
          resolve(__dirname, '../../packages/ui/src/layout'),
          resolve(__dirname, '../../packages/shared/src/components')
        ],
        extensions: ['vue'],
        dts: './src/types/components.d.ts'
      }),
      tailwindcss(),
      vue()
    ]
  })
}
