import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property, state } from '@esm/lit-all';
import type { ITreeNode, ITreeComponent, ITreeEventData } from '@esm/interfaces';

@customElement('h2-tree')
export class H2Tree extends LitElement implements ITreeComponent {
  static styles = css`
    :host {
      display: block;
      font-family: var(--h2-tree-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    }
    
    .tree {
      padding: 8px;
    }
    
    .tree-node {
      margin: 2px 0;
    }
    
    .node-content {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      user-select: none;
      transition: background-color 0.2s;
    }
    
    .node-content:hover {
      background-color: var(--h2-tree-hover-bg, #f8f9fa);
    }
    
    .node-content.selected {
      background-color: var(--h2-tree-selected-bg, #007bff);
      color: var(--h2-tree-selected-color, white);
    }
    
    .node-content.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .expand-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .expand-icon.expanded {
      transform: rotate(90deg);
    }
    
    .expand-icon.empty {
      visibility: hidden;
    }
    
    .node-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      flex-shrink: 0;
    }
    
    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .children {
      margin-left: 20px;
      border-left: 1px dotted var(--h2-tree-guide-color, #ccc);
      padding-left: 8px;
    }
    
    .children.hidden {
      display: none;
    }
  `;

  @property({ type: Array })
  data: ITreeNode[] = [];

  @state()
  private _selectedNodeIds = new Set<string>();

  @state()
  private _expandedNodeIds = new Set<string>();

  render() {
    return html`
      <div class="tree">
        ${this.data.map(node => this._renderNode(node))}
      </div>
    `;
  }

  private _renderNode(node: ITreeNode, level = 0): any {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this._expandedNodeIds.has(node.id) || node.expanded;
    const isSelected = this._selectedNodeIds.has(node.id) || node.selected;

    return html`
      <div class="tree-node">
        <div 
          class="node-content ${isSelected ? 'selected' : ''} ${node.disabled ? 'disabled' : ''}"
          @click="${(e: Event) => this._handleNodeClick(node, e)}"
          @contextmenu="${(e: Event) => this._handleContextMenu(node, e)}"
        >
          <div 
            class="expand-icon ${hasChildren ? (isExpanded ? 'expanded' : '') : 'empty'}"
            @click="${(e: Event) => this._handleExpandClick(node, e)}"
          >
            ${hasChildren ? '▶' : ''}
          </div>
          
          ${node.icon ? html`
            <div class="node-icon">${node.icon}</div>
          ` : ''}
          
          <div class="node-label" title="${node.label}">
            ${node.label}
          </div>
        </div>
        
        ${hasChildren ? html`
          <div class="children ${!isExpanded ? 'hidden' : ''}">
            ${node.children!.map(child => this._renderNode(child, level + 1))}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _handleNodeClick(node: ITreeNode, e: Event) {
    if (node.disabled) return;
    
    e.stopPropagation();
    this.selectNode(node.id);
    
    const eventData: ITreeEventData = { node, originalEvent: e };
    
    this.dispatchEvent(new CustomEvent('node-click', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
    
    this.dispatchEvent(new CustomEvent('node-select', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }

  private _handleExpandClick(node: ITreeNode, e: Event) {
    e.stopPropagation();
    
    if (this._expandedNodeIds.has(node.id)) {
      this.collapseNode(node.id);
    } else {
      this.expandNode(node.id);
    }
  }

  private _handleContextMenu(node: ITreeNode, e: Event) {
    if (node.disabled) return;
    
    e.preventDefault();
    
    this.dispatchEvent(new CustomEvent('node-context-menu', {
      detail: { node, originalEvent: e },
      bubbles: true,
      composed: true
    }));
  }

  setData(nodes: ITreeNode[]): void {
    this.data = [...nodes];
    this._selectedNodeIds.clear();
    this._expandedNodeIds.clear();
    
    this._initializeExpandedNodes(nodes);
  }

  getData(): ITreeNode[] {
    return [...this.data];
  }

  getSelectedNodes(): ITreeNode[] {
    const selected: ITreeNode[] = [];
    this._findSelectedNodes(this.data, selected);
    return selected;
  }

  getSelectedNode(): ITreeNode | null {
    const selected = this.getSelectedNodes();
    return selected.length > 0 ? selected[0] : null;
  }

  selectNode(id: string): void {
    this._selectedNodeIds.clear();
    this._selectedNodeIds.add(id);
    this.requestUpdate();
  }

  expandNode(id: string): void {
    this._expandedNodeIds.add(id);
    
    const node = this.findNode(id);
    if (node) {
      this.dispatchEvent(new CustomEvent('node-expand', {
        detail: { node },
        bubbles: true,
        composed: true
      }));
    }
    
    this.requestUpdate();
  }

  collapseNode(id: string): void {
    this._expandedNodeIds.delete(id);
    
    const node = this.findNode(id);
    if (node) {
      this.dispatchEvent(new CustomEvent('node-collapse', {
        detail: { node },
        bubbles: true,
        composed: true
      }));
    }
    
    this.requestUpdate();
  }

  expandAll(): void {
    this._expandAllNodes(this.data);
    this.requestUpdate();
  }

  collapseAll(): void {
    this._expandedNodeIds.clear();
    this.requestUpdate();
  }

  findNode(id: string): ITreeNode | null {
    return this._findNodeById(this.data, id);
  }

  addNode(parentId: string, node: ITreeNode): void {
    const parent = this.findNode(parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      this.requestUpdate();
    }
  }

  removeNode(id: string): void {
    this._removeNodeFromTree(this.data, id);
    this._selectedNodeIds.delete(id);
    this._expandedNodeIds.delete(id);
    this.requestUpdate();
  }

  updateNode(id: string, updates: Partial<ITreeNode>): void {
    const node = this.findNode(id);
    if (node) {
      Object.assign(node, updates);
      this.requestUpdate();
    }
  }


  destroy(): void {
    this.data = [];
    this._selectedNodeIds.clear();
    this._expandedNodeIds.clear();
  }

  private _initializeExpandedNodes(nodes: ITreeNode[]) {
    for (const node of nodes) {
      if (node.expanded) {
        this._expandedNodeIds.add(node.id);
      }
      if (node.children) {
        this._initializeExpandedNodes(node.children);
      }
    }
  }

  private _findSelectedNodes(nodes: ITreeNode[], selected: ITreeNode[]) {
    for (const node of nodes) {
      if (this._selectedNodeIds.has(node.id)) {
        selected.push(node);
      }
      if (node.children) {
        this._findSelectedNodes(node.children, selected);
      }
    }
  }

  private _findNodeById(nodes: ITreeNode[], id: string): ITreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this._findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private _expandAllNodes(nodes: ITreeNode[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        this._expandedNodeIds.add(node.id);
        this._expandAllNodes(node.children);
      }
    }
  }

  private _removeNodeFromTree(nodes: ITreeNode[], id: string): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && this._removeNodeFromTree(nodes[i].children!, id)) {
        return true;
      }
    }
    return false;
  }
}