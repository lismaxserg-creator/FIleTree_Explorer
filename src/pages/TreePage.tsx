/**
 * TreePage component - displays the file tree with search functionality.
 * Allows users to explore the loaded file tree, search by name or path,
 * and navigate to individual nodes.
 */

import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { loadTree } from '../utils/storage';
import { searchTree } from '../utils/tree';
import TreeNodeView from '../components/TreeNodeView';
import SearchResults from '../components/SearchResults';
import styled from 'styled-components';
import { Panel, PrimaryLink, SectionTitle, Title } from '../styles/primitives';

const EmptyState = styled(Panel)`
  padding: 28px;
`;

const TreeLayout = styled.section`
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 20px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled(Panel).attrs({ as: 'aside' })`
  padding: 28px;
`;

const TreePanel = styled(Panel)`
  padding: 28px;
`;

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(3, 9, 18, 0.84);
  color: #eff4ff;
`;

const TreeRoot = styled.div`
  display: grid;
  gap: 6px;
`;

export default function TreePage(): ReactElement {
  const [tree, setTree] = useState<FileTreeNode | null>(() => loadTree());
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';

  useEffect(() => {
    setTree(loadTree());
  }, []);

  const results = useMemo(() => {
    if (!tree) {
      return [];
    }
    return searchTree(tree, query);
  }, [tree, query]);

  if (!tree) {
    return (
      <EmptyState>
        <Title>No tree loaded yet</Title>
        <p>Go back to the import screen and paste or upload a JSON file first.</p>
        <PrimaryLink to="/">
          Import JSON
        </PrimaryLink>
      </EmptyState>
    );
  }

  return (
    <TreeLayout>
      <Sidebar>
        <SectionTitle>
          <Title>Search</Title>
          <p>Matches name or full path across the entire tree.</p>
        </SectionTitle>

        <SearchInput
          type="search"
          placeholder="Search by name or path"
          value={query}
          onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })}
        />

        <SearchResults results={results} />
      </Sidebar>

      <TreePanel>
        <SectionTitle>
          <Title>Tree view</Title>
          <p>Expand folders, or open any node for detailed metadata.</p>
        </SectionTitle>

        <TreeRoot>
          <TreeNodeView node={tree} path={tree.name} depth={0} />
        </TreeRoot>

      </TreePanel>
    </TreeLayout>
  );
}
