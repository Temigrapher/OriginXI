import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

// `next build` does not catch a missing import or an undeclared variable (they only crash in the browser), so this
// runs before every build (see the "prebuild" script). Only real bugs are errors; style-level findings are warnings.
// ESLint 10 understands JSX itself, so the built-in no-undef catches a <Component /> that was never imported and
// no-unused-vars counts JSX usage; no React plugin is needed for either.
export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    },
  },
];
