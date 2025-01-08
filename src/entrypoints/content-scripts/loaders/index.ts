import "@/utils/dayjs";
import "@/utils/i18next";

// Cache
import "@/services/extension-local-storage/extension-local-storage";
import "@/services/plugins-states/plugins-states";
import "@/services/indexed-db/better-code-blocks/better-code-blocks";
import "@/services/pplx-api/network-intercept-middlewares";
import "@/data/plugins/query-box/language-model-selector/language-models";

// Core Features
import "@/features/plugins/_core/network-intercept/listeners";
import "@/features/plugins/_core/spa-router/listeners";
import "@/features/plugins/_core/dom-observer/observers/query-boxes/query-boxes";
import "@/features/plugins/_core/dom-observer/observers/home/home-components";
import "@/features/plugins/_core/dom-observer/observers/thread/thread-components";

// Query Box Plugins
import "@/features/plugins/query-box/language-model-selector/network-intercept-middlewares";
import "@/features/plugins/query-box/focus-selector/network-intercept-middlewares";
import "@/features/plugins/query-box/focus-web-recency/network-intercept-middlewares";
import "@/features/plugins/query-box/shared-store";
import "@/data/plugins/focus-selector/focus-modes";
import "@/data/plugins/focus-selector/focus-web-recency";
import "@/features/plugins/query-box/prompt-history/network-intercept-middlewares";
import "@/features/plugins/query-box/prompt-history/listeners";
import "@/features/plugins/query-box/no-file-creation-on-paste";
import "@/features/plugins/query-box/submit-on-ctrl-enter";
import "@/features/plugins/query-box/full-width-follow-up/full-with-follow-up";

// Thread Plugins
import "@/features/plugins/thread/canvas/store";
import "@/features/plugins/thread/drag-n-drop-file-to-upload-in-thread/drag-n-drop-file-to-upload-in-thread";
import "@/features/plugins/thread/collapse-empty-thread-visual-cols/collapse-empty-thread-visual-cols";
import "@/features/plugins/thread/better-message-toolbars/explicit-model-name";
import "@/features/plugins/thread/better-message-toolbars/words-and-characters-count";
import "@/features/plugins/thread/custom-thread-container-width/custom-thread-container-width";

// Home Plugins
import "@/features/plugins/home/custom-slogan/custom-slogan";

// General Plugins
import "@/features/plugins/hide-get-mobile-app-cta-btn/hide-get-mobile-app-cta-btn";
import "@/features/plugins/zen-mode/zen-mode";
import "@/features/plugins/block-analytic-events/network-intercept-middlewares";

// Global Stores
import "@/data/color-scheme-store";

// Loaders
import "@/entrypoints/content-scripts/loaders/core-plugins-loader";
import "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/setup-root";
