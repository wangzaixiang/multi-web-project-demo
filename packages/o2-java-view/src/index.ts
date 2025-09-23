import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { IJavaEditor, ICompileResult } from '@demo/interfaces';
import '@demo/h2-core';

@customElement('o2-java-editor')
export class O2JavaEditor extends LitElement implements IJavaEditor {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .java-editor {
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
    
    .code-editor {
      flex: 1;
      border: none;
      padding: 12px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      resize: none;
      outline: none;
    }
  `;

  @property({ type: String })
  value = '';

  @property({ type: Boolean })
  readOnly = false;

  render() {
    return html`
      <div class="java-editor">
        <div class="toolbar">
          <h2-button variant="primary" @h2-click="${this._handleCompile}">Compile</h2-button>
          <h2-button variant="secondary" @h2-click="${this._handleFormat}">Format</h2-button>
        </div>
        
        <textarea 
          class="code-editor"
          .value="${this.value}"
          ?readonly="${this.readOnly}"
          placeholder="Enter Java code..."
          @input="${this._handleInput}"
        ></textarea>
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
  }

  private _handleCompile() {
    this.compile();
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

  async compile(): Promise<ICompileResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: Math.random() > 0.3,
      errors: Math.random() > 0.7 ? [
        { line: 5, column: 10, message: 'Syntax error: missing semicolon', severity: 'error' }
      ] : [],
      warnings: []
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

  goToLine(line: number): void {
    // Implementation placeholder
  }

  findAndReplace(search: string, replace: string): void {
    this.value = this.value.replace(new RegExp(search, 'g'), replace);
  }


  destroy(): void {
    this.value = '';
  }
}

