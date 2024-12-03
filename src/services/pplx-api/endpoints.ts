import { Space } from "@/services/pplx-api/pplx-api.types";

export const ENDPOINTS = {
  HOME: "https://www.perplexity.ai/",
  AUTH_SESSION: "https://www.perplexity.ai/api/auth/session",
  USER_SETTINGS: "https://www.perplexity.ai/p/api/v1/user/settings",
  USER_SETTINGS_FALLBACK: "https://www.perplexity.ai/rest/user/settings",
  ORG_SETTINGS:
    "https://www.perplexity.ai/rest/enterprise/user/organization?version=2.13&source=default",
  SAVE_SETTINGS: "https://www.perplexity.ai/rest/user/save-settings",
  FETCH_SPACES:
    "https://www.perplexity.ai/rest/collections/list_user_collections?limit=50&offset=0&version=2.13&source=default",
  FETCH_SPACE_THREADS: (spaceSlug: Space["slug"]) =>
    `https://www.perplexity.ai/rest/collections/list_collection_threads?collection_slug=${spaceSlug}&limit=50&offset=0&version=2.13&source=default`,
  MAINTENANCE_STATUS: "https://www.perplexity.ai/v0/api/maintenance",
};
