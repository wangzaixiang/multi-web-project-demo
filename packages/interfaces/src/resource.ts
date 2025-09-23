export interface IResourceNode {
  id: string;
  name: string;
  type: 'datasource' | 'sql_view' | 'java_view' | 'cube' | 'dashboard' | 'folder';
  parentId?: string;
  children?: IResourceNode[];
  metadata?: Record<string, any>;
  permissions?: IResourcePermissions;
}

export interface IResourcePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
  delete: boolean;
  admin: boolean;
}

export interface IResourceOperation {
  rename(id: string, name: string): Promise<void>;
  move(id: string, targetId: string): Promise<void>;
  copy(id: string, targetId: string): Promise<string>;
  delete(id: string): Promise<void>;
  getProperties(id: string): Promise<Record<string, any>>;
  setProperties(id: string, properties: Record<string, any>): Promise<void>;
}

export interface IResourceProvider {
  getResource(id: string): Promise<IResourceNode>;
  getChildren(parentId: string): Promise<IResourceNode[]>;
  searchResources(query: string): Promise<IResourceNode[]>;
  createResource(parentId: string, type: IResourceNode['type'], name: string): Promise<string>;
}