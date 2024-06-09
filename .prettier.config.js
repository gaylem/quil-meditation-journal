module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  overrides: [
    {
      files: ['.eslintrc', '.eslintignore'],
      options: {
        parser: 'json',
      },
    },
  ],
};
