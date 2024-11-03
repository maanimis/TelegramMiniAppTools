const globals = require("globals");

module.exports = [
  { languageOptions: { globals: globals.browser } },
  {
    languageOptions: {
      globals: {
        chrome: "readonly",
      },
    },
  },
];
