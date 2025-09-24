import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property, state } from '@esm/lit-all';

export interface DataGridColumn {
  key: string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  render?: (value: any, row: any) => any;
}

export interface DataGridOptions {
  selectable?: boolean;
  multiSelect?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

@customElement('h2-datagrid')
export class H2DataGrid extends LitElement {
  static styles = css`
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

  @property({ type: Array })
  columns: DataGridColumn[] = [];

  @property({ type: Array })
  data: any[] = [];

  @property({ type: Object })
  options: DataGridOptions = {};

  @state()
  private _selectedRows = new Set<number>();

  @state()
  private _sortColumn = '';

  @state()
  private _sortDirection: 'asc' | 'desc' = 'asc';

  @state()
  private _currentPage = 1;

  @state()
  private _filteredData: any[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._updateFilteredData();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('data') || changedProperties.has('columns')) {
      this._updateFilteredData();
    }
  }

  render() {
    const pageSize = this.options.pageSize || 10;
    const startIndex = (this._currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = this.options.pagination ? 
      this._filteredData.slice(startIndex, endIndex) : 
      this._filteredData;

    return html`
      <div class="datagrid">
        ${this._renderHeader()}
        <div class="body">
          ${pageData.length === 0 ? this._renderEmptyState() : pageData.map((row, index) => this._renderRow(row, startIndex + index))}
        </div>
        ${this.options.pagination ? this._renderPagination() : ''}
      </div>
    `;
  }

  private _renderHeader() {
    return html`
      <div class="header">
        ${this.options.selectable ? html`
          <div class="header-cell checkbox-cell">
            ${this.options.multiSelect ? html`
              <input 
                type="checkbox" 
                ?checked="${this._selectedRows.size === this.data.length && this.data.length > 0}"
                @change="${this._handleSelectAll}"
              />
            ` : ''}
          </div>
        ` : ''}
        
        ${this.columns.map(column => html`
          <div 
            class="header-cell ${column.sortable !== false && this.options.sortable !== false ? 'sortable' : ''}"
            style="width: ${column.width ? column.width + 'px' : 'auto'}; flex: ${column.width ? '0 0 auto' : '1'}"
            @click="${() => this._handleSort(column)}"
          >
            ${column.title}
            ${this._sortColumn === column.key ? html`
              <span class="sort-icon">
                ${this._sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            ` : ''}
          </div>
        `)}
      </div>
    `;
  }

  private _renderRow(row: any, index: number) {
    const isSelected = this._selectedRows.has(index);
    
    return html`
      <div class="row ${isSelected ? 'selected' : ''}">
        ${this.options.selectable ? html`
          <div class="cell checkbox-cell">
            <input 
              type="${this.options.multiSelect ? 'checkbox' : 'radio'}"
              ?checked="${isSelected}"
              @change="${(e: Event) => this._handleRowSelect(index, e)}"
            />
          </div>
        ` : ''}
        
        ${this.columns.map(column => {
          const value = row[column.key];
          const content = column.render ? column.render(value, row) : value;
          
          return html`
            <div 
              class="cell ${this.options.selectable ? 'selectable' : ''}"
              style="width: ${column.width ? column.width + 'px' : 'auto'}; flex: ${column.width ? '0 0 auto' : '1'}"
              @click="${() => this._handleCellClick(row, column, index)}"
              title="${String(value)}"
            >
              ${content}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEmptyState() {
    return html`
      <div class="empty-state">
        <slot name="empty">No data available</slot>
      </div>
    `;
  }

  private _renderPagination() {
    const pageSize = this.options.pageSize || 10;
    const totalPages = Math.ceil(this._filteredData.length / pageSize);
    const startItem = (this._currentPage - 1) * pageSize + 1;
    const endItem = Math.min(this._currentPage * pageSize, this._filteredData.length);
    
    return html`
      <div class="pagination">
        <div class="pagination-info">
          Showing ${startItem}-${endItem} of ${this._filteredData.length} items
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-button"
            ?disabled="${this._currentPage === 1}"
            @click="${() => this._goToPage(this._currentPage - 1)}"
          >
            Previous
          </button>
          <span>Page ${this._currentPage} of ${totalPages}</span>
          <button 
            class="pagination-button"
            ?disabled="${this._currentPage === totalPages}"
            @click="${() => this._goToPage(this._currentPage + 1)}"
          >
            Next
          </button>
        </div>
      </div>
    `;
  }

  private _handleSort(column: DataGridColumn) {
    if (column.sortable === false || this.options.sortable === false) return;
    
    if (this._sortColumn === column.key) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = column.key;
      this._sortDirection = 'asc';
    }
    
    this._updateFilteredData();
    
    this.dispatchEvent(new CustomEvent('sort-change', {
      detail: { column: column.key, direction: this._sortDirection },
      bubbles: true,
      composed: true
    }));
  }

  private _handleRowSelect(index: number, e: Event) {
    const target = e.target as HTMLInputElement;
    
    if (this.options.multiSelect) {
      if (target.checked) {
        this._selectedRows.add(index);
      } else {
        this._selectedRows.delete(index);
      }
    } else {
      this._selectedRows.clear();
      if (target.checked) {
        this._selectedRows.add(index);
      }
    }
    
    this.requestUpdate();
    
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedRows: Array.from(this._selectedRows) },
      bubbles: true,
      composed: true
    }));
  }

  private _handleSelectAll(e: Event) {
    const target = e.target as HTMLInputElement;
    
    if (target.checked) {
      this.data.forEach((_, index) => this._selectedRows.add(index));
    } else {
      this._selectedRows.clear();
    }
    
    this.requestUpdate();
    
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedRows: Array.from(this._selectedRows) },
      bubbles: true,
      composed: true
    }));
  }

  private _handleCellClick(row: any, column: DataGridColumn, index: number) {
    this.dispatchEvent(new CustomEvent('cell-click', {
      detail: { row, column, index },
      bubbles: true,
      composed: true
    }));
  }

  private _goToPage(page: number) {
    const pageSize = this.options.pageSize || 10;
    const totalPages = Math.ceil(this._filteredData.length / pageSize);
    
    if (page >= 1 && page <= totalPages) {
      this._currentPage = page;
    }
  }

  private _updateFilteredData() {
    let filtered = [...this.data];
    
    if (this._sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[this._sortColumn];
        const bVal = b[this._sortColumn];
        
        if (aVal < bVal) return this._sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this._sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this._filteredData = filtered;
  }

  getSelectedRows() {
    return Array.from(this._selectedRows).map(index => this.data[index]);
  }

  clearSelection() {
    this._selectedRows.clear();
    this.requestUpdate();
  }

  selectRow(index: number) {
    if (!this.options.multiSelect) {
      this._selectedRows.clear();
    }
    this._selectedRows.add(index);
    this.requestUpdate();
  }
}