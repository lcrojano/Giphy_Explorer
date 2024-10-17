module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'header-max-length': [2, 'always', 72],
      'type-enum': [
        2,
        'always',
        [
          ':sparkles:',  // feature
          ':bug:',       // bug fix
          ':memo:',      // documentation
          ':fire:',      // remove code
          ':art:',       // structure
          ':zap:',       // performance
          ':lock:',      // security
          ':package:',   // dependencies
          // Add more Gitmoji codes here
        ]
      ],
      'subject-case': [0],  // allow any case for the subject
      'subject-empty': [2, 'never'],  // disallow empty subjects
      'header-case': [0, 'never'],  // allow emojis in the header
    }
  };
  