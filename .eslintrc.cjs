const { includes } = require("lodash");

module.exports = {
  // Root and environment configuration
  root: true,
  env: { browser: true, es2020: true },

  // Parser configuration
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  // Extension configurations
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  // Plugins
  plugins: [
    "react",
    "react-refresh",
    "unicorn",
    "@limegrass/import-alias",
    "boundaries",
  ],

  // Files to ignore
  ignorePatterns: ["dist", ".eslintrc.cjs"],

  // Settings configuration
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    "boundaries/include": ["src/**/*"],
    "boundaries/elements": [
      {
        type: "shared",
        mode: "full",
        pattern: [
          "src/*.ts",
          "src/components/**/*",
          "src/assets/**/*",
          "src/hooks/**/*",
          "src/services/**/*",
          "src/types/**/*",
          "src/utils/**/*",
          "src/data/**/*",
        ],
      },
      {
        type: "entrypoint",
        mode: "full",
        pattern: ["src/entrypoints/**/*"],
      },
      {
        type: "core-plugin",
        mode: "full",
        capture: ["corePluginName"],
        pattern: ["src/features/plugins/_core/*/**/*"],
      },
      {
        type: "thread-plugin",
        mode: "full",
        capture: ["threadPluginName"],
        pattern: ["src/features/plugins/thread/*/**/*"],
      },
      {
        type: "plugin",
        mode: "full",
        capture: ["pluginName"],
        pattern: ["src/features/plugins/*/**/*"],
      },
      {
        type: "feature",
        mode: "full",
        capture: ["featureName"],
        pattern: ["src/features/*/**/*"],
      },
    ],
  },

  // Rules configuration
  rules: {
    // TypeScript rules
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": false,
        },
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/strict-boolean-expressions": [
      "warn",
      {
        allowNumber: true,
        allowNullableString: true,
        allowNullableNumber: false,
        allowNullableBoolean: true,
      },
    ],

    // React rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-sort-props": [
      "warn",
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
        noSortAlphabetically: true,
      },
    ],
    "react/jsx-no-useless-fragment": [
      "warn",
      {
        allowExpressions: true,
      },
    ],

    // Import rules
    "import/no-cycle": "error",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "**/*?script&module",
            group: "unknown",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["script-module"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "@limegrass/import-alias/import-alias": "off",

    // Boundaries rules
    "boundaries/no-unknown": ["error"],
    "boundaries/no-unknown-files": ["error"],
    "boundaries/element-types": [
      "error",
      {
        default: "disallow",
        rules: [
          {
            from: ["shared"],
            allow: ["shared", "core-plugin"],
          },
          {
            from: ["feature"],
            allow: [
              "shared",
              "core-plugin",
              ["feature", { featureName: "${from.featureName}" }],
            ],
          },
          {
            from: ["core-plugin"],
            allow: [
              "shared",
              ["core-plugin", { corePluginName: "${from.corePluginName}" }],
              "entrypoint",
            ],
          },
          {
            from: ["plugin"],
            allow: [
              "shared",
              "core-plugin",
              ["plugin", { pluginName: "${from.pluginName}" }],
            ],
          },
          {
            from: ["thread-plugin"],
            allow: [
              "shared",
              "core-plugin",
              ["plugin", { pluginName: "thread" }],
              [
                "thread-plugin",
                { threadPluginName: "${from.threadPluginName}" },
              ],
            ],
          },
          {
            from: ["entrypoint"],
            allow: [
              "entrypoint",
              "shared",
              "feature",
              "core-plugin",
              "plugin",
              "thread-plugin",
            ],
          },
        ],
      },
    ],

    // Other rules
    "prefer-rest-params": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          pascalCase: true,
          kebabCase: true,
          camelCase: true,
        },
        ignore: ["\\.d\\.ts$"],
      },
    ],
  },

  // File-specific overrides
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "@limegrass/import-alias/import-alias": ["warn"],
      },
    },
  ],
};
