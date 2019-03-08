module.exports = {
  "extends": "standard",
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "env": {
      "jest": true
    },
    "rules": {
      "comma-dangle": ["error", "always-multiline"]
    },
};