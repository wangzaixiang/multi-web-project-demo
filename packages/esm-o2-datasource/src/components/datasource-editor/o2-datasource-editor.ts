import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property, state } from '@esm/lit-all';
import type { IEditor, IDataSourceConfig } from '@esm/interfaces';
import '@esm/h2-core';

@customElement('o2-datasource-editor')
export class O2DataSourceEditor extends LitElement implements IEditor<IDataSourceConfig> {
  static styles = css`
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

  @property({ type: Object })
  data: IDataSourceConfig = {
    id: '',
    name: '',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: '',
    username: ''
  };

  @property({ type: Boolean })
  readOnly = false;

  @state()
  private _isDirty = false;

  @state()
  private _validationErrors: string[] = [];

  @state()
  private _originalData: IDataSourceConfig | null = null;

  render() {
    return html`
      <div class="editor">
        ${this._isDirty ? html`
          <div class="dirty-indicator">* Configuration has unsaved changes</div>
        ` : ''}
        
        ${this._validationErrors.length > 0 ? html`
          <div class="validation-errors">
            <strong>Validation Errors:</strong>
            ${this._validationErrors.map(error => html`
              <div class="error-item">${error}</div>
            `)}
          </div>
        ` : ''}
        
        <div class="form-row">
          <h2-input
            label="Configuration Name"
            .value="${this.data.name}"
            placeholder="Enter configuration name"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('name', e.detail.value)}"
          ></h2-input>
          
          <h2-select
            label="Database Type"
            .value="${this.data.type}"
            .options="${[
              { value: 'mysql', label: 'MySQL' },
              { value: 'postgresql', label: 'PostgreSQL' },
              { value: 'oracle', label: 'Oracle' },
              { value: 'sqlserver', label: 'SQL Server' },
              { value: 'mongodb', label: 'MongoDB' }
            ]}"
            ?disabled="${this.readOnly}"
            @h2-change="${(e: CustomEvent) => this._updateField('type', e.detail.value)}"
          ></h2-select>
        </div>
        
        <div class="form-row">
          <h2-input
            label="Host"
            .value="${this.data.host}"
            placeholder="localhost"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('host', e.detail.value)}"
          ></h2-input>
          
          <h2-input
            label="Port"
            type="number"
            .value="${String(this.data.port)}"
            placeholder="3306"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('port', Number(e.detail.value))}"
          ></h2-input>
        </div>
        
        <div class="form-row">
          <h2-input
            label="Database"
            .value="${this.data.database}"
            placeholder="Enter database name"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('database', e.detail.value)}"
          ></h2-input>
          
          <h2-input
            label="Username"
            .value="${this.data.username}"
            placeholder="Enter username"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('username', e.detail.value)}"
          ></h2-input>
        </div>
        
        <div class="form-row full">
          <h2-input
            label="Password"
            type="password"
            .value="${this.data.password || ''}"
            placeholder="Enter password"
            ?disabled="${this.readOnly}"
            @h2-input="${(e: CustomEvent) => this._updateField('password', e.detail.value)}"
          ></h2-input>
        </div>
      </div>
    `;
  }

  private _updateField(field: keyof IDataSourceConfig, value: any) {
    if (this.readOnly) return;
    
    const newData = { ...this.data, [field]: value };
    this.data = newData;
    this._isDirty = true;
    
    this._validateData();
    
    this.dispatchEvent(new CustomEvent('data-change', {
      detail: { data: this.data, field, value },
      bubbles: true,
      composed: true
    }));
  }

  private _validateData() {
    this._validationErrors = [];
    
    if (!this.data.name.trim()) {
      this._validationErrors.push('Configuration name is required');
    }
    
    if (!this.data.host.trim()) {
      this._validationErrors.push('Host is required');
    }
    
    if (!this.data.port || this.data.port <= 0 || this.data.port > 65535) {
      this._validationErrors.push('Port must be between 1 and 65535');
    }
    
    if (!this.data.database.trim()) {
      this._validationErrors.push('Database name is required');
    }
    
    if (!this.data.username.trim()) {
      this._validationErrors.push('Username is required');
    }
  }

  async load(data: IDataSourceConfig): Promise<void> {
    this.data = { ...data };
    this._originalData = { ...data };
    this._isDirty = false;
    this._validateData();
  }

  async save(): Promise<IDataSourceConfig> {
    if (!this.validate()) {
      throw new Error('Validation failed: ' + this._validationErrors.join(', '));
    }
    
    this._originalData = { ...this.data };
    this._isDirty = false;
    
    this.dispatchEvent(new CustomEvent('data-save', {
      detail: { data: this.data },
      bubbles: true,
      composed: true
    }));
    
    return { ...this.data };
  }

  isDirty(): boolean {
    return this._isDirty;
  }

  validate(): boolean {
    this._validateData();
    return this._validationErrors.length === 0;
  }

  getValidationErrors(): string[] {
    return [...this._validationErrors];
  }

  setReadOnly(readOnly: boolean): void {
    this.readOnly = readOnly;
  }

  isReadOnly(): boolean {
    return this.readOnly;
  }


  destroy(): void {
    this.data = {
      id: '',
      name: '',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: '',
      username: ''
    };
    this._originalData = null;
    this._isDirty = false;
    this._validationErrors = [];
  }

  reset() {
    if (this._originalData) {
      this.data = { ...this._originalData };
      this._isDirty = false;
      this._validateData();
    }
  }
}