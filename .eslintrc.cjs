/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: ['docs/*', '.husky/*', '.gitignore'],
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:tailwindcss/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      // To use global type inside vue files. Typescript already do the job for 'no-undef'
      // https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      files: ['*.vue'],
      rules: {
        'no-undef': 'off',
        'vue/multi-word-component-names': 'off'
      },
      parser: 'vue-eslint-parser'
    }
  ],
  rules: {
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: ['draggable']
      }
    ]
  },
  env: {
    node: true
  },
  globals: {
    window: true,
    module: true
  }
}
