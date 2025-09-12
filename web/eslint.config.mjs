import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
    // Next.js Core Web Vitals and TypeScript configurations
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript", "prettier"],
        settings: {
            next: {
                rootDir: "./",
            },
        },
    }),

    // Custom rules configuration
    {
        files: ["**/*.{js,mjs,cjs,ts,tsx}"],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Prettier rules
            "prettier/prettier": "error",

            // TypeScript rules
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-var-requires": "off",

            // Base ESLint rules
            "no-console": "warn",
            "prefer-const": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-arrow-callback": "error",
            "prefer-template": "error",
            eqeqeq: ["error", "always"],
            "no-duplicate-imports": "error",

            // React rules
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Next.js specific rules
            "@next/next/no-img-element": "warn",
            "@next/next/no-page-custom-font": "warn",

            // Import sorting
            "sort-imports": [
                "error",
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
                },
            ],
        },
    },

    // Files to ignore
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "dist/**",
            "next-env.d.ts",
            "*.min.js",
            "*.min.css",
            "coverage/**",
            ".nyc_output/**",
            "pnpm-lock.yaml",
            ".cache/**",
            ".vercel/**",
            "public/**",
        ],
    },
];

export default eslintConfig;
