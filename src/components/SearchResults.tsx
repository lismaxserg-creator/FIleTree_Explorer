/**
 * SearchResults component - displays a list of search results from the file tree.
 * Shows matching nodes with their paths, names, and metadata (size or child count).
 * Provides links to navigate to each result in the tree view.
 */
import { Link } from 'react-router-dom';
import type { IndexedNode } from '../types';
import { formatBytes, isFolder } from '../utils/tree';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { EmptyCopy, mutedText } from '../styles/primitives';

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;

const ResultLink = styled(Link)`
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Path = styled.span`
  ${mutedText}
`;

const Meta = styled.em`
  ${mutedText}
`;

interface ISearchResultsProps {
  results: IndexedNode[];
}

export default function SearchResults({ results }: ISearchResultsProps): ReactElement {
  if (results.length === 0) {
    return <EmptyCopy>No results yet. Start typing to search.</EmptyCopy>;
  }

  return (
    <ResultsList>
      {results.map(({ node, path }) => (
        <li key={path}>
          <ResultLink to={`/tree/${encodeURIComponent(path)}`}>
            <strong>{node.name}</strong>
            <Path>{path}</Path>
            <Meta>{isFolder(node) ? `${node.children.length} children` : formatBytes(node.size)}</Meta>
          </ResultLink>
        </li>
      ))}
    </ResultsList>
  );
}
