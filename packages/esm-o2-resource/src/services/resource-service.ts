import type { 
  IResourceNode, 
  IResourceOperation, 
  IResourceProvider 
} from '@esm/interfaces';

export class ResourceService implements IResourceProvider, IResourceOperation {
  private _mockData: IResourceNode[] = [
    {
      id: 'root',
      name: 'Resources',
      type: 'folder',
      children: [
        {
          id: 'datasources',
          name: 'Data Sources',
          type: 'folder',
          parentId: 'root',
          children: [
            {
              id: 'mysql-db',
              name: 'MySQL Database',
              type: 'datasource',
              parentId: 'datasources',
              metadata: { host: 'localhost', port: 3306 }
            },
            {
              id: 'postgres-db',
              name: 'PostgreSQL Database',
              type: 'datasource',
              parentId: 'datasources',
              metadata: { host: 'localhost', port: 5432 }
            }
          ]
        },
        {
          id: 'sql-views',
          name: 'SQL Views',
          type: 'folder',
          parentId: 'root',
          children: [
            {
              id: 'user-report',
              name: 'User Report View',
              type: 'sql_view',
              parentId: 'sql-views',
              metadata: { sql: 'SELECT * FROM users WHERE active = 1' }
            }
          ]
        },
        {
          id: 'cubes',
          name: 'Data Cubes',
          type: 'folder',
          parentId: 'root',
          children: [
            {
              id: 'sales-cube',
              name: 'Sales Analysis Cube',
              type: 'cube',
              parentId: 'cubes',
              metadata: { dimensions: ['time', 'product', 'region'] }
            }
          ]
        },
        {
          id: 'dashboards',
          name: 'Dashboards',
          type: 'folder',
          parentId: 'root',
          children: [
            {
              id: 'sales-dashboard',
              name: 'Sales Dashboard',
              type: 'dashboard',
              parentId: 'dashboards',
              metadata: { widgets: ['chart1', 'table1', 'kpi1'] }
            }
          ]
        }
      ]
    }
  ];

  async getResource(id: string): Promise<IResourceNode> {
    const resource = this._findResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    return { ...resource };
  }

  async getChildren(parentId: string): Promise<IResourceNode[]> {
    const parent = this._findResourceById(parentId);
    return parent?.children ? [...parent.children] : [];
  }

  async searchResources(query: string): Promise<IResourceNode[]> {
    const results: IResourceNode[] = [];
    this._searchInTree(this._mockData, query.toLowerCase(), results);
    return results;
  }

  async createResource(parentId: string, type: IResourceNode['type'], name: string): Promise<string> {
    const newId = `${type}-${Date.now()}`;
    const newResource: IResourceNode = {
      id: newId,
      name,
      type,
      parentId,
      metadata: {}
    };

    const parent = this._findResourceById(parentId);
    if (!parent) {
      throw new Error(`Parent resource with id ${parentId} not found`);
    }

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newResource);

    return newId;
  }

  async rename(id: string, name: string): Promise<void> {
    const resource = this._findResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    resource.name = name;
  }

  async move(id: string, targetId: string): Promise<void> {
    const resource = this._findResourceById(id);
    const target = this._findResourceById(targetId);
    
    if (!resource || !target) {
      throw new Error('Resource or target not found');
    }

    if (target.type !== 'folder') {
      throw new Error('Target must be a folder');
    }

    this._removeFromParent(id);
    
    if (!target.children) {
      target.children = [];
    }
    target.children.push(resource);
    resource.parentId = targetId;
  }

  async copy(id: string, targetId: string): Promise<string> {
    const resource = this._findResourceById(id);
    const target = this._findResourceById(targetId);
    
    if (!resource || !target) {
      throw new Error('Resource or target not found');
    }

    if (target.type !== 'folder') {
      throw new Error('Target must be a folder');
    }

    const newId = `${resource.type}-${Date.now()}`;
    const copiedResource: IResourceNode = {
      ...resource,
      id: newId,
      name: `Copy of ${resource.name}`,
      parentId: targetId,
      children: resource.children ? this._deepCopyChildren(resource.children) : undefined
    };

    if (!target.children) {
      target.children = [];
    }
    target.children.push(copiedResource);

    return newId;
  }

  async delete(id: string): Promise<void> {
    this._removeFromParent(id);
  }

  async getProperties(id: string): Promise<Record<string, any>> {
    const resource = this._findResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    return {
      id: resource.id,
      name: resource.name,
      type: resource.type,
      parentId: resource.parentId,
      metadata: resource.metadata || {},
      permissions: resource.permissions || {
        read: true,
        write: true,
        execute: true,
        delete: true,
        admin: false
      }
    };
  }

  async setProperties(id: string, properties: Record<string, any>): Promise<void> {
    const resource = this._findResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }

    if (properties.name) resource.name = properties.name;
    if (properties.metadata) resource.metadata = { ...resource.metadata, ...properties.metadata };
    if (properties.permissions) resource.permissions = properties.permissions;
  }

  getRootResources(): IResourceNode[] {
    return [...this._mockData];
  }

  private _findResourceById(id: string): IResourceNode | null {
    const findInTree = (nodes: IResourceNode[]): IResourceNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(this._mockData);
  }

  private _searchInTree(nodes: IResourceNode[], query: string, results: IResourceNode[]) {
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(query)) {
        results.push({ ...node });
      }
      if (node.children) {
        this._searchInTree(node.children, query, results);
      }
    }
  }

  private _removeFromParent(id: string) {
    const removeFromArray = (nodes: IResourceNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && removeFromArray(nodes[i].children!)) {
          return true;
        }
      }
      return false;
    };

    removeFromArray(this._mockData);
  }

  private _deepCopyChildren(children: IResourceNode[]): IResourceNode[] {
    return children.map(child => ({
      ...child,
      id: `${child.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: child.children ? this._deepCopyChildren(child.children) : undefined
    }));
  }
}