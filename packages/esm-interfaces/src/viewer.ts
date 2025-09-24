import { IComponent } from './common';

export interface IViewer<T = any> extends IComponent {
  load(data: T): Promise<void>;
  refresh(): Promise<void>;
  getViewData(): T;
  setReadOnly(readOnly: boolean): void;
  isReadOnly(): boolean;
}

export interface IDataSourceViewer extends IViewer<IDataSourceConfig> {
  testConnection(): Promise<boolean>;
  getSchema(): Promise<ISchemaInfo>;
  previewData(limit?: number): Promise<any[]>;
}

export interface IDataSourceConfig {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  connectionProperties?: Record<string, any>;
}

export interface ISchemaInfo {
  tables: ITableInfo[];
  views: IViewInfo[];
}

export interface ITableInfo {
  name: string;
  schema?: string;
  columns: IColumnInfo[];
  primaryKeys: string[];
  foreignKeys: IForeignKeyInfo[];
}

export interface IViewInfo {
  name: string;
  schema?: string;
  definition: string;
  columns: IColumnInfo[];
}

export interface IColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  comment?: string;
}

export interface IForeignKeyInfo {
  name: string;
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
}