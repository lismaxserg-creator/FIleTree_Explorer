export type FileTreeNode = FileNode | FolderNode;

export interface BaseNode {
  name: string;
  type: 'file' | 'folder';
}

export interface FileNode extends BaseNode {
  type: 'file';
  size: number;
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  children: FileTreeNode[];
}

export interface IndexedNode {
  node: FileTreeNode;
  path: string;
  segments: string[];
}
