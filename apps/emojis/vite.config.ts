import { defineConfig } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 5556
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, '../../packages/ui/src'),
      '@shared': resolve(__dirname, '../../packages/shared/src')
    }
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
      dts: '../../packages/shared/src/types/auto-imports.d.ts',
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
      dts: '../../packages/shared/src/types/components.d.ts'
    }),
    tailwindcss(),
    vue()
  ]
})
