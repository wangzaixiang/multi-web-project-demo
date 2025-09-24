import { css as p, property as d, customElement as u, LitElement as h, html as c } from "@esm/lit-all";
import "@esm/h2-core";
var v = Object.defineProperty, m = Object.getOwnPropertyDescriptor, s = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? m(t, n) : t, i = e.length - 1, l; i >= 0; i--)
    (l = e[i]) && (r = (o ? l(t, n, r) : l(r)) || r);
  return o && r && v(t, n, r), r;
};
let a = class extends h {
  constructor() {
    super(...arguments), this.value = "", this.readOnly = !1;
  }
  render() {
    return c`
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
  _handleInput(e) {
    const t = e.target;
    this.value = t.value;
  }
  _handleCompile() {
    this.compile();
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
  async compile() {
    return await new Promise((e) => setTimeout(e, 1e3)), {
      success: Math.random() > 0.3,
      errors: Math.random() > 0.7 ? [
        { line: 5, column: 10, message: "Syntax error: missing semicolon", severity: "error" }
      ] : [],
      warnings: []
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
  goToLine(e) {
  }
  findAndReplace(e, t) {
    this.value = this.value.replace(new RegExp(e, "g"), t);
  }
  destroy() {
    this.value = "";
  }
};
a.styles = p`
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
s([
  d({ type: String })
], a.prototype, "value", 2);
s([
  d({ type: Boolean })
], a.prototype, "readOnly", 2);
a = s([
  u("o2-java-editor")
], a);
export {
  a as O2JavaEditor
};
//# sourceMappingURL=index.js.map
