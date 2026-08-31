import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  // Flat config does not read .gitignore. The submodules carry their own lint config and are
  // upgraded separately, and .claude/worktrees/ holds full copies of the tree.
  { ignores: ['resume/**', 'captcha/**', '.claude/**'] },
  ...nextCoreWebVitals,
  { rules: { semi: ['error', 'always'] } },
];

export default config;
