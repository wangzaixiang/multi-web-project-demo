import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property, state, query } from '@demo/lit-all';
import type { IResourceNode, ITreeNode } from '@demo/interfaces';
import { ResourceService } from '../../services/resource-service';
import '@demo/h2-extra';
import '@demo/h2-core';

@customElement('o2-resource-tree')
export class O2ResourceTree extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    
    .resource-tree {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      padding: 8px;
      border-bottom: 1px solid var(--o2-resource-border-color, #e0e0e0);
      background: var(--o2-resource-toolbar-bg, #f8f9fa);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .tree-container {
      flex: 1;
      overflow: auto;
      padding: 8px;
    }
    
    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid var(--o2-resource-border-color, #e0e0e0);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 150px;
    }
    
    .context-menu-item {
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .context-menu-item:hover {
      background: var(--o2-resource-hover-bg, #f8f9fa);
    }
    
    .context-menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .context-menu-separator {
      height: 1px;
      background: var(--o2-resource-border-color, #e0e0e0);
      margin: 4px 0;
    }
    
    .loading {
      padding: 20px;
      text-align: center;
      color: var(--o2-resource-text-muted, #666);
    }
    
    .error {
      padding: 20px;
      text-align: center;
      color: var(--o2-resource-error-color, #dc3545);
    }
    
    h2-dialog .property-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 300px;
    }
    
    .dialog-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  `;

  @property({ type: Boolean })
  showToolbar = true;

  @property({ type: Boolean })
  editable = true;

  @state()
  private _resourceData: ITreeNode[] = [];

  @state()
  private _loading = false;

  @state()
  private _error = '';

  @state()
  private _contextMenu: { x: number; y: number; node: IResourceNode } | null = null;

  @state()
  private _showCreateDialog = false;

  @state()
  private _showPropertiesDialog = false;

  @state()
  private _selectedNode: IResourceNode | null = null;

  @query('h2-tree')
  private _tree!: any;

  @query('.create-dialog')
  private _createDialog!: any;

  @query('.properties-dialog')
  private _propertiesDialog!: any;

  private _resourceService = new ResourceService();

  connectedCallback() {
    super.connectedCallback();
    this._loadResources();
    document.addEventListener('click', this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
  }

  render() {
    return html`
      <div class="resource-tree">
        ${this.showToolbar ? this._renderToolbar() : ''}
        
        <div class="tree-container">
          ${this._loading ? html`
            <div class="loading">Loading resources...</div>
          ` : this._error ? html`
            <div class="error">${this._error}</div>
          ` : html`
            <h2-tree 
              .data="${this._resourceData}"
              @node-click="${this._handleNodeClick}"
              @node-context-menu="${this._handleNodeContextMenu}"
              @node-select="${this._handleNodeSelect}"
            ></h2-tree>
          `}
        </div>
        
        ${this._contextMenu ? this._renderContextMenu() : ''}
        ${this._renderDialogs()}
      </div>
    `;
  }

  private _renderToolbar() {
    return html`
      <div class="toolbar">
        <h2-button 
          variant="primary" 
          @h2-click="${this._handleRefresh}"
          title="Refresh"
        >
          🔄 Refresh
        </h2-button>
        
        ${this.editable ? html`
          <h2-button 
            variant="secondary"
            @h2-click="${this._handleCreateFolder}"
            title="Create Folder"
          >
            📁 New Folder
          </h2-button>
          
          <h2-button 
            variant="secondary"
            @h2-click="${this._handleCreateDataSource}"
            title="Create Data Source"
          >
            🗄️ New Data Source
          </h2-button>
        ` : ''}
      </div>
    `;
  }

  private _renderContextMenu() {
    if (!this._contextMenu) return '';
    
    const { x, y, node } = this._contextMenu;
    
    return html`
      <div 
        class="context-menu"
        style="left: ${x}px; top: ${y}px"
        @click="${this._stopPropagation}"
      >
        <div class="context-menu-item" @click="${() => this._handleViewProperties(node)}">
          Properties
        </div>
        
        ${this.editable ? html`
          <div class="context-menu-separator"></div>
          
          <div class="context-menu-item" @click="${() => this._handleRename(node)}">
            Rename
          </div>
          
          ${node.type === 'folder' ? html`
            <div class="context-menu-item" @click="${() => this._handleCreateInFolder(node)}">
              Create Child
            </div>
          ` : ''}
          
          <div class="context-menu-item" @click="${() => this._handleCopy(node)}">
            Copy
          </div>
          
          <div class="context-menu-item" @click="${() => this._handleMove(node)}">
            Move
          </div>
          
          <div class="context-menu-separator"></div>
          
          <div class="context-menu-item" @click="${() => this._handleDelete(node)}">
            Delete
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderDialogs() {
    return html`
      <h2-dialog 
        class="create-dialog"
        title="Create Resource"
        ?open="${this._showCreateDialog}"
        @h2-dialog-close="${() => this._showCreateDialog = false}"
      >
        <div class="property-form">
          <h2-input 
            label="Name" 
            id="create-name"
            placeholder="Enter resource name"
          ></h2-input>
          
          <h2-select 
            label="Type"
            id="create-type"
            .options="${[
              { value: 'folder', label: 'Folder' },
              { value: 'datasource', label: 'Data Source' },
              { value: 'sql_view', label: 'SQL View' },
              { value: 'java_view', label: 'Java View' },
              { value: 'cube', label: 'Cube' },
              { value: 'dashboard', label: 'Dashboard' }
            ]}"
          ></h2-select>
        </div>
        
        <div slot="footer" class="dialog-buttons">
          <h2-button 
            variant="secondary"
            @h2-click="${() => this._showCreateDialog = false}"
          >
            Cancel
          </h2-button>
          <h2-button 
            variant="primary"
            @h2-click="${this._handleCreateConfirm}"
          >
            Create
          </h2-button>
        </div>
      </h2-dialog>

      <h2-dialog 
        class="properties-dialog"
        title="Resource Properties"
        ?open="${this._showPropertiesDialog}"
        @h2-dialog-close="${() => this._showPropertiesDialog = false}"
      >
        ${this._selectedNode ? html`
          <div class="property-form">
            <h2-input 
              label="ID" 
              .value="${this._selectedNode.id}"
              readonly
            ></h2-input>
            
            <h2-input 
              label="Name" 
              id="prop-name"
              .value="${this._selectedNode.name}"
            ></h2-input>
            
            <h2-input 
              label="Type" 
              .value="${this._selectedNode.type}"
              readonly
            ></h2-input>
            
            <h2-input 
              label="Parent ID" 
              .value="${this._selectedNode.parentId || 'None'}"
              readonly
            ></h2-input>
          </div>
          
          <div slot="footer" class="dialog-buttons">
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._showPropertiesDialog = false}"
            >
              Cancel
            </h2-button>
            <h2-button 
              variant="primary"
              @h2-click="${this._handlePropertiesConfirm}"
            >
              Save
            </h2-button>
          </div>
        ` : ''}
      </h2-dialog>
    `;
  }

  private async _loadResources() {
    this._loading = true;
    this._error = '';
    
    try {
      const resources = this._resourceService.getRootResources();
      this._resourceData = this._convertToTreeNodes(resources);
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to load resources';
    } finally {
      this._loading = false;
    }
  }

  private _convertToTreeNodes(resources: IResourceNode[]): ITreeNode[] {
    return resources.map(resource => ({
      id: resource.id,
      label: resource.name,
      icon: this._getResourceIcon(resource.type),
      data: resource,
      children: resource.children ? this._convertToTreeNodes(resource.children) : undefined,
      expanded: resource.type === 'folder'
    }));
  }

  private _getResourceIcon(type: IResourceNode['type']): string {
    const icons = {
      folder: '📁',
      datasource: '🗄️',
      sql_view: '📊',
      java_view: '☕',
      cube: '🧊',
      dashboard: '📈'
    };
    return icons[type] || '📄';
  }

  private _handleNodeClick(e: CustomEvent) {
    const { node } = e.detail;
    this.dispatchEvent(new CustomEvent('resource-select', {
      detail: { resource: node.data },
      bubbles: true,
      composed: true
    }));
  }

  private _handleNodeContextMenu(e: CustomEvent) {
    const { node, originalEvent } = e.detail;
    const mouseEvent = originalEvent as MouseEvent;
    
    this._contextMenu = {
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
      node: node.data
    };
  }

  private _handleNodeSelect(e: CustomEvent) {
    const { node } = e.detail;
    this._selectedNode = node.data;
  }

  private _handleDocumentClick = (e: Event) => {
    if (!this.contains(e.target as Node)) {
      this._contextMenu = null;
    }
  };

  private _stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private _handleRefresh() {
    this._loadResources();
  }

  private _handleCreateFolder() {
    this._showCreateDialog = true;
  }

  private _handleCreateDataSource() {
    this._showCreateDialog = true;
  }

  private _handleViewProperties(node: IResourceNode) {
    this._selectedNode = node;
    this._showPropertiesDialog = true;
    this._contextMenu = null;
  }

  private _handleRename(node: IResourceNode) {
    const newName = prompt('Enter new name:', node.name);
    if (newName && newName !== node.name) {
      this._resourceService.rename(node.id, newName).then(() => {
        this._loadResources();
      }).catch(error => {
        alert('Failed to rename: ' + error.message);
      });
    }
    this._contextMenu = null;
  }

  private _handleCreateInFolder(node: IResourceNode) {
    this._selectedNode = node;
    this._showCreateDialog = true;
    this._contextMenu = null;
  }

  private _handleCopy(node: IResourceNode) {
    const targetId = prompt('Enter target folder ID:');
    if (targetId) {
      this._resourceService.copy(node.id, targetId).then(() => {
        this._loadResources();
      }).catch(error => {
        alert('Failed to copy: ' + error.message);
      });
    }
    this._contextMenu = null;
  }

  private _handleMove(node: IResourceNode) {
    const targetId = prompt('Enter target folder ID:');
    if (targetId) {
      this._resourceService.move(node.id, targetId).then(() => {
        this._loadResources();
      }).catch(error => {
        alert('Failed to move: ' + error.message);
      });
    }
    this._contextMenu = null;
  }

  private _handleDelete(node: IResourceNode) {
    if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
      this._resourceService.delete(node.id).then(() => {
        this._loadResources();
      }).catch(error => {
        alert('Failed to delete: ' + error.message);
      });
    }
    this._contextMenu = null;
  }

  private async _handleCreateConfirm() {
    const nameInput = this.shadowRoot?.querySelector('#create-name') as any;
    const typeSelect = this.shadowRoot?.querySelector('#create-type') as any;
    
    const name = nameInput?.value;
    const type = typeSelect?.value;
    
    if (!name || !type) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const parentId = this._selectedNode?.id || 'root';
      await this._resourceService.createResource(parentId, type, name);
      this._showCreateDialog = false;
      this._loadResources();
    } catch (error) {
      alert('Failed to create resource: ' + (error as Error).message);
    }
  }

  private async _handlePropertiesConfirm() {
    if (!this._selectedNode) return;
    
    const nameInput = this.shadowRoot?.querySelector('#prop-name') as any;
    const newName = nameInput?.value;
    
    if (newName && newName !== this._selectedNode.name) {
      try {
        await this._resourceService.rename(this._selectedNode.id, newName);
        this._showPropertiesDialog = false;
        this._loadResources();
      } catch (error) {
        alert('Failed to update properties: ' + (error as Error).message);
      }
    } else {
      this._showPropertiesDialog = false;
    }
  }

  async refresh() {
    await this._loadResources();
  }

  getSelectedResource(): IResourceNode | null {
    return this._selectedNode;
  }
}