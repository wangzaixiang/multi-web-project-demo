import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property, query } from '@demo/lit-all';

@customElement('h2-input')
export class H2Input extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    label {
      font-size: 14px;
      font-weight: 500;
      color: var(--h2-input-label-color, #333);
    }
    
    input {
      padding: 8px 12px;
      border: 1px solid var(--h2-input-border-color, #ccc);
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
      width: 100%;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: var(--h2-input-focus-border-color, #007bff);
      box-shadow: 0 0 0 2px var(--h2-input-focus-shadow-color, rgba(0, 123, 255, 0.25));
    }
    
    input:disabled {
      background-color: var(--h2-input-disabled-bg, #f8f9fa);
      cursor: not-allowed;
    }
    
    .error {
      border-color: var(--h2-input-error-border-color, #dc3545);
    }
    
    .error-message {
      color: var(--h2-input-error-color, #dc3545);
      font-size: 12px;
    }
  `;

  @property({ type: String })
  label = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  error = '';

  @query('input')
  private _input!: HTMLInputElement;

  render() {
    return html`
      <div class="input-container">
        ${this.label ? html`<label for="input">${this.label}</label>` : ''}
        <input
          id="input"
          type="${this.type}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          class="${this.error ? 'error' : ''}"
          @input="${this._handleInput}"
          @change="${this._handleChange}"
          @blur="${this._handleBlur}"
        />
        ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('h2-input', {
      detail: { value: this.value, originalEvent: e },
      bubbles: true,
      composed: true
    }));
  }

  private _handleChange(e: Event) {
    this.dispatchEvent(new CustomEvent('h2-change', {
      detail: { value: this.value, originalEvent: e },
      bubbles: true,
      composed: true
    }));
  }

  private _handleBlur(e: Event) {
    this.dispatchEvent(new CustomEvent('h2-blur', {
      detail: { value: this.value, originalEvent: e },
      bubbles: true,
      composed: true
    }));
  }

  focus() {
    this._input?.focus();
  }

  blur() {
    this._input?.blur();
  }
}