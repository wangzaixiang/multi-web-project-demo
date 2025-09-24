import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property, state } from '@demo/lit-all';
import type { IDataSourceViewer, IDataSourceConfig, ISchemaInfo } from '@demo/interfaces';
import '@demo/h2-core';
import '@demo/h2-extra';

@customElement('o2-datasource-viewer')
export class O2DataSourceViewer extends LitElement implements IDataSourceViewer {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    
    .viewer {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      padding: 12px;
      border-bottom: 1px solid var(--o2-ds-border-color, #e0e0e0);
      background: var(--o2-ds-toolbar-bg, #f8f9fa);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    
    .schema-panel {
      width: 300px;
      border-right: 1px solid var(--o2-ds-border-color, #e0e0e0);
      overflow-y: auto;
      padding: 12px;
    }
    
    .data-panel {
      flex: 1;
      padding: 12px;
      overflow: hidden;
    }
    
    .connection-info {
      background: var(--o2-ds-info-bg, #e3f2fd);
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    
    .status {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .status.connected {
      color: var(--o2-ds-success-color, #28a745);
    }
    
    .status.disconnected {
      color: var(--o2-ds-error-color, #dc3545);
    }
    
    .loading {
      padding: 40px;
      text-align: center;
      color: var(--o2-ds-muted-color, #666);
    }
    
    .error {
      padding: 40px;
      text-align: center;
      color: var(--o2-ds-error-color, #dc3545);
    }
  `;

  @property({ type: Object })
  data: IDataSourceConfig | null = null;

  @property({ type: Boolean })
  readOnly = false;

  @state()
  private _schema: ISchemaInfo | null = null;

  @state()
  private _connected = false;

  @state()
  private _loading = false;

  @state()
  private _error = '';

  @state()
  private _previewData: any[] = [];

  render() {
    return html`
      <div class="viewer">
        <div class="toolbar">
          <h2-button 
            variant="primary"
            @h2-click="${this._handleTestConnection}"
            ?disabled="${!this.data || this._loading}"
          >
            Test Connection
          </h2-button>
          
          <h2-button 
            variant="secondary"
            @h2-click="${this._handleRefreshSchema}"
            ?disabled="${!this._connected || this._loading}"
          >
            Refresh Schema
          </h2-button>
          
          <h2-button 
            variant="secondary"
            @h2-click="${this._handlePreviewData}"
            ?disabled="${!this._connected || this._loading}"
          >
            Preview Data
          </h2-button>
        </div>
        
        <div class="content">
          <div class="schema-panel">
            ${this._renderConnectionInfo()}
            ${this._renderSchema()}
          </div>
          
          <div class="data-panel">
            ${this._renderDataPreview()}
          </div>
        </div>
      </div>
    `;
  }

  private _renderConnectionInfo() {
    if (!this.data) return '';
    
    return html`
      <div class="connection-info">
        <div><strong>Name:</strong> ${this.data.name}</div>
        <div><strong>Type:</strong> ${this.data.type}</div>
        <div><strong>Host:</strong> ${this.data.host}:${this.data.port}</div>
        <div><strong>Database:</strong> ${this.data.database}</div>
        <div class="status ${this._connected ? 'connected' : 'disconnected'}">
          <strong>Status:</strong> ${this._connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
    `;
  }

  private _renderSchema() {
    if (this._loading) {
      return html`<div class="loading">Loading schema...</div>`;
    }
    
    if (this._error) {
      return html`<div class="error">${this._error}</div>`;
    }
    
    if (!this._schema) {
      return html`<div class="loading">No schema loaded</div>`;
    }
    
    return html`
      <h2-tree 
        .data="${this._convertSchemaToTree()}"
        @node-click="${this._handleSchemaNodeClick}"
      ></h2-tree>
    `;
  }

  private _renderDataPreview() {
    if (this._previewData.length === 0) {
      return html`<div class="loading">No data preview available</div>`;
    }
    
    const columns = Object.keys(this._previewData[0]).map(key => ({
      key,
      title: key,
      width: 150
    }));
    
    return html`
      <h2-datagrid
        .columns="${columns}"
        .data="${this._previewData}"
        .options="${{ pagination: true, pageSize: 50 }}"
      ></h2-datagrid>
    `;
  }

  private _convertSchemaToTree() {
    if (!this._schema) return [];
    
    return [
      {
        id: 'tables',
        label: `Tables (${this._schema.tables.length})`,
        icon: '📊',
        expanded: true,
        children: this._schema.tables.map(table => ({
          id: `table-${table.name}`,
          label: table.name,
          icon: '📋',
          data: { type: 'table', table },
          children: table.columns.map(column => ({
            id: `column-${table.name}-${column.name}`,
            label: `${column.name} (${column.type})`,
            icon: column.nullable ? '🔵' : '🔴',
            data: { type: 'column', column }
          }))
        }))
      },
      {
        id: 'views',
        label: `Views (${this._schema.views.length})`,
        icon: '👁️',
        expanded: true,
        children: this._schema.views.map(view => ({
          id: `view-${view.name}`,
          label: view.name,
          icon: '👁️',
          data: { type: 'view', view }
        }))
      }
    ];
  }

  private async _handleTestConnection() {
    this._loading = true;
    this._error = '';
    
    try {
      const connected = await this.testConnection();
      this._connected = connected;
      
      if (connected) {
        await this._loadSchema();
      }
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Connection failed';
      this._connected = false;
    } finally {
      this._loading = false;
    }
  }

  private async _handleRefreshSchema() {
    await this._loadSchema();
  }

  private async _handlePreviewData() {
    if (!this._schema || this._schema.tables.length === 0) return;
    
    try {
      const firstTable = this._schema.tables[0];
      this._previewData = await this.previewData(10);
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to preview data';
    }
  }

  private _handleSchemaNodeClick(e: CustomEvent) {
    const { node } = e.detail;
    
    this.dispatchEvent(new CustomEvent('schema-item-select', {
      detail: { item: node.data },
      bubbles: true,
      composed: true
    }));
  }

  private async _loadSchema() {
    this._loading = true;
    this._error = '';
    
    try {
      this._schema = await this.getSchema();
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to load schema';
    } finally {
      this._loading = false;
    }
  }

  async load(data: IDataSourceConfig): Promise<void> {
    this.data = data;
    this._connected = false;
    this._schema = null;
    this._previewData = [];
    this._error = '';
  }

  async refresh(): Promise<void> {
    if (this._connected) {
      await this._loadSchema();
    }
  }

  getViewData(): IDataSourceConfig {
    if (!this.data) {
      throw new Error('No data source configuration loaded');
    }
    return this.data;
  }

  setReadOnly(readOnly: boolean): void {
    this.readOnly = readOnly;
  }

  isReadOnly(): boolean {
    return this.readOnly;
  }

  async testConnection(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.3;
  }

  async getSchema(): Promise<ISchemaInfo> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false },
            { name: 'name', type: 'VARCHAR(255)', nullable: false },
            { name: 'email', type: 'VARCHAR(255)', nullable: true }
          ],
          primaryKeys: ['id'],
          foreignKeys: []
        },
        {
          name: 'orders',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false },
            { name: 'user_id', type: 'INTEGER', nullable: false },
            { name: 'total', type: 'DECIMAL(10,2)', nullable: false }
          ],
          primaryKeys: ['id'],
          foreignKeys: [
            { name: 'fk_user', columns: ['user_id'], referencedTable: 'users', referencedColumns: ['id'] }
          ]
        }
      ],
      views: [
        {
          name: 'user_orders',
          definition: 'SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id',
          columns: [
            { name: 'name', type: 'VARCHAR(255)', nullable: false },
            { name: 'order_count', type: 'INTEGER', nullable: false }
          ]
        }
      ]
    };
  }

  async previewData(limit = 10): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      created_at: new Date().toISOString()
    }));
  }


  destroy(): void {
    this.data = null;
    this._schema = null;
    this._previewData = [];
    this._connected = false;
  }
}