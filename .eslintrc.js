module.exports = {
    "root": true,
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "extends": ["eslint:recommended", "prettier"],
    "env": {
        "es2021": true,
        "node": true
    },
    "rules": {
        "no-console": "off",
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        // "skipBlankLines": true
    },
    "env": {
        "jest/globals": true
    }
}