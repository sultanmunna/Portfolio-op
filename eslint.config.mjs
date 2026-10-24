import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
  next.configs.recommended,
  next.configs["core-web-vitals"],
  globalIgnores([".next/**", "out/**", "node_modules/**", "public/**"]),
]);

export default eslintConfig;
