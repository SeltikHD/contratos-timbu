module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    rules: {
        // Prettier rules
        'prettier/prettier': 'error',

        // Base ESLint rules
        'no-console': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-template': 'error',
        eqeqeq: ['error', 'always'],
        'no-duplicate-imports': 'error',

        // React Native specific rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    env: {
        node: true,
        'react-native/react-native': true,
    },
    ignorePatterns: [
        'node_modules/',
        '.expo/',
        'build/',
        'dist/',
        '*.min.js',
        '*.min.css',
        'coverage/',
        '.cache/',
        'android/',
        'ios/',
    ],
};
