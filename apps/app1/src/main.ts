import { LitElement, html, css } from '@esm/lit-all';
import { customElement, state } from '@esm/lit-all';
import {H2Button, H2Input} from '@esm/h2-core';
import '@esm/h2-extra';
import '@esm/o2-resource';
import '@esm/o2-datasource';
import '@esm/o2-sql-view';
import '@esm/o2-java-view';
import '@esm/o2-cube';
import '@esm/o2-dashboard';

@customElement('demo-app1')
export class DemoApp1 extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .app-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 600px;
      gap: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .sidebar {
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      overflow: hidden;
    }
    
    .main-content {
      padding: 16px;
      overflow: auto;
    }
    
    .toolbar {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      background: white;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .content-area {
      height: 500px;
      overflow: hidden;
    }
    
    .tab-buttons {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
    }
    
    .tab-button {
      padding: 8px 16px;
      border: 1px solid #e0e0e0;
      background: white;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
      transition: all 0.2s;
    }
    
    .tab-button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .tab-content {
      height: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 0 4px 4px 4px;
      overflow: hidden;
    }
    
    .welcome {
      padding: 40px;
      text-align: center;
      color: #666;
    }
  `;

  @state()
  private _activeTab = 'resource';

  @state()
  private _selectedResource: any = null;

    constructor() {
        super();
        // let a = new H2Button();
        // let b = new H2Input();
    }


    render() {
    return html`
      <div class="app-container">
        <div class="sidebar">
          <o2-resource-tree
            @resource-select="${this._handleResourceSelect}"
          ></o2-resource-tree>
        </div>
        
        <div class="main-content">
          <div class="toolbar">
            <h2-button 
              variant="primary" 
              @h2-click="${() => this._setActiveTab('resource')}"
            >
              Resources
            </h2-button>
            
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._setActiveTab('datasource')}"
            >
              Data Sources
            </h2-button>
            
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._setActiveTab('sql')}"
            >
              SQL Editor
            </h2-button>
            
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._setActiveTab('java')}"
            >
              Java Editor
            </h2-button>
            
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._setActiveTab('cube')}"
            >
              Cube Analysis
            </h2-button>
            
            <h2-button 
              variant="secondary"
              @h2-click="${() => this._setActiveTab('dashboard')}"
            >
              Dashboard
            </h2-button>
          </div>
          
          <div class="content-area">
            ${this._renderTabContent()}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTabContent() {
    switch (this._activeTab) {
      case 'resource':
        return html`
          <o2-resource-searcher
            @result-select="${this._handleResourceSelect}"
          ></o2-resource-searcher>
        `;
      
      case 'datasource':
        return html`
          <o2-datasource-viewer
            .data="${this._getMockDataSourceConfig()}"
          ></o2-datasource-viewer>
        `;
      
      case 'sql':
        return html`
          <o2-sql-editor
            .value="${this._getMockSqlQuery()}"
          ></o2-sql-editor>
        `;
      
      case 'java':
        return html`
          <o2-java-editor
            .value="${this._getMockJavaCode()}"
          ></o2-java-editor>
        `;
      
      case 'cube':
        return html`
          <o2-cube-analyzer></o2-cube-analyzer>
        `;
      
      case 'dashboard':
        return html`
          <o2-dashboard-designer></o2-dashboard-designer>
        `;
      
      default:
        return html`
          <div class="welcome">
            <h2>Welcome to Demo App1</h2>
            <p>This application demonstrates the full bundle approach where all dependencies are packaged into a single JavaScript file.</p>
            <p>Select a tab above to explore different features.</p>
          </div>
        `;
    }
  }

  private _setActiveTab(tab: string) {
    this._activeTab = tab;
  }

  private _handleResourceSelect(e: CustomEvent) {
    this._selectedResource = e.detail.resource;
    console.log('Selected resource:', this._selectedResource);
  }

  private _getMockDataSourceConfig() {
    return {
      id: 'demo-db',
      name: 'Demo Database',
      type: 'mysql' as const,
      host: 'localhost',
      port: 3306,
      database: 'demo',
      username: 'demo_user'
    };
  }

  private _getMockSqlQuery() {
    return `SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = 1
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC
LIMIT 100;`;
  }

  private _getMockJavaCode() {
    return `public class DataProcessor {
    private final DatabaseConnection connection;
    
    public DataProcessor(DatabaseConnection connection) {
        this.connection = connection;
    }
    
    public List<User> processUsers() {
        String sql = "SELECT * FROM users WHERE active = 1";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            ResultSet rs = stmt.executeQuery();
            List<User> users = new ArrayList<>();
            
            while (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                users.add(user);
            }
            
            return users;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to process users", e);
        }
    }
}`;
  }
}

// Initialize the application
console.log('🚀 Demo App1 (Full Bundle) initialized successfully!');
console.log('📦 All dependencies are bundled into this single file');