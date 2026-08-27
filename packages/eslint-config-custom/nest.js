// NestJS 后端专用 ESLint
module.exports = {
  extends: ['./index.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
