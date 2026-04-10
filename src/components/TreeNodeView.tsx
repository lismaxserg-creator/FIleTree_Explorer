/**
 * TreeNodeView component - recursively renders a single node in the file tree.
 * Displays files with icons and sizes, folders with toggle buttons and child counts.
 * Handles expansion/collapse state for folders and provides navigation links.
 */
import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { calculateFolderSize, formatBytes, isFolder } from '../utils/tree';
import styled from 'styled-components';

const TreeBranch = styled.div``;

const TreeRow = styled.div<{ $depth: number }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px 8px ${({ $depth }) => `${$depth * 18 + 10}px`};
  border: none;
  border-radius: 14px;
  background: transparent;
  color: inherit;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TreeToggle = styled.button<{ $open: boolean }>`
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: ${({ $open }) => ($open ? 'rgba(145, 179, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)')};
  color: inherit;
  cursor: pointer;
  ${({ $open }) => $open && 'padding-top: 4px;'}
  ${({ $open }) => !$open && 'padding-right: 4px;'}
`;

const TreeLink = styled(Link)`
  flex: 1;
  min-width: 0;
`;

const TreeMeta = styled.span`
  font-size: 0.9rem;
  white-space: nowrap;
  color: #abc0df;
`;

const TreeChildren = styled.div`
  display: grid;
  gap: 4px;
`;

const TreeIcon = styled.span`
  width: 30px;
  flex: 0 0 30px;
  text-align: center;
  cursor: default;
`;

interface ITreeNodeViewProps {
  node: FileTreeNode;
  path: string;
  depth: number;
}

export default function TreeNodeView({ node, path, depth }: ITreeNodeViewProps): ReactElement {
  const [open, setOpen] = useState(depth === 0) // to have the root folder expanded by default
  const encodedPath = encodeURIComponent(path);

  if (!isFolder(node)) {
    return (
      <TreeRow $depth={depth}>
        <TreeIcon>📄</TreeIcon>
        <TreeLink to={`/tree/${encodedPath}`}>
          {node.name}
        </TreeLink>
        <TreeMeta>{formatBytes(node.size)}</TreeMeta>
      </TreeRow>
    );
  }

  return (
    <TreeBranch>
      <TreeRow $depth={depth}>
        <TreeToggle
          type="button"
          $open={open}
          onClick={() => setOpen((value) => !value)}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${node.name}`}
        >
          {open ? '▼' : '▶'}
        </TreeToggle>
        <TreeLink to={`/tree/${encodedPath}`}>
          {node.name}
        </TreeLink>
        <TreeMeta>
          {node.children.length} items / {formatBytes(calculateFolderSize(node))}
        </TreeMeta>
      </TreeRow>

      {open ? (
        <TreeChildren>
          {node.children.map((child) => (
            <TreeNodeView key={`${path}/${child.name}`} node={child} path={`${path}/${child.name}`} depth={depth + 1} />
          ))}
        </TreeChildren>
      ) : null}
    </TreeBranch>
  );
}
