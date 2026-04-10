import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { calculateFolderSize, formatBytes, isFolder } from '../utils/tree';

interface ITreeNodeViewProps {
  node: FileTreeNode;
  path: string;
  depth: number;
}

export default function TreeNodeView({ node, path, depth }: ITreeNodeViewProps): ReactElement {
  const [open, setOpen] = useState(depth === 0);
  const encodedPath = encodeURIComponent(path);
  const paddingLeft = `${depth * 18}px`;

  if (!isFolder(node)) {
    return (
      <div className="tree-row file-row" style={{ paddingLeft }}>
        <span className="tree-icon file">-</span>
        <Link to={`/tree/${encodedPath}`} className="tree-link">
          {node.name}
        </Link>
        <span className="tree-meta">{formatBytes(node.size)}</span>
      </div>
    );
  }

  return (
    <div className="tree-branch">
      <div className="tree-row folder-row" style={{ paddingLeft }}>
        <button
          type="button"
          className={`tree-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen((value) => !value)}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${node.name}`}
        >
          {open ? '-' : '+'}
        </button>
        <Link to={`/tree/${encodedPath}`} className="tree-link">
          {node.name}
        </Link>
        <span className="tree-meta">
          {node.children.length} items / {formatBytes(calculateFolderSize(node))}
        </span>
      </div>

      {open ? (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNodeView key={`${path}/${child.name}`} node={child} path={`${path}/${child.name}`} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
