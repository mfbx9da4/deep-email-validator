import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs['strict-type-checked']?.rules,
      semi: 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': ['warn', { ignoreParameters: true }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'test/**'],
  },
]
