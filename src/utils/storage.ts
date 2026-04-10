import type { FileTreeNode } from '../types';

// Key used to store the file tree in localStorage.
const TREE_KEY = 'filetree-explorer.tree';

/**
 * Loads the file tree from localStorage.
 * @returns The parsed FileTreeNode if available and valid, otherwise null.
 */
export function loadTree(): FileTreeNode | null {
  const raw = window.localStorage.getItem(TREE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as FileTreeNode;
  } catch {
    return null;
  }
}

/**
 * Saves the file tree to localStorage or removes it if null.
 * @param tree - The tree to save, or null to remove.
 */
export function saveTree(tree: FileTreeNode | null): void {
  if (!tree) {
    window.localStorage.removeItem(TREE_KEY);
    return;
  }

  window.localStorage.setItem(TREE_KEY, JSON.stringify(tree));
}
