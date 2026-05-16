// eslint.config.mjs
import { defineConfig, globalIgnores } from '@eslint/config-helpers'
import stylexPlugin from '@stylexjs/eslint-plugin'
import prettier from 'eslint-config-prettier/flat'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

const jsFiles = ['**/*.{js,mjs,cjs,jsx}']

export default defineConfig([
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

  {
    files: jsFiles,
    plugins: {
      '@stylexjs': stylexPlugin,
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'error',
      '@stylexjs/no-legacy-contextual-styles': 'error',
      '@stylexjs/sort-keys': ['error', { order: 'recess' }],
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

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
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
    'next.config.js',
    'next.config.mjs',
    'postcss.config.js',
    'next-env.d.ts',
  ]),
])
