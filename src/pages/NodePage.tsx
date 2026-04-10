import { Link, useParams } from 'react-router-dom';
import { loadTree } from '../utils/storage';
import { calculateFolderSize, findNodeByPath, formatBytes, isFolder } from '../utils/tree';
import { ReactElement } from 'react';

export default function NodePage(): ReactElement {
  const { nodePath } = useParams();
  const tree = loadTree();

  if (!tree || !nodePath) {
    return (
      <section className="panel empty-state">
        <h2>Nothing to show</h2>
        <p>The tree is missing or the path is invalid.</p>
        <Link className="primary inline" to="/">
          Import JSON
        </Link>
      </section>
    );
  }

  const decodedPath = decodeURIComponent(nodePath);
  const node = findNodeByPath(tree, decodedPath);

  if (!node) {
    return (
      <section className="panel empty-state">
        <h2>Node not found</h2>
        <p>No node matches the path <code>{decodedPath}</code>.</p>
        <Link className="primary inline" to="/tree">
          Back to tree
        </Link>
      </section>
    );
  }

  const pathSegments = decodedPath.split('/');
  const parentPath = pathSegments.slice(0, -1).join('/');

  return (
    <section className="panel details">
      <div className="section-title">
        <h2>{isFolder(node) ? 'Folder details' : 'File details'}</h2>
        <p>
          <Link to="/tree">Tree</Link>
          {' / '}
          <code>{decodedPath}</code>
        </p>
      </div>

      <dl className="details-grid">
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
      </dl>

      {isFolder(node) ? (
        <div className="children-list">
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
        </div>
      ) : null}
    </section>
  );
}
