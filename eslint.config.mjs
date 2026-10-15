import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

// `next build` does not catch a missing import or an undeclared variable (they only crash in the browser), so this
// runs before every build (see the "prebuild" script). Only real bugs are errors; style-level findings are warnings.
export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/jsx-no-undef': 'error',        // <Component /> that was never imported
      'react/jsx-uses-vars': 'error',       // JSX usage counts as "used", so the unused-variable warning stays accurate
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    },
  },
];
