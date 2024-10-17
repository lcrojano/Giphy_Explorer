import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // Define which files ESLint should target
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },

  // Define global variables for browser environments
  { languageOptions: { globals: globals.browser } },

  // Apply ESLint's recommended configuration for JavaScript
  pluginJs.configs.recommended,

  // Add ignores for files or directories that shouldn't be linted
  { ignores: ["node_modules", "dist"] } // Ignore node_modules and build/dist folder
];
