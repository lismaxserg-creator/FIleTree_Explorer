import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { loadTree } from '../utils/storage';
import { isFolder, searchTree } from '../utils/tree';
import TreeNodeView from '../components/TreeNodeView';
import SearchResults from '../components/SearchResults';

export default function TreePage(): ReactElement {
  const [tree, setTree] = useState<FileTreeNode | null>(() => loadTree());
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';

  useEffect(() => {
    setTree(loadTree());
  }, []);

  const results = useMemo(() => {
    if (!tree) return [];
    return searchTree(tree, query);
  }, [tree, query]);

  const isSearching = query.trim().length > 0;

  if (!tree) {
    return (
      <section className="panel empty-state">
        <h2>No tree loaded yet</h2>
        <p>Go back to the import screen and paste or upload a JSON file first.</p>
        <Link className="primary inline" to="/">
          Import JSON
        </Link>
      </section>
    );
  }

  return (
    <section className="tree-layout">
      <aside className="panel sidebar">
        <div className="section-title">
          <h2>Search</h2>
          <p>Matches name or full path across the entire tree.</p>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search by name or path"
          value={query}
          onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })}
        />

        <SearchResults results={results} />
      </aside>

      <div className="panel tree-panel">
        <div className="section-title">
          <h2>Tree view</h2>
          <p>Expand folders, or open any node for detailed metadata.</p>
        </div>

        <div className="tree-root">
          <TreeNodeView node={tree} path={tree.name} depth={0} />
        </div>

        {isFolder(tree) ? (
          <div className="tree-summary">
            <span>{tree.children.length} direct children</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
