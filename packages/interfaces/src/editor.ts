import { IComponent } from './common';

export interface IEditor<T = any> extends IComponent {
  load(data: T): Promise<void>;
  save(): Promise<T>;
  isDirty(): boolean;
  validate(): boolean;
  getValidationErrors(): string[];
  setReadOnly(readOnly: boolean): void;
  isReadOnly(): boolean;
}

export interface ISqlEditor extends IEditor<string> {
  execute(): Promise<IQueryResult>;
  format(): void;
  getSelectedText(): string;
  insertText(text: string): void;
  setAutoComplete(enabled: boolean): void;
}

export interface IJavaEditor extends IEditor<string> {
  compile(): Promise<ICompileResult>;
  format(): void;
  getSelectedText(): string;
  insertText(text: string): void;
  goToLine(line: number): void;
  findAndReplace(search: string, replace: string): void;
}

export interface IQueryResult {
  success: boolean;
  data?: any[];
  columns?: IColumnMeta[];
  rowCount?: number;
  executionTime?: number;
  error?: string;
}

export interface IColumnMeta {
  name: string;
  type: string;
  displayName?: string;
}

export interface ICompileResult {
  success: boolean;
  errors?: ICompileError[];
  warnings?: ICompileWarning[];
  bytecode?: Uint8Array;
}

export interface ICompileError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ICompileWarning {
  line: number;
  column: number;
  message: string;
}