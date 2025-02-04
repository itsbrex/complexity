import "@/utils/dayjs";
import "@/utils/i18next";

// Cache
import "@/services/extension-local-storage";
import "@/services/plugins-states";
import "@/services/indexed-db/better-code-blocks";
import "@/services/pplx-api/network-intercept-middlewares";
import "@/data/plugins/query-box/language-model-selector/language-models";

// Core Features
import "@/plugins/_api/spa-router/listeners";
import "@/plugins/_core/network-intercept/listeners";
import "@/plugins/_core/dom-observers/query-boxes/observers";
import "@/plugins/_core/dom-observers/home/observers";
import "@/plugins/_core/dom-observers/thread/observers";
import "@/plugins/_core/dom-observers/sidebar/observers";
import "@/plugins/_core/dom-observers/spaces-page/observers";
import "@/plugins/_core/dom-observers/settings-page/observers";

// Query Box Plugins
import "@/plugins/language-model-selector/network-intercept-middlewares";
import "@/plugins/language-model-selector/respect-space-model";
import "@/plugins/focus-web-recency/network-intercept-middlewares";
import "@/plugins/better-focus-selector/network-intercept-middlewares";
import "@/plugins/_core/ui-groups/query-box/shared-store";
import "@/data/plugins/better-focus-selector/focus-modes";
import "@/data/plugins/better-focus-selector/focus-web-recency";
import "@/plugins/prompt-history/network-intercept-middlewares";
import "@/plugins/prompt-history/listeners";
import "@/plugins/no-file-creation-on-paste";
import "@/plugins/query-box-submit-on-ctrl-enter";
import "@/plugins/full-width-follow-up-query-box";

// Thread Plugins
import "@/plugins/canvas/store";
import "@/plugins/drag-n-drop-file-to-upload-in-thread";
import "@/plugins/collapse-empty-thread-visual-cols";
import "@/plugins/thread-better-message-toolbars/explicit-model-name";
import "@/plugins/thread-better-message-toolbars/message-words-and-characters-count";
import "@/plugins/thread-better-message-toolbars/collapsible-query/populate-original-height";
import "@/plugins/instant-rewrite-button/native-btn-bind";
import "@/plugins/custom-thread-container-width";

// Home Plugins
import "@/plugins/home-custom-slogan";
import "@/plugins/hide-homepage-widgets";

// General Plugins
import "@/plugins/hide-get-mobile-app-cta-btn";
import "@/plugins/zen-mode";
import "@/plugins/block-analytic-events";
import "@/plugins/space-navigator/sidebar-content/network-intercept-middlewares";

// Global Stores
import "@/data/color-scheme-store";
import "@/data/pplx-cookies-store";
import "@/components/plugins-guard/store";

// Loaders
import "@/entrypoints/content-scripts/loaders/core-plugins-loader";
import "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/setup-root";
