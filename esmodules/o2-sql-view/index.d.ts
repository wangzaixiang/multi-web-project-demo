import { LitElement } from '@esm/lit-all';
import { ISqlEditor, IQueryResult } from '@esm/interfaces';
export declare class O2SqlEditor extends LitElement implements ISqlEditor {
    static styles: import('@esm/lit-all').CSSResult;
    value: string;
    readOnly: boolean;
    render(): import('@esm/lit-all').TemplateResult<1>;
    private _handleInput;
    private _handleExecute;
    private _handleFormat;
    load(data: string): Promise<void>;
    save(): Promise<string>;
    isDirty(): boolean;
    validate(): boolean;
    getValidationErrors(): string[];
    setReadOnly(readOnly: boolean): void;
    isReadOnly(): boolean;
    execute(): Promise<IQueryResult>;
    format(): void;
    getSelectedText(): string;
    insertText(text: string): void;
    setAutoComplete(enabled: boolean): void;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map