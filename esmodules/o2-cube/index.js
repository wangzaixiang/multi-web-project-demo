import { css as p, property as d, customElement as m, LitElement as u, html as c } from "@esm/lit-all";
import "@esm/h2-core";
import "@esm/h2-extra";
var y = Object.defineProperty, h = Object.getOwnPropertyDescriptor, l = (i, r, s, t) => {
  for (var e = t > 1 ? void 0 : t ? h(r, s) : r, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (e = (t ? o(r, s, e) : o(e)) || e);
  return t && e && y(r, s, e), e;
};
let a = class extends u {
  constructor() {
    super(...arguments), this.dimensions = ["Time", "Product", "Region"], this.measures = ["Sales", "Profit", "Quantity"];
  }
  render() {
    return c`
      <div class="cube-analyzer">
        <div class="dimensions-panel">
          <h3>Dimensions</h3>
          <h2-tree .data="${this._getDimensionsTree()}"></h2-tree>
        </div>
        
        <div class="analysis-area">
          <div class="toolbar">
            <h2-button variant="primary">Analyze</h2-button>
            <h2-button variant="secondary">Export</h2-button>
          </div>
          
          <h2-datagrid
            .columns="${[
      { key: "dimension", title: "Dimension" },
      { key: "value", title: "Value" },
      { key: "measure", title: "Measure" }
    ]}"
            .data="${this._getSampleData()}"
            .options="${{ pagination: !0, pageSize: 10 }}"
          ></h2-datagrid>
        </div>
      </div>
    `;
  }
  _getDimensionsTree() {
    return this.dimensions.map((i, r) => ({
      id: `dim-${r}`,
      label: i,
      icon: "📊",
      children: [
        { id: `${i}-all`, label: "All", icon: "🔘" },
        { id: `${i}-filter`, label: "Filter...", icon: "🔍" }
      ]
    }));
  }
  _getSampleData() {
    return [
      { dimension: "Time", value: "2023 Q1", measure: "$100,000" },
      { dimension: "Product", value: "Product A", measure: "$75,000" },
      { dimension: "Region", value: "North America", measure: "$150,000" }
    ];
  }
};
a.styles = p`
    :host {
      display: block;
      height: 100%;
    }
    
    .cube-analyzer {
      height: 100%;
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 8px;
      padding: 8px;
    }
    
    .dimensions-panel {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
    }
    
    .analysis-area {
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
  `;
l([
  d({ type: Array })
], a.prototype, "dimensions", 2);
l([
  d({ type: Array })
], a.prototype, "measures", 2);
a = l([
  m("o2-cube-analyzer")
], a);
export {
  a as O2CubeAnalyzer
};
//# sourceMappingURL=index.js.map
