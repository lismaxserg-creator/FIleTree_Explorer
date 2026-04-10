/**
 * NodePage component - displays detailed information about a specific node in the file tree.
 * Shows metadata like name, path, size, and for folders - children list.
 * Allows navigation back to the tree view.
 */
import { Link, useParams } from 'react-router-dom';
import { loadTree } from '../utils/storage';
import { calculateFolderSize, findNodeByPath, formatBytes, isFolder } from '../utils/tree';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { Panel, PrimaryLink, SectionTitle, Title, mutedText } from '../styles/primitives';

const EmptyState = styled(Panel)`
  padding: 28px;
`;

const DetailsPanel = styled(Panel)`
  padding: 28px;
`;

const DetailsGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  > div {
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  dt {
    margin-bottom: 8px;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    ${mutedText}
  }

  dd {
    margin: 0;
    word-break: break-word;
    ${mutedText}
  }

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const ChildrenList = styled.div`
  margin-top: 20px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export default function NodePage(): ReactElement {
  const { nodePath } = useParams();
  const tree = loadTree();

  if (!tree || !nodePath) {
    return (
      <EmptyState>
        <Title>Nothing to show</Title>
        <p>The tree is missing or the path is invalid.</p>
        <PrimaryLink to="/">
          Import JSON
        </PrimaryLink>
      </EmptyState>
    );
  }

  const decodedPath = decodeURIComponent(nodePath);
  const node = findNodeByPath(tree, decodedPath);

  if (!node) {
    return (
      <EmptyState>
        <Title>Node not found</Title>
        <p>No node matches the path <code>{decodedPath}</code>.</p>
        <PrimaryLink to="/tree">
          Back to tree
        </PrimaryLink>
      </EmptyState>
    );
  }

  const pathSegments = decodedPath.split('/');
  const parentPath = pathSegments.slice(0, -1).join('/');

  return (
    <DetailsPanel>
      <SectionTitle>
        <Title>{isFolder(node) ? 'Folder details' : 'File details'}</Title>
        <p>
          <Link to="/tree">◀ Tree</Link>
          {' / '}
          <code>{decodedPath}</code>
        </p>
      </SectionTitle>

      <DetailsGrid>
        <div>
          <dt>Name</dt>
          <dd>{node.name}</dd>
        </div>
        <div>
          <dt>Full path</dt>
          <dd>
            {parentPath ? `${parentPath}/` : ''}
            <strong>{node.name}</strong>
          </dd>
        </div>
        {isFolder(node) ? (
          <>
            <div>
              <dt>Direct children</dt>
              <dd>{node.children.length}</dd>
            </div>
            <div>
              <dt>Total size</dt>
              <dd>{formatBytes(calculateFolderSize(node))}</dd>
            </div>
          </>
        ) : (
          <div>
            <dt>Size</dt>
            <dd>{formatBytes(node.size)}</dd>
          </div>
        )}
      </DetailsGrid>

      {isFolder(node) ? (
        <ChildrenList>
          <h3>Children</h3>
          <ul>
            {node.children.map((child) => {
              const childPath = `${decodedPath}/${child.name}`;
              const encoded = encodeURIComponent(childPath);
              return (
                <li key={childPath}>
                  <Link to={`/tree/${encoded}`}>{child.name}</Link>
                  <span>{child.type}</span>
                </li>
              );
            })}
          </ul>
        </ChildrenList>
      ) : null}
    </DetailsPanel>
  );
}
