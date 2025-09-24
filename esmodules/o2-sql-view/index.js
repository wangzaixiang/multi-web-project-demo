import { css as u, property as d, customElement as p, LitElement as c, html as h } from "@esm/lit-all";
import "@esm/h2-core";
import "@esm/h2-extra";
var m = Object.defineProperty, v = Object.getOwnPropertyDescriptor, i = (e, a, l, o) => {
  for (var t = o > 1 ? void 0 : o ? v(a, l) : a, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (t = (o ? n(a, l, t) : n(t)) || t);
  return o && t && m(a, l, t), t;
};
let r = class extends c {
  constructor() {
    super(...arguments), this.value = "", this.readOnly = !1;
  }
  render() {
    return h`
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
  _handleInput(e) {
    const a = e.target;
    this.value = a.value;
  }
  _handleExecute() {
    this.execute();
  }
  _handleFormat() {
    this.format();
  }
  async load(e) {
    this.value = e;
  }
  async save() {
    return this.value;
  }
  isDirty() {
    return !1;
  }
  validate() {
    return !0;
  }
  getValidationErrors() {
    return [];
  }
  setReadOnly(e) {
    this.readOnly = e;
  }
  isReadOnly() {
    return this.readOnly;
  }
  async execute() {
    return await new Promise((e) => setTimeout(e, 500)), {
      success: !0,
      data: [
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Jane", email: "jane@example.com" }
      ],
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "VARCHAR" },
        { name: "email", type: "VARCHAR" }
      ],
      rowCount: 2,
      executionTime: 123
    };
  }
  format() {
    this.value = this.value.replace(/\s+/g, " ").trim();
  }
  getSelectedText() {
    return "";
  }
  insertText(e) {
    this.value += e;
  }
  setAutoComplete(e) {
  }
  destroy() {
    this.value = "";
  }
};
r.styles = u`
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
i([
  d({ type: String })
], r.prototype, "value", 2);
i([
  d({ type: Boolean })
], r.prototype, "readOnly", 2);
r = i([
  p("o2-sql-editor")
], r);
export {
  r as O2SqlEditor
};
//# sourceMappingURL=index.js.map
