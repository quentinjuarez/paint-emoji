import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
// import tailwind from 'eslint-plugin-tailwindcss'
// import { dirname, join } from 'node:path'
// import { fileURLToPath } from 'node:url'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-ignore',
    ignores: [
      'dist/**',
      'docs/**',
      '.husky/**',
      'public/vendor/**',
      'src/types/components.d.ts',
      'src/types/auto-imports.d.ts',
      'tmp/**'
    ]
  },
  pluginVue.configs['flat/essential'],
  // tailwind.configs['flat/recommended'],
  // {
  //   settings: {
  //     tailwindcss: {
  //       // cssConfigPath: dirname(fileURLToPath(import.meta.url)) + '/style.css'
  //       config: dirname(fileURLToPath(import.meta.url)) + './tailwind.config.js'
  //     }
  //   }
  // },
  vueTsConfigs.recommended,
  skipFormatting,
  {
    name: 'app/vue-overrides',
    files: ['**/*.vue'],
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    name: 'app/ts-rules',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-expect-error': false, 'ts-ignore': false }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
)
