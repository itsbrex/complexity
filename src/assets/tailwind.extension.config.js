import baseConfig from "../../tailwind.config.js";

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    fontFamily: {
      sans: "sans-serif",
      mono: "monospace",
    },
  },
};
