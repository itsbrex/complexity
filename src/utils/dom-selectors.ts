export const DOM_SELECTORS = {
  SIDEBAR: ".group\\/bar",
  THREAD: {
    /** The outermost container that wraps the thread container and the query box */
    WRAPPER: ".max-w-threadWidth",
    NAVBAR: ".sticky.left-0.right-0.top-0.z-10.border-b",
    /** The container that wraps all messages */
    CONTAINER: {
      /** Normal thread*/
      NORMAL:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div.relative > div:first-child",
      /** Branched thread */
      BRANCHED:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg div.relative > div:nth-child(2):not([class])",
    },
    MESSAGE: {
      WRAPPER: ".grid-cols-12",
      TEXT_COL: ".col-span-8",
      /** Columns that contain images, videos, image gen popover */
      VISUAL_COL: ".col-span-4",
      TEXT_COL_CHILD: {
        /** The query box */
        QUERY: ".my-md.md\\:my-lg",
        QUERY_TITLE: ".group\\/query",
        EDIT_TEXT_AREA: "textarea[placeholder]",
        /** The answer heading */
        ANSWER_HEADING:
          ".mb-sm.flex.w-full.items-center.justify-between:has(svg.transform-gpu)",
        /** The sources heading */
        SOURCES_HEADING:
          '.mb-sm.flex.w-full.items-center.justify-between:has(svg[data-icon="sources"])',
        /** The answer wrapper */
        ANSWER: ".relative.default.font-sans.text-base",
      },
      VISUAL_COL_CHILD: {
        IMAGE_GEN: {
          OPTIONS_GRID:
            "div.grid.grid-cols-2.gap-sm.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent",
        },
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: "div.w-full.max-w-\\[90vw\\]",
        NATIVE_HEADER: ".codeWrapper>div:first-child",
        NATIVE_COPY_BUTTON: 'button[aria-label="Copy Code"]',
      },
      /** The bottom toolbar of the message (share, rewrite, model name, etc.) */
      BOTTOM_BAR: ".mt-sm.flex.items-center.justify-between",
      BOTTOM_BAR_CHILD: {
        COPY_BUTTON: 'button[aria-label="Copy"]',
        THUMBS_DOWN_BUTTON: 'button:has([data-icon="thumbs-down"]',
        MISC_BUTTON: 'button:has([data-icon="ellipsis"])',
        REWRITE_BUTTON: 'button:contains("Rewrite")',
      },
    },
    POPPER: {
      MOBILE: ".duration-250.fill-mode-both.fixed.bottom-0.left-0",
      DESKTOP: "[data-popper-reference-hidden]",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.md\\:text-center.pb-xs.md\\:text-center",
  },
  QUERY_BOX: {
    TEXTAREA: {
      MAIN: '[location="home"] textarea[placeholder][autocomplete][style*="height: 48px !important;"]:not([data-testid="quick-search-modal"] textarea)',
      MAIN_MODAL:
        '[data-testid="quick-search-modal"] textarea[placeholder][autocomplete][style*="height: 48px !important;"]',
      SPACE:
        '[location="collection"] textarea[placeholder][autocomplete][style*="height: 48px !important;"]:not([data-testid="quick-search-modal"] textarea)',
      FOLLOW_UP:
        '[location="thread"] .pointer-events-none.fixed.bottom-mobileNavHeight textarea[placeholder][autocomplete]',
      ARBITRARY: "textarea[placeholder][autocomplete]",
    },
    ATTACH_BUTTON: 'button:has([data-icon="circle-plus"]):last',
    SUBMIT_BUTTON: 'button[aria-label="Submit"]',
    FORK_BUTTON: 'button svg[data-icon="code-fork"]',
    /** The floating container that wraps the query box */
    WRAPPER: ".grow.block",
    PRO_SEARCH_TOGGLE: "button#copilot-toggle",
    INCOGNITO_TOGGLE: ".mr-xs.flex.shrink-0.items-center",
  },
  STICKY_NAVBAR: ".sticky.left-0.right-0.top-0.border-b",
  SICKY_NAVBAR_CHILD: {
    THREAD_TITLE_WRAPPER:
      ".hidden.max-w-md.grow.items-center.justify-center.gap-x-xs.text-center.md\\:flex",
    THREAD_TITLE:
      ".min-w-0 .cursor-pointer.transition.duration-300.hover\\:opacity-70",
    THREAD_TITLE_INPUT: 'input[placeholder="Untitled"]',
  },
} as const;

/**
 * Selectors that are generated by the extension.
 */
export const DOM_INTERNAL_SELECTORS = {
  THREAD: {
    MESSAGE: {
      BLOCK: ".cplx-message-block",
      TEXT_COL: ".cplx-message-block-text-col",
      VISUAL_COL: ".cplx-message-block-visual-col",
      TEXT_COL_CHILD: {
        QUERY: ".cplx-message-block-query",
        ANSWER: ".cplx-message-block-answer",
        ANSWER_HEADING: ".cplx-message-block-answer-heading",
        CODE_BLOCK: ".cplx-message-block-code-block",
        MIRRORED_CODE_BLOCK: ".cplx-mirrored-code-block",
        BOTTOM_BAR: ".cplx-message-block-bottom-bar",
      },
    },
  },
} as const;

export const TEST_ID_SELECTORS = {
  QUERY_BOX: {
    LANGUAGE_MODEL_SELECTOR: "cplx-language-model-selector",
    IMAGE_GEN_MODEL_SELECTOR: "cplx-image-gen-model-selector",
  },
} as const;
