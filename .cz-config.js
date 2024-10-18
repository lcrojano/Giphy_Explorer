module.exports = {
  types: [
    { value: 'feat', name: '✨ feat:     A new feature' },
    { value: 'fix', name: '🐛 fix:      A bug fix' },
    { value: 'docs', name: '📝 docs:     Documentation only changes' },
    {
      value: 'style',
      name: '💄 style:    Code style changes (white-space, formatting)',
    },
    {
      value: 'refactor',
      name: '♻️  refactor: A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'perf',
      name: '⚡ perf:     A code change that improves performance',
    },
    { value: 'test', name: '✅ test:     Adding tests' },
  ],
  scopes: [],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  messages: {
    type: "Select the type of change you're committing:",
    scope: 'Denote the scope of this change (optional):',
    subject: 'Write a short, descriptive subject (with emoji if needed):\n',
    body: 'Provide a longer description of the change (optional):\n',
    footer: 'List any breaking changes or issues closed (optional):\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
};
