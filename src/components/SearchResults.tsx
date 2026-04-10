import { Link } from 'react-router-dom';
import type { IndexedNode } from '../types';
import { formatBytes, isFolder } from '../utils/tree';
import { ReactElement } from 'react';

interface ISearchResultsProps {
  results: IndexedNode[];
}

export default function SearchResults({ results }: ISearchResultsProps): ReactElement {
  if (results.length === 0) {
    return <p className="empty-copy">No results yet. Start typing to search.</p>;
  }

  return (
    <ul className="search-results">
      {results.map(({ node, path }) => (
        <li key={path}>
          <Link to={`/tree/${encodeURIComponent(path)}`}>
            <strong>{node.name}</strong>
            <span>{path}</span>
            <em>{isFolder(node) ? `${node.children.length} children` : formatBytes(node.size)}</em>
          </Link>
        </li>
      ))}
    </ul>
  );
}
