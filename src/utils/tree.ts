import type { FileTreeNode, FolderNode, IndexedNode } from '../types';

export function isFolder(node: FileTreeNode): node is FolderNode {
  return node.type === 'folder';
}

export function validateTreeNode(value: unknown): FileTreeNode {
  if (!value || typeof value !== 'object') {
    throw new Error('JSON must describe an object tree node.');
  }

  const node = value as Record<string, unknown>;

  if (typeof node.name !== 'string' || !node.name.trim()) {
    throw new Error('Each node must have a non-empty string "name".');
  }

  if (node.type === 'file') {
    if (typeof node.size !== 'number' || !Number.isFinite(node.size) || node.size < 0) {
      throw new Error('File nodes must contain a non-negative numeric "size".');
    }

    return {
      name: node.name,
      type: 'file',
      size: node.size,
    };
  }

  if (node.type === 'folder') {
    if (!Array.isArray(node.children)) {
      throw new Error('Folder nodes must contain a "children" array.');
    }

    return {
      name: node.name,
      type: 'folder',
      children: node.children.map(validateTreeNode),
    };
  }

  throw new Error('Node type must be either "file" or "folder".');
}

export function buildPath(parentPath: string, name: string): string {
  return parentPath ? `${parentPath}/${name}` : name;
}

export function getNodePathSegments(path: string): string[] {
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function indexTree(node: FileTreeNode, parentPath = ''): IndexedNode[] {
  const path = buildPath(parentPath, node.name);
  const entry: IndexedNode = {
    node,
    path,
    segments: getNodePathSegments(path),
  };

  if (!isFolder(node)) {
    return [entry];
  }

  return [entry, ...node.children.flatMap((child) => indexTree(child, path))];
}

export function findNodeByPath(root: FileTreeNode, path: string): FileTreeNode | null {
  const segments = getNodePathSegments(path);
  if (segments.length === 0) return null;

  let current: FileTreeNode | null = root;

  for (let index = 0; index < segments.length; index += 1) {
    if (!current || current.name !== segments[index]) {
      return null;
    }

    if (index === segments.length - 1) {
      return current;
    }

    if (!isFolder(current)) {
      return null;
    }

    current = current.children.find((child) => child.name === segments[index + 1]) ?? null;
  }

  return current;
}

export function calculateFolderSize(node: FileTreeNode): number {
  if (!isFolder(node)) return node.size;
  return node.children.reduce((sum, child) => sum + calculateFolderSize(child), 0);
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${round(kb)} KB`;
  return `${round(kb / 1024)} MB`;
}

function round(value: number): string {
  return value >= 10 || Number.isInteger(value) ? String(Math.round(value)) : String(Math.round(value * 10) / 10);
}

export function searchTree(root: FileTreeNode, query: string): IndexedNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return indexTree(root).filter(({ node, path }) => {
    return node.name.toLowerCase().includes(normalized) || path.toLowerCase().includes(normalized);
  });
}

export function getDirectChildren(node: FileTreeNode): FileTreeNode[] {
  return isFolder(node) ? node.children : [];
}
