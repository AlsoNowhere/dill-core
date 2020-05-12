
import resolve from "@rollup/plugin-node-resolve";

const output = [
    {
        file: "./dist/dill-core.js",
        format: "esm"
    },
    {
        file: "./dist/dill.js",
        name: "dill",
        format: "iife",
        sourcemap: true
    }
];

export default {
    input: "./src/main.js",
    output,
    plugins: [
        resolve()
    ],
    watch: {
        exclude: "node_modules/**"
    }
};
