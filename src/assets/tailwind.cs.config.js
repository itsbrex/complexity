import baseConfig from "../../tailwind.config.js";

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    fontFamily: {
      sans: "var(--font-fk-grotesk)",
      mono: "var(--font-berkeley-mono)",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
