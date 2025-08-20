import js from '@eslint/js'                                   // ESLint's recommended JS rules
import globals from 'globals'                                 // Predefined globals like `window`, `document`
import reactHooks from 'eslint-plugin-react-hooks'            // React hooks linting rules
import reactRefresh from 'eslint-plugin-react-refresh'        // Vite + React Fast Refresh linting
import tseslint from 'typescript-eslint'                      // TypeScript linting rules for ESLint
import prettierPlugin from 'eslint-plugin-prettier'           // Prettier plugin for ESLint
import prettierConfig from 'eslint-config-prettier'           // Disables conflicting ESLint rules with Prettier
import { globalIgnores } from 'eslint/config'                 // Helper to ignore files/folders globally

export default tseslint.config([
  globalIgnores(['dist']),                                    // Ignore the `dist/` folder (build output)
  {
    files: ['**/*.{ts,tsx}'],                                 // Apply this config only to TypeScript files
    extends: [
      js.configs.recommended,                                 // Recommended JS rules
      tseslint.configs.recommended,                           // Recommended TypeScript rules
      reactHooks.configs['recommended-latest'],               // Recommended React Hooks rules
      reactRefresh.configs.vite,                              // ESLint rules for Vite + React Fast Refresh
      prettierConfig                                          // Disable ESLint rules that conflict with Prettier formatting
    ],
    plugins: {
      prettier: prettierPlugin,                               // Enables Prettier plugin to report formatting as ESLint errors
    },
    rules: {
      'prettier/prettier': 'error',                           // Treat Prettier formatting issues as ESLint errors
    },
    languageOptions: {
      ecmaVersion: 2020,                                      // Support modern JS syntax up to ES2020
      globals: globals.browser,                               // Recognize browser globals like `window` and `document`
    },
  },
])