import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        alert: "readonly",
        atob: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        customElements: "readonly",
        document: "readonly",
        fetch: "readonly",
        history: "readonly",
        HTMLElement: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        window: "readonly",
        CustomEvent: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
