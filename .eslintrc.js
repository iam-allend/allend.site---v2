module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn', // Allow any but show warning
    '@typescript-eslint/no-unused-vars': 'warn', // Allow unused vars but show warning
    
    // React rules
    'react/no-unescaped-entities': 'off', // Allow unescaped quotes and apostrophes
    'react-hooks/exhaustive-deps': 'warn', // Allow missing deps but show warning
    
    // Next.js rules
    '@next/next/no-html-link-for-pages': 'warn', // Allow <a> tags but show warning
  },
};