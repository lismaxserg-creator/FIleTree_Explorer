import type { FileTreeNode, FolderNode, IndexedNode } from '../types';

// Number of bytes in a kilobyte.
const BYTES_PER_KB = 1024;

// Threshold for rounding to integer vs one decimal place.
const DECIMAL_THRESHOLD = 10;

/**
 * Checks if a given node is a folder.
 * @param node - The node to check.
 * @returns True if the node is a folder, false otherwise.
 */
export function isFolder(node: FileTreeNode): node is FolderNode {
  return node.type === 'folder';
}

/**
 * Validates and constructs a FileTreeNode from an unknown value.
 * Throws an error if the value does not represent a valid tree node.
 * @param value - The value to validate and convert.
 * @returns A valid FileTreeNode.
 * @throws Error if validation fails.
 */
export function validateTreeNode(value: unknown): FileTreeNode {
  if (!value || typeof value !== 'object') {
    throw new Error('JSON must describe an object tree node.');
  }

  const node = value as Record<string, unknown>;

  if (typeof node.name !== 'string' || !node.name.trim()) {
    throw new Error('Each node must have a non-empty string "name".');
  }

  // Handle file nodes
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

  // Handle folder nodes
  if (node.type === 'folder') {
    if (!Array.isArray(node.children)) {
      throw new Error('Folder nodes must contain a "children" array.');
    }

    return {
      name: node.name,
      type: 'folder',
      children: node.children.map(validateTreeNode), // Recursively validate children
    };
  }

  throw new Error('Node type must be either "file" or "folder".');
}

/**
 * Builds a path string by combining parent path and name.
 * @param parentPath - The parent path.
 * @param name - The name to append.
 * @returns The combined path.
 */
export function buildPath(parentPath: string, name: string): string {
  return parentPath ? `${parentPath}/${name}` : name;
}

/**
 * Splits a path into segments, trimming and filtering empty parts.
 * @param path - The path to split.
 * @returns An array of path segments.
 */
export function getNodePathSegments(path: string): string[] {
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

/**
 * Indexes the entire tree, creating an array of IndexedNode entries.
 * Each entry includes the node, its full path, and path segments.
 * @param node - The root node to index.
 * @param parentPath - The parent path (used recursively).
 * @returns An array of IndexedNode.
 */
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

/**
 * Finds a node in the tree by its path.
 * @param root - The root node of the tree.
 * @param path - The path to the target node.
 * @returns The found node or null if not found.
 */
export function findNodeByPath(root: FileTreeNode, path: string): FileTreeNode | null {
  const segments = getNodePathSegments(path);

  if (segments.length === 0) {
    return null;
  }

  let current: FileTreeNode | null = root;

  for (let index = 0; index < segments.length; index += 1) {
    if (!current || current.name !== segments[index]) {
      return null;
    }

    if (index === segments.length - 1) {
      return current; // Found the target node
    }

    if (!isFolder(current)) {
      return null; // Cannot traverse into a file
    }

    current = current.children.find((child) => child.name === segments[index + 1]) || null;
  }

  return current;
}

/**
 * Calculates the total size of a folder by summing sizes of all files recursively.
 * @param node - The node to calculate size for.
 * @returns The total size in bytes.
 */
export function calculateFolderSize(node: FileTreeNode): number {
  if (!isFolder(node)) {
    return node.size;
  }

  return node.children.reduce((sum, child) => sum + calculateFolderSize(child), 0);
}

/**
 * Formats a size in bytes to a human-readable string (B, KB, MB).
 * @param size - The size in bytes.
 * @returns The formatted size string.
 */
export function formatBytes(size: number): string {
  if (size < BYTES_PER_KB) {
    return `${size} B`;
  }
  const kb = size / BYTES_PER_KB;

  if (kb < BYTES_PER_KB) {
    return `${round(kb)} KB`;
  }

  return `${round(kb / BYTES_PER_KB)} MB`;
}

/**
 * Rounds a number for display: integers or one decimal place for small values.
 * @param value - The number to round.
 * @returns The rounded value as a string.
 */
function round(value: number): string {
  const isLargeOrInteger = value >= DECIMAL_THRESHOLD || Number.isInteger(value);
  const rounded = isLargeOrInteger ? Math.round(value) : Math.round(value * DECIMAL_THRESHOLD) / DECIMAL_THRESHOLD;

  return String(rounded);
}

/**
 * Searches the tree for nodes matching a query in name or path.
 * @param root - The root node of the tree.
 * @param query - The search query.
 * @returns An array of matching IndexedNode.
 */
export function searchTree(root: FileTreeNode, query: string): IndexedNode[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return indexTree(root).filter(({ node, path }) => {
    return node.name.toLowerCase().includes(normalized) || path.toLowerCase().includes(normalized);
  });
}

/**
 * Gets the direct children of a node. Returns empty array for files.
 * @param node - The node to get children from.
 * @returns An array of direct children.
 */
export function getDirectChildren(node: FileTreeNode): FileTreeNode[] {
  return isFolder(node) ? node.children : [];
}
