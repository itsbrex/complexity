export const DOM_SELECTORS = {
  SIDEBAR: {
    WRAPPER: ".group\\/bar",
    SPACE_BUTTON: "a[role='button'][aria-label][href='/spaces']",
    SPACE_BUTTON_WRAPPER: `.relative.justify-center.w-full:has(>div>a[role='button'][aria-label][href='/spaces'])`,
    SPACE_BUTTON_WRAPPER_CHILD: {
      TRIGGER_BUTTONS_PORTAL_CONTAINER:
        ".flex.items-center.min-w-0.justify-left.w-full",
    },
    LIBRARY_BUTTON: "a[role='button'][aria-label][href='/library']",
    LIBRARY_BUTTON_WRAPPER: `.relative.justify-center.w-full:has(>div>a[role='button'][aria-label][href='/library'])`,
    LIBRARY_BUTTON_WRAPPER_CHILD: {
      TRIGGER_BUTTONS_PORTAL_CONTAINER:
        ".flex.items-center.min-w-0.justify-left.w-full .-mr-sm.flex.w-full.flex-1.justify-end",
    },
  },
  THREAD: {
    /** The outermost container that wraps the thread container and the query box */
    WRAPPER:
      ".flex-1.basis-0.overflow-auto.scrollbar-thin:has(>.max-w-threadWidth)",
    NAVBAR: ".sticky.left-0.right-0.top-0.z-10.border-b",
    /** The container that wraps all messages */
    CONTAINER: {
      /** Normal thread*/
      NORMAL: ".size-full.max-w-threadWidth > div.relative > div:first-child",
      /** Branched thread */
      BRANCHED:
        ".size-full.max-w-threadWidth > div.relative > div:first-of-type",
    },
    MESSAGE: {
      WRAPPER: ".grid-cols-12",
      TEXT_COL: ".col-span-8",
      /** Columns that contain images, videos, image gen popover */
      VISUAL_COL: ".col-span-4",
      TEXT_COL_CHILD: {
        /** The query box */
        QUERY_WRAPPER: `div.mt-md.md\\:mt-lg.mb-3.md\\:mb-6:has(> .group\\/title), div.mt-md.md\\:mt-lg.mb-3.md\\:mb-6:has(div[style*="height"])`,
        QUERY: ".group\\/query",
        QUERY_HOVER_CONTAINER: ".pointer-events-none.absolute.bottom-0.right-0",
        QUERY_HOVER_CONTAINER_CHILD: {
          EDIT_QUERY_BUTTON: "button:has(svg[data-icon='pen-to-square'])",
        },
        EDIT_TEXT_AREA: "textarea[placeholder]",
        /** The answer heading */
        ANSWER_HEADING:
          ".mb-sm.flex.w-full.items-center.justify-between:has(svg.transform-gpu)",
        /** The sources heading */
        SOURCES: ".mb-lg.border-borderMain\\/50.ring-borderMain\\/50",
        /** The answer wrapper */
        ANSWER: ".mb-md > .relative.default.font-sans.text-base",
        /** The bottom toolbar of the message (share, rewrite, model name, etc.) */
        BOTTOM_BAR: ".mt-sm.flex.items-center.justify-between",
        BOTTOM_BAR_CHILD: {
          REWRITE_BUTTON: "button:has(svg.tabler-icon-repeat)",
          COPY_BUTTON: 'button[aria-label="Copy"]',
          THUMBS_DOWN_BUTTON: "button:has(svg.tabler-icon-thumb-down)",
          MISC_BUTTON: "button:has(svg.tabler-icon-dots)",
        },
      },
      VISUAL_COL_CHILD: {
        IMAGE_GEN: {
          OPTIONS_GRID:
            "div.grid.grid-cols-2.gap-sm.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent",
        },
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: "div.w-full.md\\:max-w-\\[90vw\\]:has(>pre)",
        NATIVE_HEADER: ".codeWrapper>div:first-child",
        NATIVE_COPY_BUTTON: 'button:has(svg[data-icon="copy"])',
      },
    },
    POPPER: {
      DESKTOP: ".duration-250.fill-mode-both>.absolute.left-0.right-0.top-0",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.md\\:text-center.pb-xs.md\\:text-center",
    BOTTOM_BAR: ".hidden.pb-md.md\\:block>>div",
    LANGUAGE_SELECTOR: "select#interface-language-select",
  },
  QUERY_BOX: {
    TEXTAREA: {
      MAIN: '[location="home"] textarea[placeholder][autocomplete][style*="height"]:not([data-testid="quick-search-modal"] textarea)',
      MAIN_MODAL:
        '[data-testid="quick-search-modal"] textarea[placeholder][autocomplete][style*="height"]',
      SPACE:
        '[location="collection"] textarea[placeholder][autocomplete][style*="height"]:not([data-testid="quick-search-modal"] textarea)',
      FOLLOW_UP:
        '[location="thread"] .pointer-events-none.fixed.bottom-mobileNavHeight textarea[placeholder][autocomplete]',
      ARBITRARY: "textarea[placeholder][autocomplete]",
    },
    ATTACH_BUTTON: 'button:has([data-icon="paperclip"]):last',
    SUBMIT_BUTTON: 'button[aria-label="Submit"]',
    FORK_BUTTON: 'button svg[data-icon="code-fork"]',
    /** The floating container that wraps the query box */
    WRAPPER: ".grow.block",
    PRO_SEARCH_TOGGLE: "button#copilot-toggle",
    INCOGNITO_TOGGLE: ".mr-xs.flex.shrink-0.items-center",
  },
  SPACES_PAGE: {
    INFO_CARD: ".col-span-4 > div > div",
    SPACE_CARD: `.contents a[data-testid="collection-preview"]`,
  },
  SETTINGS_PAGE: {
    TOP_NAV_WRAPPER: ".sticky.-top-12.z-20.flex",
    TOP_NAV_CHILD: {
      NAV_LINKS_WRAPPER:
        ".items-center.relative.flex-1.gap-x-md.flex.h-14.flex.px-md.w-auto",
    },
  },
  STICKY_NAVBAR: ".sticky.left-0.right-0.top-0.border-b",
  SICKY_NAVBAR_CHILD: {
    THREAD_TITLE_WRAPPER:
      ".hidden.max-w-md.grow.items-center.justify-center.gap-x-xs.text-center.md\\:flex",
    THREAD_TITLE:
      ".min-w-0 .cursor-pointer.transition.duration-300.hover\\:opacity-70",
    THREAD_TITLE_INPUT: 'input[placeholder="Untitled"]',
    BOOKMARK_BUTTON:
      "button[aria-label]:has(svg[class*='tabler-icon-bookmark'])",
  },
} as const;

/**
 * Selectors that are generated by the extension.
 */
export const INTERNAL_ATTRIBUTES = {
  SIDEBAR: {
    WRAPPER: "sidebar-wrapper",
    SPACE_BUTTON_WRAPPER: "sidebar-space-button-wrapper",
    SPACE_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER:
      "sidebar-space-button-trigger-buttons-portal-container",
    LIBRARY_BUTTON_WRAPPER: "sidebar-library-button-wrapper",
    LIBRARY_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER:
      "sidebar-library-button-trigger-buttons-portal-container",
    PINNED_SPACES_PORTAL_CONTAINER: "pinned-spaces",
  },
  HOME: {
    SLOGAN: "home-slogan",
    BOTTOM_BAR: "home-bottom-bar",
    LANGUAGE_SELECTOR: "home-language-selector",
  },
  THREAD: {
    NAVBAR: "thread-navbar",
    NAVBAR_CHILD: {
      EXPORT_THREAD_BUTTON: "thread-export-button",
      BOOKMARK_BUTTON: "thread-bookmark-button",
    },
    WRAPPER: "thread-wrapper",
    POPPER: {
      DESKTOP: "thread-popper-desktop",
    },
    MESSAGE: {
      BLOCK: "message-block",
      TEXT_COL: "message-block-text-col",
      VISUAL_COL: "message-block-visual-col",
      TEXT_COL_CHILD: {
        QUERY: "message-block-query",
        QUERY_HOVER_CONTAINER: "message-block-query-hover-container",
        ANSWER: "message-block-answer",
        ANSWER_HEADING: "message-block-answer-heading",
        ANSWER_HEADING_MODEL_NAME: "message-block-answer-heading-model-name",
        ANSWER_HEADING_WORDS_AND_CHARACTERS_COUNT:
          "message-block-answer-heading-words-and-characters-count",
        CODE_BLOCK: "message-block-code-block",
        MIRRORED_CODE_BLOCK: "mirrored-code-block",
        BOTTOM_BAR: "message-block-bottom-bar",
      },
    },
    ATTACHMENT_DROP_ZONE: "drag-n-drop-file-to-upload",
  },
  QUERY_BOX_CHILD: {
    COMPONENTS_WRAPPER: "query-box-components-wrapper",
    PPLX_COMPONENTS_WRAPPER: "query-box-pplx-components-wrapper",
    CPLX_COMPONENTS_LEFT_WRAPPER: "query-box-cplx-components-left-wrapper",
    CPLX_COMPONENTS_RIGHT_WRAPPER: "query-box-cplx-components-right-wrapper",
  },
  SPACES_PAGE: {
    SPACE_CARD: "space-card",
  },
  SETTINGS_PAGE: {
    TOP_NAV_WRAPPER: "settings-page-top-nav-wrapper",
  },
} as const;

export const TEST_ID_SELECTORS = {
  QUERY_BOX: {
    FOCUS_SELECTOR: "cplx-focus-selector",
    LANGUAGE_MODEL_SELECTOR: "cplx-language-model-selector",
    IMAGE_GEN_MODEL_SELECTOR: "cplx-image-gen-model-selector",
    SPACE_NAVIGATOR: "cplx-space-navigator",
  },
} as const;
