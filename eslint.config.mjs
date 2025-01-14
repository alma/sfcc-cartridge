import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["cartridges/int_alma/cartridge/static/", "**/coverage"],
}, ...compat.extends("airbnb-base/legacy"), {
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
    },

    rules: {
        "import/no-unresolved": "off",

        indent: ["error", 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
        }],

        "func-names": "off",
        "require-jsdoc": "error",

        "valid-jsdoc": ["error", {
            preferType: {
                Boolean: "boolean",
                Number: "number",
                object: "Object",
                String: "string",
            },

            requireReturn: false,
        }],

        "vars-on-top": "off",
        "global-require": "off",

        "no-shadow": ["error", {
            allow: ["err", "callback"],
        }],

        "max-len": "off",
        "no-param-reassign": 0,
    },
}];