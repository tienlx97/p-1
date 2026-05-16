import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

const jsFiles = ['**/*.{js,mjs,cjs,jsx}']
const nextConfig = nextVitals
  .filter(({ name }) => name !== 'next/typescript')
  .map((config) => {
    if (config.name !== 'next') {
      return config
    }

    return {
      ...config,
      files: jsFiles,
      settings: {
        react: {
          ...config.settings?.react,
          version: '19.2.4',
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.mjs', '.cjs'],
          },
        },
      },
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
    }
  })

export default defineConfig([
  {
    files: jsFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...nextConfig,
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
