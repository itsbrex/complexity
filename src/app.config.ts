import { z } from "zod";
import packageJson from "../package.json";

const env = typeof process === "undefined" ? import.meta.env : process.env;

const EnvVarsSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  VITE_TARGET_BROWSER: z
    .enum(["chrome", "firefox"])
    .optional()
    .default("chrome"),
  VITE_CPLX_API_URL: z.string(),
  DEV: z.string().or(z.boolean()).optional(),
});

const parsedEnv = EnvVarsSchema.parse(env);

const APP_CONFIG = {
  VERSION: packageJson.version,
  BROWSER: parsedEnv.VITE_TARGET_BROWSER,
  IS_DEV: Boolean(parsedEnv.DEV) || parsedEnv.NODE_ENV === "development",
  CPLX_API_URL: parsedEnv.VITE_CPLX_API_URL,
  "perplexity-ai": {
    globalMatches: ["https://*.perplexity.ai/*"],
    globalExcludeMatches: [
      "https://stripe.perplexity.ai/*",
      "https://*.perplexity.ai/p/api/*",
      "https://*.perplexity.ai/hub/*",
      "https://*.labs.perplexity.ai/*",
      "https://*.docs.perplexity.ai/*",
    ],
  },
};

export { APP_CONFIG };
