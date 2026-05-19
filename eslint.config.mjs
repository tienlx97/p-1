// eslint.config.mjs
import { defineConfig, globalIgnores } from '@eslint/config-helpers'
import prettier from 'eslint-config-prettier/flat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import tailwindcss from 'eslint-plugin-tailwindcss'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const jsFiles = ['**/*.{js,mjs,cjs,jsx}']
const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const tailwindEntryCss = path.join(projectRoot, 'src/app/globals.css')

export default defineConfig([
  ...nextVitals,

  {
    settings: {
      tailwindcss: {
        callees: ['cx'],
        config: tailwindEntryCss,
      },
    },
  },

  ...tailwindcss.configs['flat/recommended'],

  {
    files: jsFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  unicorn.configs['flat/recommended'],

  {
    files: jsFiles,
    rules: {
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react-hooks/set-state-in-effect': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',

      // The app intentionally mixes Tailwind utility strings with CSS Modules.
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  {
    files: ['**/*.jsx'],
    rules: {
      'no-console': 'warn',
    },
  },

  prettier,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'public/**',
    'babel.config.js',
    'next.config.js',
    'next.config.mjs',
    'postcss.config.js',
    'next-env.d.ts',
  ]),
])
