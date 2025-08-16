import { Builder } from "fenge/eslint-config";

export default new Builder()
  .enablePackageJson()
  .enableJavaScript()
  .enableTypeScript({
    omit: ["esm/no-phantom-dep-imports"],
  })
  .toConfig();
