module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: [
    'environments/environment.ts',
    '.eslintrc.js',
    '*.config.*',
    '*.config.ts',
    'e2e/*',
  ],
  extends: ['plugin:@taiga-ui/experience/all'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enumMember',
            format: null,
          },
        ],
      },
    },
  ],
  rules: {
    'sonarjs/prefer-enum-initializers': 'off',
    'no-restricted-syntax': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    'import/first': 'off',
  },
};
