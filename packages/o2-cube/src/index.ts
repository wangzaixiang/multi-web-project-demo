import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property } from '@demo/lit-all';
import '@demo/h2-core';
import '@demo/h2-extra';

@customElement('o2-cube-analyzer')
export class O2CubeAnalyzer extends LitElement {
  static styles = css`
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

  @property({ type: Array })
  dimensions = ['Time', 'Product', 'Region'];

  @property({ type: Array })
  measures = ['Sales', 'Profit', 'Quantity'];

  render() {
    return html`
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
              { key: 'dimension', title: 'Dimension' },
              { key: 'value', title: 'Value' },
              { key: 'measure', title: 'Measure' }
            ]}"
            .data="${this._getSampleData()}"
            .options="${{ pagination: true, pageSize: 10 }}"
          ></h2-datagrid>
        </div>
      </div>
    `;
  }

  private _getDimensionsTree() {
    return this.dimensions.map((dim, index) => ({
      id: `dim-${index}`,
      label: dim,
      icon: '📊',
      children: [
        { id: `${dim}-all`, label: 'All', icon: '🔘' },
        { id: `${dim}-filter`, label: 'Filter...', icon: '🔍' }
      ]
    }));
  }

  private _getSampleData() {
    return [
      { dimension: 'Time', value: '2023 Q1', measure: '$100,000' },
      { dimension: 'Product', value: 'Product A', measure: '$75,000' },
      { dimension: 'Region', value: 'North America', measure: '$150,000' }
    ];
  }
}

