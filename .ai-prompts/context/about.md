
# About
This project is a browser extension that enhances Perplexity's user experience on both UI and UX.

# Main Features
Adding extra UIs & UX tweaks via content scripts

# Architecture
- Each tweak/setting is implemented as a dedicated "plugin", including core plugins and plugins that depend on those core plugins.
- There are free & paid plugins.

# Persistent data
- User's general settings:
  - Free users: synced to the current browser's `localStorage`.
  - Paid users: synced to the cloud and can be shared across devices.

- Plugins can be remotely (forcefully) disabled by feature flags in case of breakages (e.g., host page changes).
