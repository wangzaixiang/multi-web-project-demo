import { LitElement } from '@esm/lit-all';
import { IJavaEditor, ICompileResult } from '@esm/interfaces';
export declare class O2JavaEditor extends LitElement implements IJavaEditor {
    static styles: import('@esm/lit-all').CSSResult;
    value: string;
    readOnly: boolean;
    render(): import('@esm/lit-all').TemplateResult<1>;
    private _handleInput;
    private _handleCompile;
    private _handleFormat;
    load(data: string): Promise<void>;
    save(): Promise<string>;
    isDirty(): boolean;
    validate(): boolean;
    getValidationErrors(): string[];
    setReadOnly(readOnly: boolean): void;
    isReadOnly(): boolean;
    compile(): Promise<ICompileResult>;
    format(): void;
    getSelectedText(): string;
    insertText(text: string): void;
    goToLine(line: number): void;
    findAndReplace(search: string, replace: string): void;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map