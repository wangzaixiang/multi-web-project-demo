import { css as g, property as p, state as c, customElement as f, LitElement as _, html as o } from "@esm/lit-all";
var b = Object.defineProperty, v = Object.getOwnPropertyDescriptor, u = (e, t, s, i) => {
  for (var d = i > 1 ? void 0 : i ? v(t, s) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (d = (i ? l(t, s, d) : l(d)) || d);
  return i && d && b(t, s, d), d;
};
let h = class extends _ {
  constructor() {
    super(...arguments), this.data = [], this._selectedNodeIds = /* @__PURE__ */ new Set(), this._expandedNodeIds = /* @__PURE__ */ new Set();
  }
  render() {
    return o`
      <div class="tree">
        ${this.data.map((e) => this._renderNode(e))}
      </div>
    `;
  }
  _renderNode(e, t = 0) {
    const s = e.children && e.children.length > 0, i = this._expandedNodeIds.has(e.id) || e.expanded, d = this._selectedNodeIds.has(e.id) || e.selected;
    return o`
      <div class="tree-node">
        <div 
          class="node-content ${d ? "selected" : ""} ${e.disabled ? "disabled" : ""}"
          @click="${(a) => this._handleNodeClick(e, a)}"
          @contextmenu="${(a) => this._handleContextMenu(e, a)}"
        >
          <div 
            class="expand-icon ${s ? i ? "expanded" : "" : "empty"}"
            @click="${(a) => this._handleExpandClick(e, a)}"
          >
            ${s ? "▶" : ""}
          </div>
          
          ${e.icon ? o`
            <div class="node-icon">${e.icon}</div>
          ` : ""}
          
          <div class="node-label" title="${e.label}">
            ${e.label}
          </div>
        </div>
        
        ${s ? o`
          <div class="children ${i ? "" : "hidden"}">
            ${e.children.map((a) => this._renderNode(a, t + 1))}
          </div>
        ` : ""}
      </div>
    `;
  }
  _handleNodeClick(e, t) {
    if (e.disabled)
      return;
    t.stopPropagation(), this.selectNode(e.id);
    const s = { node: e, originalEvent: t };
    this.dispatchEvent(new CustomEvent("node-click", {
      detail: s,
      bubbles: !0,
      composed: !0
    })), this.dispatchEvent(new CustomEvent("node-select", {
      detail: s,
      bubbles: !0,
      composed: !0
    }));
  }
  _handleExpandClick(e, t) {
    t.stopPropagation(), this._expandedNodeIds.has(e.id) ? this.collapseNode(e.id) : this.expandNode(e.id);
  }
  _handleContextMenu(e, t) {
    e.disabled || (t.preventDefault(), this.dispatchEvent(new CustomEvent("node-context-menu", {
      detail: { node: e, originalEvent: t },
      bubbles: !0,
      composed: !0
    })));
  }
  setData(e) {
    this.data = [...e], this._selectedNodeIds.clear(), this._expandedNodeIds.clear(), this._initializeExpandedNodes(e);
  }
  getData() {
    return [...this.data];
  }
  getSelectedNodes() {
    const e = [];
    return this._findSelectedNodes(this.data, e), e;
  }
  getSelectedNode() {
    const e = this.getSelectedNodes();
    return e.length > 0 ? e[0] : null;
  }
  selectNode(e) {
    this._selectedNodeIds.clear(), this._selectedNodeIds.add(e), this.requestUpdate();
  }
  expandNode(e) {
    this._expandedNodeIds.add(e);
    const t = this.findNode(e);
    t && this.dispatchEvent(new CustomEvent("node-expand", {
      detail: { node: t },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  collapseNode(e) {
    this._expandedNodeIds.delete(e);
    const t = this.findNode(e);
    t && this.dispatchEvent(new CustomEvent("node-collapse", {
      detail: { node: t },
      bubbles: !0,
      composed: !0
    })), this.requestUpdate();
  }
  expandAll() {
    this._expandAllNodes(this.data), this.requestUpdate();
  }
  collapseAll() {
    this._expandedNodeIds.clear(), this.requestUpdate();
  }
  findNode(e) {
    return this._findNodeById(this.data, e);
  }
  addNode(e, t) {
    const s = this.findNode(e);
    s && (s.children || (s.children = []), s.children.push(t), this.requestUpdate());
  }
  removeNode(e) {
    this._removeNodeFromTree(this.data, e), this._selectedNodeIds.delete(e), this._expandedNodeIds.delete(e), this.requestUpdate();
  }
  updateNode(e, t) {
    const s = this.findNode(e);
    s && (Object.assign(s, t), this.requestUpdate());
  }
  destroy() {
    this.data = [], this._selectedNodeIds.clear(), this._expandedNodeIds.clear();
  }
  _initializeExpandedNodes(e) {
    for (const t of e)
      t.expanded && this._expandedNodeIds.add(t.id), t.children && this._initializeExpandedNodes(t.children);
  }
  _findSelectedNodes(e, t) {
    for (const s of e)
      this._selectedNodeIds.has(s.id) && t.push(s), s.children && this._findSelectedNodes(s.children, t);
  }
  _findNodeById(e, t) {
    for (const s of e) {
      if (s.id === t)
        return s;
      if (s.children) {
        const i = this._findNodeById(s.children, t);
        if (i)
          return i;
      }
    }
    return null;
  }
  _expandAllNodes(e) {
    for (const t of e)
      t.children && t.children.length > 0 && (this._expandedNodeIds.add(t.id), this._expandAllNodes(t.children));
  }
  _removeNodeFromTree(e, t) {
    for (let s = 0; s < e.length; s++) {
      if (e[s].id === t)
        return e.splice(s, 1), !0;
      if (e[s].children && this._removeNodeFromTree(e[s].children, t))
        return !0;
    }
    return !1;
  }
};
h.styles = g`
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
u([
  p({ type: Array })
], h.prototype, "data", 2);
u([
  c()
], h.prototype, "_selectedNodeIds", 2);
u([
  c()
], h.prototype, "_expandedNodeIds", 2);
h = u([
  f("h2-tree")
], h);
var x = Object.defineProperty, m = Object.getOwnPropertyDescriptor, n = (e, t, s, i) => {
  for (var d = i > 1 ? void 0 : i ? m(t, s) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (d = (i ? l(t, s, d) : l(d)) || d);
  return i && d && x(t, s, d), d;
};
let r = class extends _ {
  constructor() {
    super(...arguments), this.columns = [], this.data = [], this.options = {}, this._selectedRows = /* @__PURE__ */ new Set(), this._sortColumn = "", this._sortDirection = "asc", this._currentPage = 1, this._filteredData = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._updateFilteredData();
  }
  updated(e) {
    super.updated(e), (e.has("data") || e.has("columns")) && this._updateFilteredData();
  }
  render() {
    const e = this.options.pageSize || 10, t = (this._currentPage - 1) * e, s = t + e, i = this.options.pagination ? this._filteredData.slice(t, s) : this._filteredData;
    return o`
      <div class="datagrid">
        ${this._renderHeader()}
        <div class="body">
          ${i.length === 0 ? this._renderEmptyState() : i.map((d, a) => this._renderRow(d, t + a))}
        </div>
        ${this.options.pagination ? this._renderPagination() : ""}
      </div>
    `;
  }
  _renderHeader() {
    return o`
      <div class="header">
        ${this.options.selectable ? o`
          <div class="header-cell checkbox-cell">
            ${this.options.multiSelect ? o`
              <input 
                type="checkbox" 
                ?checked="${this._selectedRows.size === this.data.length && this.data.length > 0}"
                @change="${this._handleSelectAll}"
              />
            ` : ""}
          </div>
        ` : ""}
        
        ${this.columns.map((e) => o`
          <div 
            class="header-cell ${e.sortable !== !1 && this.options.sortable !== !1 ? "sortable" : ""}"
            style="width: ${e.width ? e.width + "px" : "auto"}; flex: ${e.width ? "0 0 auto" : "1"}"
            @click="${() => this._handleSort(e)}"
          >
            ${e.title}
            ${this._sortColumn === e.key ? o`
              <span class="sort-icon">
                ${this._sortDirection === "asc" ? "↑" : "↓"}
              </span>
            ` : ""}
          </div>
        `)}
      </div>
    `;
  }
  _renderRow(e, t) {
    const s = this._selectedRows.has(t);
    return o`
      <div class="row ${s ? "selected" : ""}">
        ${this.options.selectable ? o`
          <div class="cell checkbox-cell">
            <input 
              type="${this.options.multiSelect ? "checkbox" : "radio"}"
              ?checked="${s}"
              @change="${(i) => this._handleRowSelect(t, i)}"
            />
          </div>
        ` : ""}
        
        ${this.columns.map((i) => {
      const d = e[i.key], a = i.render ? i.render(d, e) : d;
      return o`
            <div 
              class="cell ${this.options.selectable ? "selectable" : ""}"
              style="width: ${i.width ? i.width + "px" : "auto"}; flex: ${i.width ? "0 0 auto" : "1"}"
              @click="${() => this._handleCellClick(e, i, t)}"
              title="${String(d)}"
            >
              ${a}
            </div>
          `;
    })}
      </div>
    `;
  }
  _renderEmptyState() {
    return o`
      <div class="empty-state">
        <slot name="empty">No data available</slot>
      </div>
    `;
  }
  _renderPagination() {
    const e = this.options.pageSize || 10, t = Math.ceil(this._filteredData.length / e), s = (this._currentPage - 1) * e + 1, i = Math.min(this._currentPage * e, this._filteredData.length);
    return o`
      <div class="pagination">
        <div class="pagination-info">
          Showing ${s}-${i} of ${this._filteredData.length} items
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button"
            ?disabled="${this._currentPage === 1}"
            @click="${() => this._goToPage(this._currentPage - 1)}"
          >
            Previous
          </button>
          <span>Page ${this._currentPage} of ${t}</span>
          <button 
            class="pagination-button"
            ?disabled="${this._currentPage === t}"
            @click="${() => this._goToPage(this._currentPage + 1)}"
          >
            Next
          </button>
        </div>
      </div>
    `;
  }
  _handleSort(e) {
    e.sortable === !1 || this.options.sortable === !1 || (this._sortColumn === e.key ? this._sortDirection = this._sortDirection === "asc" ? "desc" : "asc" : (this._sortColumn = e.key, this._sortDirection = "asc"), this._updateFilteredData(), this.dispatchEvent(new CustomEvent("sort-change", {
      detail: { column: e.key, direction: this._sortDirection },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleRowSelect(e, t) {
    const s = t.target;
    this.options.multiSelect ? s.checked ? this._selectedRows.add(e) : this._selectedRows.delete(e) : (this._selectedRows.clear(), s.checked && this._selectedRows.add(e)), this.requestUpdate(), this.dispatchEvent(new CustomEvent("selection-change", {
      detail: { selectedRows: Array.from(this._selectedRows) },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleSelectAll(e) {
    e.target.checked ? this.data.forEach((s, i) => this._selectedRows.add(i)) : this._selectedRows.clear(), this.requestUpdate(), this.dispatchEvent(new CustomEvent("selection-change", {
      detail: { selectedRows: Array.from(this._selectedRows) },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleCellClick(e, t, s) {
    this.dispatchEvent(new CustomEvent("cell-click", {
      detail: { row: e, column: t, index: s },
      bubbles: !0,
      composed: !0
    }));
  }
  _goToPage(e) {
    const t = this.options.pageSize || 10, s = Math.ceil(this._filteredData.length / t);
    e >= 1 && e <= s && (this._currentPage = e);
  }
  _updateFilteredData() {
    let e = [...this.data];
    this._sortColumn && e.sort((t, s) => {
      const i = t[this._sortColumn], d = s[this._sortColumn];
      return i < d ? this._sortDirection === "asc" ? -1 : 1 : i > d ? this._sortDirection === "asc" ? 1 : -1 : 0;
    }), this._filteredData = e;
  }
  getSelectedRows() {
    return Array.from(this._selectedRows).map((e) => this.data[e]);
  }
  clearSelection() {
    this._selectedRows.clear(), this.requestUpdate();
  }
  selectRow(e) {
    this.options.multiSelect || this._selectedRows.clear(), this._selectedRows.add(e), this.requestUpdate();
  }
};
r.styles = g`
    :host {
      display: block;
      border: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .datagrid {
      width: 100%;
      overflow: auto;
    }
    
    .header {
      background: var(--h2-datagrid-header-bg, #f8f9fa);
      border-bottom: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      display: flex;
      min-width: 100%;
    }
    
    .header-cell {
      padding: 12px 8px;
      font-weight: 600;
      border-right: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      display: flex;
      align-items: center;
      gap: 4px;
      user-select: none;
      background: var(--h2-datagrid-header-bg, #f8f9fa);
    }
    
    .header-cell:last-child {
      border-right: none;
    }
    
    .header-cell.sortable {
      cursor: pointer;
    }
    
    .header-cell.sortable:hover {
      background: var(--h2-datagrid-header-hover-bg, #e9ecef);
    }
    
    .sort-icon {
      font-size: 12px;
      color: var(--h2-datagrid-sort-icon-color, #666);
    }
    
    .body {
      min-height: 200px;
    }
    
    .row {
      display: flex;
      border-bottom: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      min-width: 100%;
    }
    
    .row:hover {
      background: var(--h2-datagrid-row-hover-bg, #f8f9fa);
    }
    
    .row.selected {
      background: var(--h2-datagrid-row-selected-bg, #e3f2fd);
    }
    
    .cell {
      padding: 8px;
      border-right: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .cell:last-child {
      border-right: none;
    }
    
    .cell.selectable {
      cursor: pointer;
    }
    
    .checkbox-cell {
      width: 40px;
      flex-shrink: 0;
      text-align: center;
    }
    
    .pagination {
      padding: 12px;
      border-top: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--h2-datagrid-footer-bg, #f8f9fa);
    }
    
    .pagination-info {
      font-size: 14px;
      color: var(--h2-datagrid-text-color, #666);
    }
    
    .pagination-controls {
      display: flex;
      gap: 8px;
    }
    
    .pagination-button {
      padding: 4px 8px;
      border: 1px solid var(--h2-datagrid-border-color, #e0e0e0);
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .pagination-button:hover:not(:disabled) {
      background: var(--h2-datagrid-button-hover-bg, #f8f9fa);
    }
    
    .pagination-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    
    .empty-state {
      padding: 40px;
      text-align: center;
      color: var(--h2-datagrid-empty-color, #999);
    }
  `;
n([
  p({ type: Array })
], r.prototype, "columns", 2);
n([
  p({ type: Array })
], r.prototype, "data", 2);
n([
  p({ type: Object })
], r.prototype, "options", 2);
n([
  c()
], r.prototype, "_selectedRows", 2);
n([
  c()
], r.prototype, "_sortColumn", 2);
n([
  c()
], r.prototype, "_sortDirection", 2);
n([
  c()
], r.prototype, "_currentPage", 2);
n([
  c()
], r.prototype, "_filteredData", 2);
r = n([
  f("h2-datagrid")
], r);
export {
  r as H2DataGrid,
  h as H2Tree
};
//# sourceMappingURL=index.js.map
