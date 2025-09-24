import { LitElement as m, html as r, css as v, property as u, state as d, customElement as _ } from "@esm/lit-all";
import "@esm/h2-core";
import "@esm/h2-extra";
var y = Object.defineProperty, f = Object.getOwnPropertyDescriptor, l = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? f(t, i) : t, h = e.length - 1, c; h >= 0; h--)
    (c = e[h]) && (a = (o ? c(t, i, a) : c(a)) || a);
  return o && a && y(t, i, a), a;
};
let s = class extends m {
  constructor() {
    super(...arguments), this.data = null, this.readOnly = !1, this._schema = null, this._connected = !1, this._loading = !1, this._error = "", this._previewData = [];
  }
  render() {
    return r`
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
  _renderConnectionInfo() {
    return this.data ? r`
      <div class="connection-info">
        <div><strong>Name:</strong> ${this.data.name}</div>
        <div><strong>Type:</strong> ${this.data.type}</div>
        <div><strong>Host:</strong> ${this.data.host}:${this.data.port}</div>
        <div><strong>Database:</strong> ${this.data.database}</div>
        <div class="status ${this._connected ? "connected" : "disconnected"}">
          <strong>Status:</strong> ${this._connected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>
    ` : "";
  }
  _renderSchema() {
    return this._loading ? r`<div class="loading">Loading schema...</div>` : this._error ? r`<div class="error">${this._error}</div>` : this._schema ? r`
      <h2-tree 
        .data="${this._convertSchemaToTree()}"
        @node-click="${this._handleSchemaNodeClick}"
      ></h2-tree>
    ` : r`<div class="loading">No schema loaded</div>`;
  }
  _renderDataPreview() {
    if (this._previewData.length === 0)
      return r`<div class="loading">No data preview available</div>`;
    const e = Object.keys(this._previewData[0]).map((t) => ({
      key: t,
      title: t,
      width: 150
    }));
    return r`
      <h2-datagrid
        .columns="${e}"
        .data="${this._previewData}"
        .options="${{ pagination: !0, pageSize: 50 }}"
      ></h2-datagrid>
    `;
  }
  _convertSchemaToTree() {
    return this._schema ? [
      {
        id: "tables",
        label: `Tables (${this._schema.tables.length})`,
        icon: "📊",
        expanded: !0,
        children: this._schema.tables.map((e) => ({
          id: `table-${e.name}`,
          label: e.name,
          icon: "📋",
          data: { type: "table", table: e },
          children: e.columns.map((t) => ({
            id: `column-${e.name}-${t.name}`,
            label: `${t.name} (${t.type})`,
            icon: t.nullable ? "🔵" : "🔴",
            data: { type: "column", column: t }
          }))
        }))
      },
      {
        id: "views",
        label: `Views (${this._schema.views.length})`,
        icon: "👁️",
        expanded: !0,
        children: this._schema.views.map((e) => ({
          id: `view-${e.name}`,
          label: e.name,
          icon: "👁️",
          data: { type: "view", view: e }
        }))
      }
    ] : [];
  }
  async _handleTestConnection() {
    this._loading = !0, this._error = "";
    try {
      const e = await this.testConnection();
      this._connected = e, e && await this._loadSchema();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "Connection failed", this._connected = !1;
    } finally {
      this._loading = !1;
    }
  }
  async _handleRefreshSchema() {
    await this._loadSchema();
  }
  async _handlePreviewData() {
    if (!(!this._schema || this._schema.tables.length === 0))
      try {
        const e = this._schema.tables[0];
        this._previewData = await this.previewData(10);
      } catch (e) {
        this._error = e instanceof Error ? e.message : "Failed to preview data";
      }
  }
  _handleSchemaNodeClick(e) {
    const { node: t } = e.detail;
    this.dispatchEvent(new CustomEvent("schema-item-select", {
      detail: { item: t.data },
      bubbles: !0,
      composed: !0
    }));
  }
  async _loadSchema() {
    this._loading = !0, this._error = "";
    try {
      this._schema = await this.getSchema();
    } catch (e) {
      this._error = e instanceof Error ? e.message : "Failed to load schema";
    } finally {
      this._loading = !1;
    }
  }
  async load(e) {
    this.data = e, this._connected = !1, this._schema = null, this._previewData = [], this._error = "";
  }
  async refresh() {
    this._connected && await this._loadSchema();
  }
  getViewData() {
    if (!this.data)
      throw new Error("No data source configuration loaded");
    return this.data;
  }
  setReadOnly(e) {
    this.readOnly = e;
  }
  isReadOnly() {
    return this.readOnly;
  }
  async testConnection() {
    return await new Promise((e) => setTimeout(e, 1e3)), Math.random() > 0.3;
  }
  async getSchema() {
    return await new Promise((e) => setTimeout(e, 800)), {
      tables: [
        {
          name: "users",
          columns: [
            { name: "id", type: "INTEGER", nullable: !1 },
            { name: "name", type: "VARCHAR(255)", nullable: !1 },
            { name: "email", type: "VARCHAR(255)", nullable: !0 }
          ],
          primaryKeys: ["id"],
          foreignKeys: []
        },
        {
          name: "orders",
          columns: [
            { name: "id", type: "INTEGER", nullable: !1 },
            { name: "user_id", type: "INTEGER", nullable: !1 },
            { name: "total", type: "DECIMAL(10,2)", nullable: !1 }
          ],
          primaryKeys: ["id"],
          foreignKeys: [
            { name: "fk_user", columns: ["user_id"], referencedTable: "users", referencedColumns: ["id"] }
          ]
        }
      ],
      views: [
        {
          name: "user_orders",
          definition: "SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id",
          columns: [
            { name: "name", type: "VARCHAR(255)", nullable: !1 },
            { name: "order_count", type: "INTEGER", nullable: !1 }
          ]
        }
      ]
    };
  }
  async previewData(e = 10) {
    return await new Promise((t) => setTimeout(t, 500)), Array.from({ length: e }, (t, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
  }
  destroy() {
    this.data = null, this._schema = null, this._previewData = [], this._connected = !1;
  }
};
s.styles = v`
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
l([
  u({ type: Object })
], s.prototype, "data", 2);
l([
  u({ type: Boolean })
], s.prototype, "readOnly", 2);
l([
  d()
], s.prototype, "_schema", 2);
l([
  d()
], s.prototype, "_connected", 2);
l([
  d()
], s.prototype, "_loading", 2);
l([
  d()
], s.prototype, "_error", 2);
l([
  d()
], s.prototype, "_previewData", 2);
s = l([
  _("o2-datasource-viewer")
], s);
var b = Object.defineProperty, g = Object.getOwnPropertyDescriptor, p = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? g(t, i) : t, h = e.length - 1, c; h >= 0; h--)
    (c = e[h]) && (a = (o ? c(t, i, a) : c(a)) || a);
  return o && a && b(t, i, a), a;
};
let n = class extends m {
  constructor() {
    super(...arguments), this.data = {
      id: "",
      name: "",
      type: "mysql",
      host: "localhost",
      port: 3306,
      database: "",
      username: ""
    }, this.readOnly = !1, this._isDirty = !1, this._validationErrors = [], this._originalData = null;
  }
  render() {
    return r`
      <div class="editor">
        ${this._isDirty ? r`
          <div class="dirty-indicator">* Configuration has unsaved changes</div>
        ` : ""}
        
        ${this._validationErrors.length > 0 ? r`
          <div class="validation-errors">
            <strong>Validation Errors:</strong>
            ${this._validationErrors.map((e) => r`
              <div class="error-item">${e}</div>
            `)}
          </div>
        ` : ""}
        
        <div class="form-row">
          <h2-input
            label="Configuration Name"
            .value="${this.data.name}"
            placeholder="Enter configuration name"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("name", e.detail.value)}"
          ></h2-input>
          
          <h2-select
            label="Database Type"
            .value="${this.data.type}"
            .options="${[
      { value: "mysql", label: "MySQL" },
      { value: "postgresql", label: "PostgreSQL" },
      { value: "oracle", label: "Oracle" },
      { value: "sqlserver", label: "SQL Server" },
      { value: "mongodb", label: "MongoDB" }
    ]}"
            ?disabled="${this.readOnly}"
            @h2-change="${(e) => this._updateField("type", e.detail.value)}"
          ></h2-select>
        </div>
        
        <div class="form-row">
          <h2-input
            label="Host"
            .value="${this.data.host}"
            placeholder="localhost"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("host", e.detail.value)}"
          ></h2-input>
          
          <h2-input
            label="Port"
            type="number"
            .value="${String(this.data.port)}"
            placeholder="3306"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("port", Number(e.detail.value))}"
          ></h2-input>
        </div>
        
        <div class="form-row">
          <h2-input
            label="Database"
            .value="${this.data.database}"
            placeholder="Enter database name"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("database", e.detail.value)}"
          ></h2-input>
          
          <h2-input
            label="Username"
            .value="${this.data.username}"
            placeholder="Enter username"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("username", e.detail.value)}"
          ></h2-input>
        </div>
        
        <div class="form-row full">
          <h2-input
            label="Password"
            type="password"
            .value="${this.data.password || ""}"
            placeholder="Enter password"
            ?disabled="${this.readOnly}"
            @h2-input="${(e) => this._updateField("password", e.detail.value)}"
          ></h2-input>
        </div>
      </div>
    `;
  }
  _updateField(e, t) {
    if (this.readOnly)
      return;
    const i = { ...this.data, [e]: t };
    this.data = i, this._isDirty = !0, this._validateData(), this.dispatchEvent(new CustomEvent("data-change", {
      detail: { data: this.data, field: e, value: t },
      bubbles: !0,
      composed: !0
    }));
  }
  _validateData() {
    this._validationErrors = [], this.data.name.trim() || this._validationErrors.push("Configuration name is required"), this.data.host.trim() || this._validationErrors.push("Host is required"), (!this.data.port || this.data.port <= 0 || this.data.port > 65535) && this._validationErrors.push("Port must be between 1 and 65535"), this.data.database.trim() || this._validationErrors.push("Database name is required"), this.data.username.trim() || this._validationErrors.push("Username is required");
  }
  async load(e) {
    this.data = { ...e }, this._originalData = { ...e }, this._isDirty = !1, this._validateData();
  }
  async save() {
    if (!this.validate())
      throw new Error("Validation failed: " + this._validationErrors.join(", "));
    return this._originalData = { ...this.data }, this._isDirty = !1, this.dispatchEvent(new CustomEvent("data-save", {
      detail: { data: this.data },
      bubbles: !0,
      composed: !0
    })), { ...this.data };
  }
  isDirty() {
    return this._isDirty;
  }
  validate() {
    return this._validateData(), this._validationErrors.length === 0;
  }
  getValidationErrors() {
    return [...this._validationErrors];
  }
  setReadOnly(e) {
    this.readOnly = e;
  }
  isReadOnly() {
    return this.readOnly;
  }
  destroy() {
    this.data = {
      id: "",
      name: "",
      type: "mysql",
      host: "localhost",
      port: 3306,
      database: "",
      username: ""
    }, this._originalData = null, this._isDirty = !1, this._validationErrors = [];
  }
  reset() {
    this._originalData && (this.data = { ...this._originalData }, this._isDirty = !1, this._validateData());
  }
};
n.styles = v`
    :host {
      display: block;
      height: 100%;
    }
    
    .editor {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px;
      gap: 16px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .form-row.full {
      grid-template-columns: 1fr;
    }
    
    .validation-errors {
      background: var(--o2-editor-error-bg, #f8d7da);
      border: 1px solid var(--o2-editor-error-border, #f5c6cb);
      color: var(--o2-editor-error-color, #721c24);
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    
    .error-item {
      margin: 4px 0;
    }
    
    .dirty-indicator {
      color: var(--o2-editor-dirty-color, #ffc107);
      font-size: 14px;
      font-style: italic;
    }
  `;
p([
  u({ type: Object })
], n.prototype, "data", 2);
p([
  u({ type: Boolean })
], n.prototype, "readOnly", 2);
p([
  d()
], n.prototype, "_isDirty", 2);
p([
  d()
], n.prototype, "_validationErrors", 2);
p([
  d()
], n.prototype, "_originalData", 2);
n = p([
  _("o2-datasource-editor")
], n);
export {
  n as O2DataSourceEditor,
  s as O2DataSourceViewer
};
//# sourceMappingURL=index.js.map
