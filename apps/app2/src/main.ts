import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@demo/h2-core';
import '@demo/h2-extra';
import '@demo/o2-resource';
import '@demo/o2-datasource';

@customElement('demo-app2')
export class DemoApp2 extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .app-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      min-height: 500px;
    }
    
    .header {
      background: #27ae60;
      color: white;
      padding: 16px;
      text-align: center;
    }
    
    .content {
      padding: 20px;
    }
    
    .demo-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #f8f9fa;
    }
    
    .demo-section h3 {
      margin-top: 0;
      color: #27ae60;
    }
    
    .lazy-load-status {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 14px;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    
    .feature-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      text-align: center;
    }
    
    .feature-card h4 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .load-button {
      margin-top: 12px;
    }
  `;

  @state()
  private _loadedModules = new Set<string>();

  @state()
  private _activeDemo = '';

  render() {
    return html`
      <div class="app-container">
        <div class="header">
          <h2>Split Package Demo Application</h2>
          <p>Dynamically load components as needed</p>
        </div>
        
        <div class="content">
          <div class="demo-section">
            <h3>🎯 Core Components (Always Loaded)</h3>
            <p>These components are loaded immediately with the main bundle:</p>
            
            <div style="display: flex; gap: 12px; align-items: center; margin: 16px 0;">
              <h2-button variant="primary">Sample Button</h2-button>
              
              <h2-input 
                placeholder="Sample input..."
                .value="${'Hello World'}"
              ></h2-input>
              
              <h2-select
                .options="${[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' }
                ]}"
                .value="${'option1'}"
              ></h2-select>
            </div>
          </div>
          
          <div class="demo-section">
            <h3>📦 Lazy-Loaded Features</h3>
            <p>These features are loaded on-demand to optimize initial bundle size:</p>
            
            <div class="feature-grid">
              <div class="feature-card">
                <h4>🌳 Resource Tree</h4>
                <p>Hierarchical resource management</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('tree') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('tree')}"
                  >
                    ${this._loadedModules.has('tree') ? '✓ Loaded' : 'Load Tree'}
                  </h2-button>
                </div>
              </div>
              
              <div class="feature-card">
                <h4>🗄️ Data Sources</h4>
                <p>Database connection management</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('datasource') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('datasource')}"
                  >
                    ${this._loadedModules.has('datasource') ? '✓ Loaded' : 'Load DataSource'}
                  </h2-button>
                </div>
              </div>
              
              <div class="feature-card">
                <h4>📊 SQL Editor</h4>
                <p>Advanced SQL query editor</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('sql') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('sql')}"
                  >
                    ${this._loadedModules.has('sql') ? '✓ Loaded' : 'Load SQL Editor'}
                  </h2-button>
                </div>
              </div>
              
              <div class="feature-card">
                <h4>☕ Java Editor</h4>
                <p>Java code development environment</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('java') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('java')}"
                  >
                    ${this._loadedModules.has('java') ? '✓ Loaded' : 'Load Java Editor'}
                  </h2-button>
                </div>
              </div>
              
              <div class="feature-card">
                <h4>🧊 Cube Analysis</h4>
                <p>Multi-dimensional data analysis</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('cube') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('cube')}"
                  >
                    ${this._loadedModules.has('cube') ? '✓ Loaded' : 'Load Cube'}
                  </h2-button>
                </div>
              </div>
              
              <div class="feature-card">
                <h4>📈 Dashboard</h4>
                <p>Interactive dashboard designer</p>
                <div class="load-button">
                  <h2-button 
                    variant="${this._loadedModules.has('dashboard') ? 'secondary' : 'primary'}"
                    @h2-click="${() => this._loadFeature('dashboard')}"
                  >
                    ${this._loadedModules.has('dashboard') ? '✓ Loaded' : 'Load Dashboard'}
                  </h2-button>
                </div>
              </div>
            </div>
          </div>
          
          ${this._renderActiveDemo()}
        </div>
      </div>
    `;
  }

  private _renderActiveDemo() {
    if (!this._activeDemo) return '';
    
    return html`
      <div class="demo-section">
        <h3>🎪 Active Demo: ${this._getFeatureName(this._activeDemo)}</h3>
        ${this._renderDemoContent()}
      </div>
    `;
  }

  private _renderDemoContent() {
    switch (this._activeDemo) {
      case 'tree':
        return html`<o2-resource-tree style="height: 400px;"></o2-resource-tree>`;
      
      case 'datasource':
        return html`
          <o2-datasource-editor
            .data="${{
              id: 'demo-ds',
              name: 'Demo Database',
              type: 'mysql' as const,
              host: 'localhost',
              port: 3306,
              database: 'demo',
              username: 'demo_user'
            }}"
            style="height: 400px;"
          ></o2-datasource-editor>
        `;
      
      case 'sql':
        return html`
          <o2-sql-editor
            .value="${'SELECT * FROM users WHERE active = 1;'}"
            style="height: 400px;"
          ></o2-sql-editor>
        `;
      
      case 'java':
        return html`
          <o2-java-editor
            .value="${'public class HelloWorld {\\n    public static void main(String[] args) {\\n        System.out.println(\"Hello, World!\");\\n    }\\n}'}"
            style="height: 400px;"
          ></o2-java-editor>
        `;
      
      case 'cube':
        return html`<o2-cube-analyzer style="height: 400px;"></o2-cube-analyzer>`;
      
      case 'dashboard':
        return html`<o2-dashboard-designer style="height: 400px;"></o2-dashboard-designer>`;
      
      default:
        return html`<p>Feature not available</p>`;
    }
  }

  private async _loadFeature(feature: string) {
    if (this._loadedModules.has(feature)) {
      this._activeDemo = feature;
      return;
    }
    
    try {
      switch (feature) {
        case 'tree':
          // Resource tree is already loaded with the initial bundle
          break;
        
        case 'datasource':
          // DataSource components are already loaded
          break;
        
        case 'sql':
          await import('@demo/o2-sql-view');
          break;
        
        case 'java':
          await import('@demo/o2-java-view');
          break;
        
        case 'cube':
          await import('@demo/o2-cube');
          break;
        
        case 'dashboard':
          await import('@demo/o2-dashboard');
          break;
      }
      
      this._loadedModules.add(feature);
      this._activeDemo = feature;
      
      console.log(`🎉 Successfully loaded ${feature} feature!`);
      
    } catch (error) {
      console.error(`❌ Failed to load ${feature} feature:`, error);
    }
  }

  private _getFeatureName(feature: string): string {
    const names: Record<string, string> = {
      tree: 'Resource Tree',
      datasource: 'Data Sources', 
      sql: 'SQL Editor',
      java: 'Java Editor',
      cube: 'Cube Analysis',
      dashboard: 'Dashboard Designer'
    };
    return names[feature] || feature;
  }
}

// Initialize the application
console.log('🚀 Demo App2 (Split Package) initialized successfully!');
console.log('📦 Dependencies are split into separate chunks for optimal loading');