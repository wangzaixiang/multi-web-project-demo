import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@demo/h2-core';
import '@demo/h2-extra';

@customElement('demo-app3')
export class DemoApp3 extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .section {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #ffffff;
    }
    
    .section h3 {
      margin-top: 0;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 8px;
    }
    
    .form-demo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    
    .form-demo.full {
      grid-template-columns: 1fr;
    }
    
    .button-group {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    
    .tree-demo {
      height: 300px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .datagrid-demo {
      height: 300px;
      margin-top: 16px;
    }
    
    .output {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      margin-top: 16px;
      font-family: monospace;
      font-size: 14px;
      white-space: pre-wrap;
    }
  `;

  @state()
  private _formData = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'developer',
    active: true
  };

  @state()
  private _output = 'Component interactions will appear here...';

  @state()
  private _sampleData = [
    { id: 1, name: 'Alice Johnson', role: 'Developer', active: true },
    { id: 2, name: 'Bob Smith', role: 'Designer', active: true },
    { id: 3, name: 'Carol Davis', role: 'Manager', active: false },
    { id: 4, name: 'David Wilson', role: 'Developer', active: true },
    { id: 5, name: 'Eva Brown', role: 'Tester', active: true }
  ];

  render() {
    return html`
      <div class="demo-container">
        <div class="section">
          <h3>🎛️ Basic Form Components</h3>
          <p>Demonstrating h2-core components: buttons, inputs, selects, and dialogs</p>
          
          <div class="form-demo">
            <h2-input
              label="Full Name"
              .value="${this._formData.name}"
              @h2-input="${(e: CustomEvent) => this._updateFormData('name', e.detail.value)}"
            ></h2-input>
            
            <h2-input
              label="Email Address"
              type="email"
              .value="${this._formData.email}"
              @h2-input="${(e: CustomEvent) => this._updateFormData('email', e.detail.value)}"
            ></h2-input>
            
            <h2-select
              label="Role"
              .value="${this._formData.role}"
              .options="${[
                { value: 'developer', label: 'Developer' },
                { value: 'designer', label: 'Designer' },
                { value: 'manager', label: 'Manager' },
                { value: 'tester', label: 'Tester' }
              ]}"
              @h2-change="${(e: CustomEvent) => this._updateFormData('role', e.detail.value)}"
            ></h2-select>
          </div>
          
          <div class="button-group">
            <h2-button variant="primary" @h2-click="${this._handleSave}">
              💾 Save Changes
            </h2-button>
            
            <h2-button variant="secondary" @h2-click="${this._handleReset}">
              🔄 Reset Form
            </h2-button>
            
            <h2-button variant="danger" @h2-click="${this._showDialog}">
              🗑️ Delete User
            </h2-button>
          </div>
        </div>
        
        <div class="section">
          <h3>🌳 Tree Component Demo</h3>
          <p>Demonstrating h2-extra tree component with hierarchical data</p>
          
          <div class="tree-demo">
            <h2-tree 
              .data="${this._getTreeData()}"
              @node-click="${this._handleTreeNodeClick}"
              @node-select="${this._handleTreeNodeSelect}"
            ></h2-tree>
          </div>
        </div>
        
        <div class="section">
          <h3>📊 Data Grid Demo</h3>
          <p>Demonstrating h2-extra data grid with sorting and selection</p>
          
          <div class="datagrid-demo">
            <h2-datagrid
              .columns="${[
                { key: 'id', title: 'ID', width: 60 },
                { key: 'name', title: 'Name', width: 200 },
                { key: 'role', title: 'Role', width: 150 },
                { key: 'active', title: 'Active', width: 100, render: (value: boolean) => value ? '✅' : '❌' }
              ]}"
              .data="${this._sampleData}"
              .options="${{
                selectable: true,
                multiSelect: true,
                sortable: true,
                pagination: true,
                pageSize: 3
              }}"
              @selection-change="${this._handleGridSelection}"
              @cell-click="${this._handleCellClick}"
            ></h2-datagrid>
          </div>
        </div>
        
        <div class="section">
          <h3>📝 Output Log</h3>
          <div class="output">${this._output}</div>
        </div>
        
        <h2-dialog id="delete-dialog" title="Confirm Deletion" size="sm">
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          
          <div slot="footer">
            <h2-button variant="secondary" @h2-click="${this._closeDialog}">
              Cancel
            </h2-button>
            <h2-button variant="danger" @h2-click="${this._confirmDelete}">
              Delete
            </h2-button>
          </div>
        </h2-dialog>
      </div>
    `;
  }

  private _updateFormData(field: string, value: any) {
    this._formData = { ...this._formData, [field]: value };
    this._log(`Form field '${field}' updated to: ${value}`);
  }

  private _handleSave() {
    this._log(`Saving user data: ${JSON.stringify(this._formData, null, 2)}`);
  }

  private _handleReset() {
    this._formData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'developer',
      active: true
    };
    this._log('Form data reset to defaults');
  }

  private _showDialog() {
    const dialog = this.shadowRoot?.querySelector('#delete-dialog') as any;
    dialog?.show();
    this._log('Delete confirmation dialog opened');
  }

  private _closeDialog() {
    const dialog = this.shadowRoot?.querySelector('#delete-dialog') as any;
    dialog?.close();
    this._log('Delete dialog cancelled');
  }

  private _confirmDelete() {
    this._closeDialog();
    this._log(`User '${this._formData.name}' would be deleted (demo only)`);
  }

  private _handleTreeNodeClick(e: CustomEvent) {
    const { node } = e.detail;
    this._log(`Tree node clicked: ${node.label} (ID: ${node.id})`);
  }

  private _handleTreeNodeSelect(e: CustomEvent) {
    const { node } = e.detail;
    this._log(`Tree node selected: ${node.label}`);
  }

  private _handleGridSelection(e: CustomEvent) {
    const { selectedRows } = e.detail;
    this._log(`Data grid selection changed: ${selectedRows.length} rows selected`);
  }

  private _handleCellClick(e: CustomEvent) {
    const { row, column } = e.detail;
    this._log(`Cell clicked: ${column.key} = ${row[column.key]} for user ${row.name}`);
  }

  private _getTreeData() {
    return [
      {
        id: 'users',
        label: 'Users',
        icon: '👥',
        expanded: true,
        children: [
          {
            id: 'developers',
            label: 'Developers',
            icon: '💻',
            expanded: true,
            children: [
              { id: 'dev1', label: 'Alice Johnson', icon: '👩‍💻' },
              { id: 'dev2', label: 'David Wilson', icon: '👨‍💻' }
            ]
          },
          {
            id: 'designers',
            label: 'Designers',
            icon: '🎨',
            children: [
              { id: 'des1', label: 'Bob Smith', icon: '👨‍🎨' }
            ]
          },
          {
            id: 'managers',
            label: 'Managers',
            icon: '👔',
            children: [
              { id: 'mgr1', label: 'Carol Davis', icon: '👩‍💼' }
            ]
          }
        ]
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        children: [
          { id: 'proj1', label: 'Web Application', icon: '🌐' },
          { id: 'proj2', label: 'Mobile App', icon: '📱' },
          { id: 'proj3', label: 'API Service', icon: '🔌' }
        ]
      }
    ];
  }

  private _log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this._output = `[${timestamp}] ${message}\n${this._output}`;
  }
}

// Initialize the application
console.log('🚀 Demo App3 (Minimal) initialized successfully!');
console.log('⚡ Using only core components for optimal performance');