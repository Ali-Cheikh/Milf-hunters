import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-unused-vars": "off", // Turn off base rule as it conflicts with TypeScript version
      "@typescript-eslint/no-unused-vars": "warn",
    },
    languageOptions: {
      globals: globals.node, // Changed to node since this is a server app
    },
  }
);
