module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: '*.sol',
      options: {
        printWidth: 100,
        tabWidth: 4,
        useTabs: false,
        singleQuote: true,
        bracketSpacing: false,
        explicitTypes: 'always',
      },
    },
  ],
};
