const PATH_GROUPS = [
  '@common/**',
  '@features/**',
  '@pages',
  '@pages/**',
  '@processes/**',
];

const ALLOWED_PATH_GROUPS = PATH_GROUPS.map((pattern) => ({
  pattern,
  group: 'internal',
  position: 'after',
}));

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    '@typescript-eslint/indent': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error'],
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-cycle': 'warn',
    'import/order': [
      'warn',
      {
        pathGroups: ALLOWED_PATH_GROUPS,
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    camelcase: [
      'error',
      {
        ignoreDestructuring: true,
        ignoreImports: true,
      },
    ],
    'max-len': [
      'error',
      {
        code: 100,
        ignorePattern: '^(.*SagaReturnType.*|.*ReturnType.*)$',
        ignoreComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTrailingComments: true,
      },
    ],
    'no-alert': 'error',
    'no-debugger': 'warn',
    'no-extend-native': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-dupe-class-members': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'max-lines-per-function': [
      'error',
      {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-nested-callbacks': ['error', 2],
    'max-params': ['error', 5],
    'consistent-return': 'error',
    curly: ['error', 'all'],
    'default-case': ['error'],
    'default-param-last': ['error'],
    'dot-notation': 'error',
    eqeqeq: 'error',
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'max-classes-per-file': ['error', 2],
    'no-constructor-return': 'error',
    'no-empty-function': [
      'error',
      {
        allow: ['generatorFunctions', 'constructors'],
      },
    ],
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-multi-spaces': 'error',
    'no-param-reassign': 'error',
    'no-return-assign': 'error',
    'no-self-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme'],
      },
    ],
    'prefer-promise-reject-errors': 'warn',
    radix: 'error',
    'require-await': 'error',
    'vars-on-top': 'error',
    yoda: 'error',
    'init-declarations': ['error', 'always'],
    'no-undef-init': 'error',
    'no-use-before-define': 'off',
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
    'capitalized-comments': ['error'],
    'eol-last': ['error', 'always'],
    'id-length': [
      'error',
      {
        min: 2,
        exceptions: ['_'],
      },
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      },
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'lines-between-class-members': ['error', 'always'],
    'max-depth': ['error', 2],
    'multiline-comment-style': 'off',
    'newline-per-chained-call': [
      'error',
      {
        ignoreChainWithDepth: 4,
      },
    ],
    'no-array-constructor': 'error',
    'no-bitwise': ['error'],
    'no-inline-comments': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ],
    'no-nested-ternary': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
        allowAfterSuper: true,
        enforceInMethodNames: true,
      },
    ],
    'no-unneeded-ternary': [
      'error',
      {
        defaultAssignment: false,
      },
    ],
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'error',
    'space-before-function-paren': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'no-useless-constructor': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'no-console': [
      'error',
      {
        allow: ['info'],
      },
    ],
  },
  overrides: [
    {
      files: ['index.ts'],
      rules: {
        'no-inline-comments': 'off',
      },
    },
    {
      files: ['ducks.ts', '**/common/utils/request/index.ts'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'valid-jsdoc': [
          'error',
          {
            prefer: {
              arg: 'param',
              argument: 'param',
              class: 'constructor',
              return: 'returns',
              virtual: 'abstract',
            },
            requireParamDescription: true,
            requireReturnDescription: true,
            requireParamType: false,
            requireReturnType: false,
            requireReturn: true,
          },
        ],
      },
    },
    {
      files: ['selectors.ts'],
      rules: {
        'valid-jsdoc': 'off',
      },
    },
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins: ['@typescript-eslint', 'react-hooks', 'prettier'],
  env: {
    browser: true,
  },
  globals: {
    it: true,
    expect: true,
    test: true,
    describe: true,
    beforeEach: true,
    beforeAll: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {},
    },
  },
};
