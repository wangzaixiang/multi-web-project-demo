import { css as l, property as c, customElement as g, LitElement as b, html as n } from "@esm/lit-all";
import "@esm/h2-core";
import "@esm/h2-extra";
var h = Object.defineProperty, m = Object.getOwnPropertyDescriptor, p = (e, t, i, r) => {
  for (var d = r > 1 ? void 0 : r ? m(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (d = (r ? o(t, i, d) : o(d)) || d);
  return r && d && h(t, i, d), d;
};
let a = class extends b {
  constructor() {
    super(...arguments), this.widgets = [
      { id: "chart", name: "Chart", icon: "📊" },
      { id: "table", name: "Table", icon: "📋" },
      { id: "kpi", name: "KPI", icon: "🎯" },
      { id: "text", name: "Text", icon: "📝" }
    ];
  }
  render() {
    return n`
      <div class="dashboard-designer">
        <div class="widget-palette">
          <h3>Widgets</h3>
          ${this.widgets.map((e) => n`
            <div class="widget-item" @click="${() => this._addWidget(e)}">
              <span>${e.icon}</span>
              <span>${e.name}</span>
            </div>
          `)}
        </div>
        
        <div class="design-area">
          <div class="toolbar">
            <h2-button variant="primary">Save</h2-button>
            <h2-button variant="secondary">Preview</h2-button>
            <h2-button variant="secondary">Clear</h2-button>
          </div>
          
          <div class="canvas">
            <p>Drag widgets here to build your dashboard</p>
            <p>Click on widgets in the palette to add them</p>
          </div>
        </div>
      </div>
    `;
  }
  _addWidget(e) {
    this.dispatchEvent(new CustomEvent("widget-add", {
      detail: { widget: e },
      bubbles: !0,
      composed: !0
    }));
  }
};
a.styles = l`
    :host {
      display: block;
      height: 100%;
    }
    
    .dashboard-designer {
      height: 100%;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 8px;
      padding: 8px;
    }
    
    .widget-palette {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
    }
    
    .design-area {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
    }
    
    .canvas {
      flex: 1;
      border: 2px dashed #ddd;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      color: #666;
      background: #f9f9f9;
    }
    
    .widget-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      margin: 4px 0;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .widget-item:hover {
      background: #f8f9fa;
    }
  `;
p([
  c({ type: Array })
], a.prototype, "widgets", 2);
a = p([
  g("o2-dashboard-designer")
], a);
export {
  a as O2DashboardDesigner
};
//# sourceMappingURL=index.js.map
