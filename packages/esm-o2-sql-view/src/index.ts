import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property } from '@esm/lit-all';
import type { ISqlEditor, IQueryResult } from '@esm/interfaces';
import '@esm/h2-core';
import '@esm/h2-extra';

@customElement('o2-sql-editor')
export class O2SqlEditor extends LitElement implements ISqlEditor {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .sql-editor {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      gap: 8px;
    }
    
    .editor-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .code-editor {
      flex: 1;
      border: none;
      padding: 12px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      resize: none;
      outline: none;
    }
    
    .results {
      border-top: 1px solid #e0e0e0;
      max-height: 300px;
      overflow: auto;
    }
  `;

  @property({ type: String })
  value = '';

  @property({ type: Boolean })
  readOnly = false;

  render() {
    return html`
      <div class="sql-editor">
        <div class="toolbar">
          <h2-button variant="primary" @h2-click="${this._handleExecute}">Execute</h2-button>
          <h2-button variant="secondary" @h2-click="${this._handleFormat}">Format</h2-button>
        </div>
        
        <div class="editor-area">
          <textarea 
            class="code-editor"
            .value="${this.value}"
            ?readonly="${this.readOnly}"
            placeholder="Enter SQL query..."
            @input="${this._handleInput}"
          ></textarea>
          
          <div class="results">
            <slot name="results"></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
  }

  private _handleExecute() {
    this.execute();
  }

  private _handleFormat() {
    this.format();
  }

  async load(data: string): Promise<void> {
    this.value = data;
  }

  async save(): Promise<string> {
    return this.value;
  }

  isDirty(): boolean {
    return false;
  }

  validate(): boolean {
    return true;
  }

  getValidationErrors(): string[] {
    return [];
  }

  setReadOnly(readOnly: boolean): void {
    this.readOnly = readOnly;
  }

  isReadOnly(): boolean {
    return this.readOnly;
  }

  async execute(): Promise<IQueryResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
      ],
      columns: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'VARCHAR' },
        { name: 'email', type: 'VARCHAR' }
      ],
      rowCount: 2,
      executionTime: 123
    };
  }

  format(): void {
    this.value = this.value.replace(/\s+/g, ' ').trim();
  }

  getSelectedText(): string {
    return '';
  }

  insertText(text: string): void {
    this.value += text;
  }

  setAutoComplete(enabled: boolean): void {
    // Implementation placeholder
  }


  destroy(): void {
    this.value = '';
  }
}

