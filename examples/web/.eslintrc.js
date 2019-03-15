module.exports = {
  "extends": ["standard", "plugin:react/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "env": {},
    "rules": {
      "comma-dangle": ["error", "always-multiline"],
      "@typescript-eslint/type-annotation-spacing": ["error", { "before": false, "after": true, overrides: { arrow: { before: true, after: true }} }],
      "@typescript-eslint/ban-types": "error",
      "@typescript-eslint/prefer-interface": "error"
    },
};