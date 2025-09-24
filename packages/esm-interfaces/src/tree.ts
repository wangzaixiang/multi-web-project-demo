import { IComponent } from './common';

export interface ITreeNode {
  id: string;
  label: string;
  children?: ITreeNode[];
  expanded?: boolean;
  selected?: boolean;
  icon?: string;
  data?: any;
  disabled?: boolean;
}

export interface ITreeComponent extends IComponent {
  setData(nodes: ITreeNode[]): void;
  getData(): ITreeNode[];
  getSelectedNodes(): ITreeNode[];
  getSelectedNode(): ITreeNode | null;
  selectNode(id: string): void;
  expandNode(id: string): void;
  collapseNode(id: string): void;
  expandAll(): void;
  collapseAll(): void;
  findNode(id: string): ITreeNode | null;
  addNode(parentId: string, node: ITreeNode): void;
  removeNode(id: string): void;
  updateNode(id: string, updates: Partial<ITreeNode>): void;
}

export interface ITreeEventData {
  node: ITreeNode;
  originalEvent?: Event;
}

export interface ITreeEvents {
  'node-click': ITreeEventData;
  'node-select': ITreeEventData;
  'node-expand': ITreeEventData;
  'node-collapse': ITreeEventData;
  'node-context-menu': ITreeEventData;
}