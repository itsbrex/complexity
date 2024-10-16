<code_base_info>

This is a web extension that enhances Perplexity's user experience on both UI and UX.

- Build tool: `vite` + `@crxjs/vite-plugin`.
- UI Rendering: React.
- DOM Manipulation on web pages: jQuery.
- This project follows the following Feature-based architecture, ensuring one way data flow:

  - `src/entrypoints/**/*`: Extension's entry points (content scripts, background, options page, popup, etc.).
  - `src/features/**/*`: Feature-specific code organized by domain.
    - `src/features/plugins/**/*`: Main functionality of the extension organized in plugins
      - `src/features/plugins/core/*/**/*`: Core plugins providing essential functionality
      - `src/features/plugins/*/**/*`: Regular plugins extending functionality
  - Globally shared directories:
    - `src/components/ui/**/*`: React UI components, treat it like a UI library.
    - `src/utils`: Utility functions and helpers
    - `src/hooks`: Custom React hooks
    - `src/services`: Shared services
    - `src/types`: TypeScript type definitions
    - `src/data`: Data-related code and constants
  - `src/assets`: CSS and Tailwind configurations
    - `extension.css` for extension UI (popup, options page, newtab page, etc.).
    - `cs.css` for Content Script UI (injected into web pages).
  - `public/locales`: Internationalization (i18next)
  - `e2e`: End-to-end tests

- CSS naming convention: Tailwind classes prefixed with `tw-`, but only for our own UIs, do not use prefixes when selecting elements in web pages.
- Custom `cn` utility function for combining Tailwind classes (`clsx` + `twMerge`).
- Look for auto imports config in `src/types/unimport.config.ts`.
- Environment variables managed using `dotenvx`.
- ESLint and Prettier configured for code linting and formatting.
- Using `webext-bridge` for messaging.
- Light and dark color schemes defined in `colors.css`.
- Built for both Chrome and Firefox browsers.
- Internationalization (i18n) using react-i18next.
- File naming convention:
  - PascalCase for files that have a default export.
  - camelCase for files that do not have a default export.

<testing>

- Unit testing: Vitest + `@webext-core/fake-browser`: the `fakeBrowser` is a global object that mimics the browser environment. Tests reside in the same directory as the code being tested and are named `*.test.ts`.
- E2E testing: Playwright. Tests are located in the `e2e` directory. Uses a persistent context with a dedicated Chrome profile located at `chrome-profiles` relative to the test file. Loads the unpacked extension from `dist`. The path to the Chrome executable can be configured via the `CHROME_PATH` environment variable.

</testing>

<code_styles>

- NEVER delete user's comments.
- Follow these TypeScript coding/refactoring conventions:
  - Use modern methods (e.g., `slice()` instead of `substr()`).
  - Write in very strict TypeScript:
    - Prefer `type` over `interface` for type declarations.
    - Use built-in types whenever possible.
    - Avoid types banned by `eslint@typescript-eslint/ban-types` (e.g., `Function`).
    - Do not use `any` type, implicit or explicit.
  - React conventions:
    - Directly import modules: `useState` instead of `React.useState`.
    - Use functional components: `function Component()` instead of `const Component: React.FC`.
  - Use the custom `cn` function for combining Tailwind classes.
  - Use `tw-` prefix for Tailwind classes.
  - Do not use barrel files.
  - Follow the established project structure for organizing code.

</code_styles>
