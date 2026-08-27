// React + Vite 前端专用 ESLint
module.exports = {
  extends: ['./index.js', 'plugin:react-hooks/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    // 交给 TS 处理
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
