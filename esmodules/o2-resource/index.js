import { css as f, property as p, state as d, query as _, customElement as v, LitElement as g, html as a } from "@esm/lit-all";
import "@esm/h2-extra";
import "@esm/h2-core";
class y {
  constructor() {
    this._mockData = [
      {
        id: "root",
        name: "Resources",
        type: "folder",
        children: [
          {
            id: "datasources",
            name: "Data Sources",
            type: "folder",
            parentId: "root",
            children: [
              {
                id: "mysql-db",
                name: "MySQL Database",
                type: "datasource",
                parentId: "datasources",
                metadata: { host: "localhost", port: 3306 }
              },
              {
                id: "postgres-db",
                name: "PostgreSQL Database",
                type: "datasource",
                parentId: "datasources",
                metadata: { host: "localhost", port: 5432 }
              }
            ]
          },
          {
            id: "sql-views",
            name: "SQL Views",
            type: "folder",
            parentId: "root",
            children: [
              {
                id: "user-report",
                name: "User Report View",
                type: "sql_view",
                parentId: "sql-views",
                metadata: { sql: "SELECT * FROM users WHERE active = 1" }
              }
            ]
          },
          {
            id: "cubes",
            name: "Data Cubes",
            type: "folder",
            parentId: "root",
            children: [
              {
                id: "sales-cube",
                name: "Sales Analysis Cube",
                type: "cube",
                parentId: "cubes",
                metadata: { dimensions: ["time", "product", "region"] }
              }
            ]
          },
          {
            id: "dashboards",
            name: "Dashboards",
            type: "folder",
            parentId: "root",
            children: [
              {
                id: "sales-dashboard",
                name: "Sales Dashboard",
                type: "dashboard",
                parentId: "dashboards",
                metadata: { widgets: ["chart1", "table1", "kpi1"] }
              }
            ]
          }
        ]
      }
    ];
  }
  async getResource(e) {
    const t = this._findResourceById(e);
    if (!t)
      throw new Error(`Resource with id ${e} not found`);
    return { ...t };
  }
  async getChildren(e) {
    const t = this._findResourceById(e);
    return t != null && t.children ? [...t.children] : [];
  }
  async searchResources(e) {
    const t = [];
    return this._searchInTree(this._mockData, e.toLowerCase(), t), t;
  }
  async createResource(e, t, s) {
    const o = `${t}-${Date.now()}`, i = {
      id: o,
      name: s,
      type: t,
      parentId: e,
      metadata: {}
    }, n = this._findResourceById(e);
    if (!n)
      throw new Error(`Parent resource with id ${e} not found`);
    return n.children || (n.children = []), n.children.push(i), o;
  }
  async rename(e, t) {
    const s = this._findResourceById(e);
    if (!s)
      throw new Error(`Resource with id ${e} not found`);
    s.name = t;
  }
  async move(e, t) {
    const s = this._findResourceById(e), o = this._findResourceById(t);
    if (!s || !o)
      throw new Error("Resource or target not found");
    if (o.type !== "folder")
      throw new Error("Target must be a folder");
    this._removeFromParent(e), o.children || (o.children = []), o.children.push(s), s.parentId = t;
  }
  async copy(e, t) {
    const s = this._findResourceById(e), o = this._findResourceById(t);
    if (!s || !o)
      throw new Error("Resource or target not found");
    if (o.type !== "folder")
      throw new Error("Target must be a folder");
    const i = `${s.type}-${Date.now()}`, n = {
      ...s,
      id: i,
      name: `Copy of ${s.name}`,
      parentId: t,
      children: s.children ? this._deepCopyChildren(s.children) : void 0
    };
    return o.children || (o.children = []), o.children.push(n), i;
  }
  async delete(e) {
    this._removeFromParent(e);
  }
  async getProperties(e) {
    const t = this._findResourceById(e);
    if (!t)
      throw new Error(`Resource with id ${e} not found`);
    return {
      id: t.id,
      name: t.name,
      type: t.type,
      parentId: t.parentId,
      metadata: t.metadata || {},
      permissions: t.permissions || {
        read: !0,
        write: !0,
        execute: !0,
        delete: !0,
        admin: !1
      }
    };
  }
  async setProperties(e, t) {
    const s = this._findResourceById(e);
    if (!s)
      throw new Error(`Resource with id ${e} not found`);
    t.name && (s.name = t.name), t.metadata && (s.metadata = { ...s.metadata, ...t.metadata }), t.permissions && (s.permissions = t.permissions);
  }
  getRootResources() {
    return [...this._mockData];
  }
  _findResourceById(e) {
    const t = (s) => {
      for (const o of s) {
        if (o.id === e)
          return o;
        if (o.children) {
          const i = t(o.children);
          if (i)
            return i;
        }
      }
      return null;
    };
    return t(this._mockData);
  }
  _searchInTree(e, t, s) {
    for (const o of e)
      o.name.toLowerCase().includes(t) && s.push({ ...o }), o.children && this._searchInTree(o.children, t, s);
  }
  _removeFromParent(e) {
    const t = (s) => {
      for (let o = 0; o < s.length; o++) {
        if (s[o].id === e)
          return s.splice(o, 1), !0;
        if (s[o].children && t(s[o].children))
          return !0;
      }
      return !1;
    };
    t(this._mockData);
  }
  _deepCopyChildren(e) {
    return e.map((t) => ({
      ...t,
      id: `${t.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: t.children ? this._deepCopyChildren(t.children) : void 0
    }));
  }
}
var b = Object.defineProperty, x = Object.getOwnPropertyDescriptor, h = (r, e, t, s) => {
  for (var o = s > 1 ? void 0 : s ? x(e, t) : e, i = r.length - 1, n; i >= 0; i--)
    (n = r[i]) && (o = (s ? n(e, t, o) : n(o)) || o);
  return s && o && b(e, t, o), o;
};
let l = class extends g {
  constructor() {
    super(...arguments), this.showToolbar = !0, this.editable = !0, this._resourceData = [], this._loading = !1, this._error = "", this._contextMenu = null, this._showCreateDialog = !1, this._showPropertiesDialog = !1, this._selectedNode = null, this._resourceService = new y(), this._handleDocumentClick = (r) => {
      this.contains(r.target) || (this._contextMenu = null);
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._loadResources(), document.addEventListener("click", this._handleDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("click", this._handleDocumentClick);
  }
  render() {
    return a`
      <div class="resource-tree">
        ${this.showToolbar ? this._renderToolbar() : ""}
        
        <div class="tree-container">
          ${this._loading ? a`
            <div class="loading">Loading resources...</div>
          ` : this._error ? a`
            <div class="error">${this._error}</div>
          ` : a`
            <h2-tree 
              .data="${this._resourceData}"
              @node-click="${this._handleNodeClick}"
              @node-context-menu="${this._handleNodeContextMenu}"
              @node-select="${this._handleNodeSelect}"
            ></h2-tree>
          `}
        </div>
        
        ${this._contextMenu ? this._renderContextMenu() : ""}
        ${this._renderDialogs()}
      </div>
    `;
  }
  _renderToolbar() {
    return a`
      <div class="toolbar">
        <h2-button 
          variant="primary" 
          @h2-click="${this._handleRefresh}"
          title="Refresh"
        >
          🔄 Refresh
        </h2-button>
        
        ${this.editable ? a`
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
        ` : ""}
      </div>
    `;
  }
  _renderContextMenu() {
    if (!this._contextMenu)
      return "";
    const { x: r, y: e, node: t } = this._contextMenu;
    return a`
      <div 
        class="context-menu"
        style="left: ${r}px; top: ${e}px"
        @click="${this._stopPropagation}"
      >
        <div class="context-menu-item" @click="${() => this._handleViewProperties(t)}">
          Properties
        </div>
        
        ${this.editable ? a`
          <div class="context-menu-separator"></div>
          
          <div class="context-menu-item" @click="${() => this._handleRename(t)}">
            Rename
          </div>
          
          ${t.type === "folder" ? a`
            <div class="context-menu-item" @click="${() => this._handleCreateInFolder(t)}">
              Create Child
            </div>
          ` : ""}
          
          <div class="context-menu-item" @click="${() => this._handleCopy(t)}">
            Copy
          </div>
          
          <div class="context-menu-item" @click="${() => this._handleMove(t)}">
            Move
          </div>
          
          <div class="context-menu-separator"></div>
          
          <div class="context-menu-item" @click="${() => this._handleDelete(t)}">
            Delete
          </div>
        ` : ""}
      </div>
    `;
  }
  _renderDialogs() {
    return a`
      <h2-dialog 
        class="create-dialog"
        title="Create Resource"
        ?open="${this._showCreateDialog}"
        @h2-dialog-close="${() => this._showCreateDialog = !1}"
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
      { value: "folder", label: "Folder" },
      { value: "datasource", label: "Data Source" },
      { value: "sql_view", label: "SQL View" },
      { value: "java_view", label: "Java View" },
      { value: "cube", label: "Cube" },
      { value: "dashboard", label: "Dashboard" }
    ]}"
          ></h2-select>
        </div>
        
        <div slot="footer" class="dialog-buttons">
          <h2-button 
            variant="secondary"
            @h2-click="${() => this._showCreateDialog = !1}"
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
        @h2-dialog-close="${() => this._showPropertiesDialog = !1}"
      >
        ${this._selectedNode ? a`
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
              .value="${this._selectedNode.parentId || "None"}"
              readonly
            ></h2-input>
          </div>
          
          <div slot="footer" class="dialog-buttons">
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._showPropertiesDialog = !1}"
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
        ` : ""}
      </h2-dialog>
    `;
  }
  async _loadResources() {
    this._loading = !0, this._error = "";
    try {
      const r = this._resourceService.getRootResources();
      this._resourceData = this._convertToTreeNodes(r);
    } catch (r) {
      this._error = r instanceof Error ? r.message : "Failed to load resources";
    } finally {
      this._loading = !1;
    }
  }
  _convertToTreeNodes(r) {
    return r.map((e) => ({
      id: e.id,
      label: e.name,
      icon: this._getResourceIcon(e.type),
      data: e,
      children: e.children ? this._convertToTreeNodes(e.children) : void 0,
      expanded: e.type === "folder"
    }));
  }
  _getResourceIcon(r) {
    return {
      folder: "📁",
      datasource: "🗄️",
      sql_view: "📊",
      java_view: "☕",
      cube: "🧊",
      dashboard: "📈"
    }[r] || "📄";
  }
  _handleNodeClick(r) {
    const { node: e } = r.detail;
    this.dispatchEvent(new CustomEvent("resource-select", {
      detail: { resource: e.data },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleNodeContextMenu(r) {
    const { node: e, originalEvent: t } = r.detail, s = t;
    this._contextMenu = {
      x: s.clientX,
      y: s.clientY,
      node: e.data
    };
  }
  _handleNodeSelect(r) {
    const { node: e } = r.detail;
    this._selectedNode = e.data;
  }
  _stopPropagation(r) {
    r.stopPropagation();
  }
  _handleRefresh() {
    this._loadResources();
  }
  _handleCreateFolder() {
    this._showCreateDialog = !0;
  }
  _handleCreateDataSource() {
    this._showCreateDialog = !0;
  }
  _handleViewProperties(r) {
    this._selectedNode = r, this._showPropertiesDialog = !0, this._contextMenu = null;
  }
  _handleRename(r) {
    const e = prompt("Enter new name:", r.name);
    e && e !== r.name && this._resourceService.rename(r.id, e).then(() => {
      this._loadResources();
    }).catch((t) => {
      alert("Failed to rename: " + t.message);
    }), this._contextMenu = null;
  }
  _handleCreateInFolder(r) {
    this._selectedNode = r, this._showCreateDialog = !0, this._contextMenu = null;
  }
  _handleCopy(r) {
    const e = prompt("Enter target folder ID:");
    e && this._resourceService.copy(r.id, e).then(() => {
      this._loadResources();
    }).catch((t) => {
      alert("Failed to copy: " + t.message);
    }), this._contextMenu = null;
  }
  _handleMove(r) {
    const e = prompt("Enter target folder ID:");
    e && this._resourceService.move(r.id, e).then(() => {
      this._loadResources();
    }).catch((t) => {
      alert("Failed to move: " + t.message);
    }), this._contextMenu = null;
  }
  _handleDelete(r) {
    confirm(`Are you sure you want to delete "${r.name}"?`) && this._resourceService.delete(r.id).then(() => {
      this._loadResources();
    }).catch((e) => {
      alert("Failed to delete: " + e.message);
    }), this._contextMenu = null;
  }
  async _handleCreateConfirm() {
    var o, i, n;
    const r = (o = this.shadowRoot) == null ? void 0 : o.querySelector("#create-name"), e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#create-type"), t = r == null ? void 0 : r.value, s = e == null ? void 0 : e.value;
    if (!t || !s) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const m = ((n = this._selectedNode) == null ? void 0 : n.id) || "root";
      await this._resourceService.createResource(m, s, t), this._showCreateDialog = !1, this._loadResources();
    } catch (m) {
      alert("Failed to create resource: " + m.message);
    }
  }
  async _handlePropertiesConfirm() {
    var t;
    if (!this._selectedNode)
      return;
    const r = (t = this.shadowRoot) == null ? void 0 : t.querySelector("#prop-name"), e = r == null ? void 0 : r.value;
    if (e && e !== this._selectedNode.name)
      try {
        await this._resourceService.rename(this._selectedNode.id, e), this._showPropertiesDialog = !1, this._loadResources();
      } catch (s) {
        alert("Failed to update properties: " + s.message);
      }
    else
      this._showPropertiesDialog = !1;
  }
  async refresh() {
    await this._loadResources();
  }
  getSelectedResource() {
    return this._selectedNode;
  }
};
l.styles = f`
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
h([
  p({ type: Boolean })
], l.prototype, "showToolbar", 2);
h([
  p({ type: Boolean })
], l.prototype, "editable", 2);
h([
  d()
], l.prototype, "_resourceData", 2);
h([
  d()
], l.prototype, "_loading", 2);
h([
  d()
], l.prototype, "_error", 2);
h([
  d()
], l.prototype, "_contextMenu", 2);
h([
  d()
], l.prototype, "_showCreateDialog", 2);
h([
  d()
], l.prototype, "_showPropertiesDialog", 2);
h([
  d()
], l.prototype, "_selectedNode", 2);
h([
  _("h2-tree")
], l.prototype, "_tree", 2);
h([
  _(".create-dialog")
], l.prototype, "_createDialog", 2);
h([
  _(".properties-dialog")
], l.prototype, "_propertiesDialog", 2);
l = h([
  v("o2-resource-tree")
], l);
var w = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, u = (r, e, t, s) => {
  for (var o = s > 1 ? void 0 : s ? $(e, t) : e, i = r.length - 1, n; i >= 0; i--)
    (n = r[i]) && (o = (s ? n(e, t, o) : n(o)) || o);
  return s && o && w(e, t, o), o;
};
let c = class extends g {
  constructor() {
    super(...arguments), this.placeholder = "Search resources...", this.showFilters = !0, this.autoSearch = !0, this._query = "", this._typeFilter = "", this._results = [], this._loading = !1, this._error = "", this._searchPerformed = !1, this._resourceService = new y(), this._searchTimeout = null;
  }
  render() {
    return a`
      <div class="searcher">
        <div class="search-form">
          <div class="search-input">
            <h2-input
              id="search-input"
              label="Search"
              .placeholder="${this.placeholder}"
              .value="${this._query}"
              @h2-input="${this._handleSearchInput}"
              @h2-change="${this._handleSearchChange}"
            ></h2-input>
          </div>
          
          <h2-button
            variant="primary"
            @h2-click="${this._handleSearch}"
            ?disabled="${!this._query.trim()}"
          >
            Search
          </h2-button>
          
          <h2-button
            variant="secondary"
            @h2-click="${this._handleClear}"
            ?disabled="${!this._query && !this._searchPerformed}"
          >
            Clear
          </h2-button>
        </div>

        ${this.showFilters ? this._renderFilters() : ""}
        
        ${this._searchPerformed ? this._renderResults() : this._renderInitialState()}
      </div>
    `;
  }
  _renderFilters() {
    return a`
      <div class="search-filters">
        <div class="filter-group">
          <div class="filter-label">Type</div>
          <h2-select
            .value="${this._typeFilter}"
            .options="${[
      { value: "", label: "All Types" },
      { value: "folder", label: "Folders" },
      { value: "datasource", label: "Data Sources" },
      { value: "sql_view", label: "SQL Views" },
      { value: "java_view", label: "Java Views" },
      { value: "cube", label: "Cubes" },
      { value: "dashboard", label: "Dashboards" }
    ]}"
            @h2-change="${this._handleTypeFilterChange}"
          ></h2-select>
        </div>
      </div>
    `;
  }
  _renderResults() {
    return this._loading ? a`
        <div class="results">
          <div class="loading">Searching...</div>
        </div>
      ` : this._error ? a`
        <div class="results">
          <div class="error">${this._error}</div>
        </div>
      ` : a`
      <div class="results">
        <div class="results-header">
          <span>Search Results</span>
          <span class="results-count">${this._results.length} found</span>
        </div>
        
        <div class="results-list">
          ${this._results.length === 0 ? a`
            <div class="empty-state">
              No resources found matching "${this._query}"
            </div>
          ` : this._results.map((r) => this._renderResultItem(r))}
        </div>
      </div>
    `;
  }
  _renderResultItem(r) {
    return a`
      <div 
        class="result-item"
        @click="${() => this._handleResultClick(r)}"
      >
        <div class="result-header">
          <span class="result-icon">${this._getResourceIcon(r.type)}</span>
          <span class="result-name">${this._highlightMatches(r.name, this._query)}</span>
          <span class="result-type">${r.type}</span>
        </div>
        
        <div class="result-path">
          ${this._getResourcePath(r)}
        </div>
        
        ${r.matches && r.matches.length > 0 ? a`
          <div class="result-matches">
            ${r.matches.map((e) => a`
              <div class="match-item">
                <strong>${e.field}:</strong> ${this._highlightMatches(e.value, this._query)}
              </div>
            `)}
          </div>
        ` : ""}
      </div>
    `;
  }
  _renderInitialState() {
    return a`
      <div class="empty-state">
        Enter a search term to find resources
      </div>
    `;
  }
  _handleSearchInput(r) {
    this._query = r.detail.value, this.autoSearch && this._debounceSearch();
  }
  _handleSearchChange(r) {
    this._query = r.detail.value, this.autoSearch && this._performSearch();
  }
  _handleTypeFilterChange(r) {
    this._typeFilter = r.detail.value, this._searchPerformed && this._performSearch();
  }
  _handleSearch() {
    this._performSearch();
  }
  _handleClear() {
    this._query = "", this._typeFilter = "", this._results = [], this._searchPerformed = !1, this._error = "", this._searchInput.value = "";
  }
  _handleResultClick(r) {
    this.dispatchEvent(new CustomEvent("result-select", {
      detail: { resource: r },
      bubbles: !0,
      composed: !0
    }));
  }
  _debounceSearch() {
    this._searchTimeout && clearTimeout(this._searchTimeout), this._searchTimeout = window.setTimeout(() => {
      this._performSearch();
    }, 300);
  }
  async _performSearch() {
    const r = this._query.trim();
    if (!r) {
      this._results = [], this._searchPerformed = !1;
      return;
    }
    this._loading = !0, this._error = "", this._searchPerformed = !0;
    try {
      const e = await this._resourceService.searchResources(r);
      let t = e;
      this._typeFilter && (t = e.filter((s) => s.type === this._typeFilter)), this._results = t.map((s) => ({
        ...s,
        matches: this._findMatches(s, r)
      })), this.dispatchEvent(new CustomEvent("search-complete", {
        detail: {
          query: r,
          results: this._results,
          count: this._results.length
        },
        bubbles: !0,
        composed: !0
      }));
    } catch (e) {
      this._error = e instanceof Error ? e.message : "Search failed";
    } finally {
      this._loading = !1;
    }
  }
  _findMatches(r, e) {
    const t = [], s = e.toLowerCase();
    if (r.name.toLowerCase().includes(s) && t.push({ field: "Name", value: r.name }), r.metadata)
      for (const [o, i] of Object.entries(r.metadata))
        String(i).toLowerCase().includes(s) && t.push({ field: o, value: String(i) });
    return t;
  }
  _highlightMatches(r, e) {
    if (!e.trim())
      return r;
    const t = new RegExp(`(${e})`, "gi"), s = r.split(t);
    return a`${s.map(
      (o, i) => t.test(o) ? a`<span class="match-highlight">${o}</span>` : o
    )}`;
  }
  _getResourceIcon(r) {
    return {
      folder: "📁",
      datasource: "🗄️",
      sql_view: "📊",
      java_view: "☕",
      cube: "🧊",
      dashboard: "📈"
    }[r] || "📄";
  }
  _getResourcePath(r) {
    const e = [];
    let t = r;
    for (; t.parentId; ) {
      e.unshift(t.parentId);
      break;
    }
    return e.length > 0 ? e.join(" / ") : "Root";
  }
  focus() {
    var r;
    (r = this._searchInput) == null || r.focus();
  }
  search(r) {
    this._query = r, this._searchInput.value = r, this._performSearch();
  }
  getResults() {
    return [...this._results];
  }
};
c.styles = f`
    :host {
      display: block;
    }
    
    .searcher {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .search-form {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    
    .search-input {
      flex: 1;
    }
    
    .search-filters {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 12px;
      background: var(--o2-searcher-filter-bg, #f8f9fa);
      border-radius: 4px;
      border: 1px solid var(--o2-searcher-border-color, #e0e0e0);
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .filter-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--o2-searcher-label-color, #666);
    }
    
    .results {
      border: 1px solid var(--o2-searcher-border-color, #e0e0e0);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .results-header {
      padding: 12px;
      background: var(--o2-searcher-header-bg, #f8f9fa);
      border-bottom: 1px solid var(--o2-searcher-border-color, #e0e0e0);
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .results-count {
      font-size: 14px;
      color: var(--o2-searcher-count-color, #666);
    }
    
    .results-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .result-item {
      padding: 12px;
      border-bottom: 1px solid var(--o2-searcher-border-color, #e0e0e0);
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .result-item:hover {
      background: var(--o2-searcher-item-hover-bg, #f8f9fa);
    }
    
    .result-item:last-child {
      border-bottom: none;
    }
    
    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    
    .result-icon {
      font-size: 16px;
    }
    
    .result-name {
      font-weight: 500;
      color: var(--o2-searcher-name-color, #333);
    }
    
    .result-type {
      font-size: 12px;
      color: var(--o2-searcher-type-color, #666);
      background: var(--o2-searcher-type-bg, #e9ecef);
      padding: 2px 6px;
      border-radius: 12px;
    }
    
    .result-path {
      font-size: 12px;
      color: var(--o2-searcher-path-color, #999);
      margin-bottom: 4px;
    }
    
    .result-matches {
      font-size: 12px;
    }
    
    .match-item {
      margin: 2px 0;
      color: var(--o2-searcher-match-color, #666);
    }
    
    .match-highlight {
      background: var(--o2-searcher-highlight-bg, #fff3cd);
      padding: 0 2px;
      border-radius: 2px;
    }
    
    .empty-state {
      padding: 40px;
      text-align: center;
      color: var(--o2-searcher-empty-color, #999);
    }
    
    .loading {
      padding: 40px;
      text-align: center;
      color: var(--o2-searcher-loading-color, #666);
    }
    
    .error {
      padding: 40px;
      text-align: center;
      color: var(--o2-searcher-error-color, #dc3545);
    }
  `;
u([
  p({ type: String })
], c.prototype, "placeholder", 2);
u([
  p({ type: Boolean })
], c.prototype, "showFilters", 2);
u([
  p({ type: Boolean })
], c.prototype, "autoSearch", 2);
u([
  d()
], c.prototype, "_query", 2);
u([
  d()
], c.prototype, "_typeFilter", 2);
u([
  d()
], c.prototype, "_results", 2);
u([
  d()
], c.prototype, "_loading", 2);
u([
  d()
], c.prototype, "_error", 2);
u([
  d()
], c.prototype, "_searchPerformed", 2);
u([
  _("#search-input")
], c.prototype, "_searchInput", 2);
c = u([
  v("o2-resource-searcher")
], c);
export {
  c as O2ResourceSearcher,
  l as O2ResourceTree,
  y as ResourceService
};
//# sourceMappingURL=index.js.map
