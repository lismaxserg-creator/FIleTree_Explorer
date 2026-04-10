import type { FileTreeNode } from '../types';

const TREE_KEY = 'filetree-explorer.tree';

export function loadTree(): FileTreeNode | null {
  const raw = window.localStorage.getItem(TREE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FileTreeNode;
  } catch {
    return null;
  }
}

export function saveTree(tree: FileTreeNode | null): void {
  if (!tree) {
    window.localStorage.removeItem(TREE_KEY);
    return;
  }

  window.localStorage.setItem(TREE_KEY, JSON.stringify(tree));
}
