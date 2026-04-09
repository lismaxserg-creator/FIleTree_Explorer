# FileTree Explorer

React + TypeScript app for importing a JSON file tree, browsing it as an expandable tree, and opening node details.

## Run locally

```bash
npm install && npm run dev
```

## Architecture decisions

- Vite was used for fast startup and a small amount of configuration.
- The tree data is stored in `localStorage`, which makes `/tree` and `/tree/:nodePath` survive refreshes.
- Search state is stored in the URL query string, so search results also survive refreshes and are shareable.
- The app uses a simple recursive tree model and helper functions for path lookup, indexing, and size calculations.
- Routing is handled with React Routerv6 and the app keeps a single layout shell for all views.
