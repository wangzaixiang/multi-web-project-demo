import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property } from '@demo/lit-all';
import '@demo/h2-core';
import '@demo/h2-extra';

@customElement('o2-dashboard-designer')
export class O2DashboardDesigner extends LitElement {
  static styles = css`
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

  @property({ type: Array })
  widgets = [
    { id: 'chart', name: 'Chart', icon: '📊' },
    { id: 'table', name: 'Table', icon: '📋' },
    { id: 'kpi', name: 'KPI', icon: '🎯' },
    { id: 'text', name: 'Text', icon: '📝' }
  ];

  render() {
    return html`
      <div class="dashboard-designer">
        <div class="widget-palette">
          <h3>Widgets</h3>
          ${this.widgets.map(widget => html`
            <div class="widget-item" @click="${() => this._addWidget(widget)}">
              <span>${widget.icon}</span>
              <span>${widget.name}</span>
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

  private _addWidget(widget: any) {
    this.dispatchEvent(new CustomEvent('widget-add', {
      detail: { widget },
      bubbles: true,
      composed: true
    }));
  }
}

