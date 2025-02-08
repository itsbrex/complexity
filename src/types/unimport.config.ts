import { normalizePath } from "../utils/normalize-path";

import { UnimportPluginOptions } from "unimport/unplugin";

const unimportConfig: Partial<UnimportPluginOptions> = {
  dts: "./src/types/unimport.d.ts",
  presets: [
    "react",
    {
      from: "react",
      imports: [
        "lazy",
        "forwardRef",
        "use",
        "createContext",
        "useDeferredValue",
        "memo",
      ],
    },
    {
      from: normalizePath("src/utils/js-context.ts"),
      imports: ["onlyMainWorldGuard", "onlyExtensionGuard"],
    },
    {
      from: normalizePath("src/utils/utils.ts"),
      imports: ["sleep", "isMainWorldContext", "isExtensionContext"],
    },
    {
      from: normalizePath("src/utils/i18next.ts"),
      imports: ["t"],
    },
    {
      from: normalizePath("src/utils/deep-equal.ts"),
      imports: ["deepEqual"],
    },
  ],
  imports: [
    {
      name: "default",
      as: "$",
      from: "jquery",
    },
    {
      name: "i18n",
      from: normalizePath("src/utils/i18next.ts"),
    },
    {
      name: "cn",
      from: normalizePath("src/utils/cn.ts"),
    },
    {
      name: "Key",
      from: "ts-key-enum",
    },
  ],
};

export default unimportConfig;
