import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property, state, query } from '@demo/lit-all';
import type { IResourceNode } from '@demo/interfaces';
import { ResourceService } from '../../services/resource-service';
import '@demo/h2-core';
import '@demo/h2-extra';

export interface SearchResult extends IResourceNode {
  matches?: { field: string; value: string }[];
}

@customElement('o2-resource-searcher')
export class O2ResourceSearcher extends LitElement {
  static styles = css`
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

  @property({ type: String })
  placeholder = 'Search resources...';

  @property({ type: Boolean })
  showFilters = true;

  @property({ type: Boolean })
  autoSearch = true;

  @state()
  private _query = '';

  @state()
  private _typeFilter = '';

  @state()
  private _results: SearchResult[] = [];

  @state()
  private _loading = false;

  @state()
  private _error = '';

  @state()
  private _searchPerformed = false;

  @query('#search-input')
  private _searchInput!: any;

  private _resourceService = new ResourceService();
  private _searchTimeout: number | null = null;

  render() {
    return html`
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

        ${this.showFilters ? this._renderFilters() : ''}
        
        ${this._searchPerformed ? this._renderResults() : this._renderInitialState()}
      </div>
    `;
  }

  private _renderFilters() {
    return html`
      <div class="search-filters">
        <div class="filter-group">
          <div class="filter-label">Type</div>
          <h2-select
            .value="${this._typeFilter}"
            .options="${[
              { value: '', label: 'All Types' },
              { value: 'folder', label: 'Folders' },
              { value: 'datasource', label: 'Data Sources' },
              { value: 'sql_view', label: 'SQL Views' },
              { value: 'java_view', label: 'Java Views' },
              { value: 'cube', label: 'Cubes' },
              { value: 'dashboard', label: 'Dashboards' }
            ]}"
            @h2-change="${this._handleTypeFilterChange}"
          ></h2-select>
        </div>
      </div>
    `;
  }

  private _renderResults() {
    if (this._loading) {
      return html`
        <div class="results">
          <div class="loading">Searching...</div>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="results">
          <div class="error">${this._error}</div>
        </div>
      `;
    }

    return html`
      <div class="results">
        <div class="results-header">
          <span>Search Results</span>
          <span class="results-count">${this._results.length} found</span>
        </div>
        
        <div class="results-list">
          ${this._results.length === 0 ? html`
            <div class="empty-state">
              No resources found matching "${this._query}"
            </div>
          ` : this._results.map(result => this._renderResultItem(result))}
        </div>
      </div>
    `;
  }

  private _renderResultItem(result: SearchResult) {
    return html`
      <div 
        class="result-item"
        @click="${() => this._handleResultClick(result)}"
      >
        <div class="result-header">
          <span class="result-icon">${this._getResourceIcon(result.type)}</span>
          <span class="result-name">${this._highlightMatches(result.name, this._query)}</span>
          <span class="result-type">${result.type}</span>
        </div>
        
        <div class="result-path">
          ${this._getResourcePath(result)}
        </div>
        
        ${result.matches && result.matches.length > 0 ? html`
          <div class="result-matches">
            ${result.matches.map(match => html`
              <div class="match-item">
                <strong>${match.field}:</strong> ${this._highlightMatches(match.value, this._query)}
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderInitialState() {
    return html`
      <div class="empty-state">
        Enter a search term to find resources
      </div>
    `;
  }

  private _handleSearchInput(e: CustomEvent) {
    this._query = e.detail.value;
    
    if (this.autoSearch) {
      this._debounceSearch();
    }
  }

  private _handleSearchChange(e: CustomEvent) {
    this._query = e.detail.value;
    
    if (this.autoSearch) {
      this._performSearch();
    }
  }

  private _handleTypeFilterChange(e: CustomEvent) {
    this._typeFilter = e.detail.value;
    
    if (this._searchPerformed) {
      this._performSearch();
    }
  }

  private _handleSearch() {
    this._performSearch();
  }

  private _handleClear() {
    this._query = '';
    this._typeFilter = '';
    this._results = [];
    this._searchPerformed = false;
    this._error = '';
    this._searchInput.value = '';
  }

  private _handleResultClick(result: SearchResult) {
    this.dispatchEvent(new CustomEvent('result-select', {
      detail: { resource: result },
      bubbles: true,
      composed: true
    }));
  }

  private _debounceSearch() {
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
    }
    
    this._searchTimeout = window.setTimeout(() => {
      this._performSearch();
    }, 300);
  }

  private async _performSearch() {
    const query = this._query.trim();
    
    if (!query) {
      this._results = [];
      this._searchPerformed = false;
      return;
    }

    this._loading = true;
    this._error = '';
    this._searchPerformed = true;

    try {
      const results = await this._resourceService.searchResources(query);
      
      let filteredResults = results;
      if (this._typeFilter) {
        filteredResults = results.filter(r => r.type === this._typeFilter);
      }
      
      this._results = filteredResults.map(result => ({
        ...result,
        matches: this._findMatches(result, query)
      }));
      
      this.dispatchEvent(new CustomEvent('search-complete', {
        detail: { 
          query, 
          results: this._results,
          count: this._results.length 
        },
        bubbles: true,
        composed: true
      }));
      
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Search failed';
    } finally {
      this._loading = false;
    }
  }

  private _findMatches(resource: IResourceNode, query: string): { field: string; value: string }[] {
    const matches: { field: string; value: string }[] = [];
    const lowerQuery = query.toLowerCase();
    
    if (resource.name.toLowerCase().includes(lowerQuery)) {
      matches.push({ field: 'Name', value: resource.name });
    }
    
    if (resource.metadata) {
      for (const [key, value] of Object.entries(resource.metadata)) {
        if (String(value).toLowerCase().includes(lowerQuery)) {
          matches.push({ field: key, value: String(value) });
        }
      }
    }
    
    return matches;
  }

  private _highlightMatches(text: string, query: string): any {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return html`${parts.map((part, index) => 
      regex.test(part) 
        ? html`<span class="match-highlight">${part}</span>`
        : part
    )}`;
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

  private _getResourcePath(resource: IResourceNode): string {
    const parts = [];
    let current = resource;
    
    while (current.parentId) {
      parts.unshift(current.parentId);
      break;
    }
    
    return parts.length > 0 ? parts.join(' / ') : 'Root';
  }

  focus() {
    this._searchInput?.focus();
  }

  search(query: string) {
    this._query = query;
    this._searchInput.value = query;
    this._performSearch();
  }

  getResults(): SearchResult[] {
    return [...this._results];
  }
}