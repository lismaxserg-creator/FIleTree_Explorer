# FileTree Explorer

React + TypeScript app for importing a JSON file tree, browsing it as an expandable tree, and opening node details.

## Run locally

```bash
npm install
npm run dev
```

## Architecture decisions

- Vite was used for fast startup and a small amount of configuration.
- The tree data is stored in `localStorage`, which makes `/tree` and `/tree/:nodePath` survive refreshes.
- Search state is stored in the URL query string, so search results also survive refreshes and are shareable.
- The app uses a simple recursive tree model and helper functions for path lookup, indexing, and size calculations.
- Routing is handled with React Router v6 and the app keeps a single layout shell for all views.

## What I would do with more time

- Add validation feedback that pinpoints exactly where malformed JSON breaks the tree.
- Add unit tests for parser, path lookup, and size calculation.
- Support drag-and-drop upload with explicit visual feedback and larger-file handling.
- Add breadcrumbs and a “copy path” action on node details.
- Persist expanded/collapsed folder state across refreshes.

## Known limitations

- Imported data currently lives in browser storage only.
- Duplicate node names under the same parent can make path-based navigation ambiguous.
- Search indexes the current tree in memory on each query, which is fine for a recruitment-sized dataset but not ideal for very large trees.
