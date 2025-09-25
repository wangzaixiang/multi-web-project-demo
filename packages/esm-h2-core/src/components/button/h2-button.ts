import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property } from '@esm/lit-all';


@customElement('h2-button')
export class H2Button extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    
    button {
      background: var(--h2-button-bg, #007bff);
      color: var(--h2-button-color, white);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background: var(--h2-button-hover-bg, #0056b3);
    }
    
    button:disabled {
      background: var(--h2-button-disabled-bg, #6c757d);
      cursor: not-allowed;
    }
    
    .secondary {
      background: var(--h2-button-secondary-bg, #6c757d);
    }
    
    .secondary:hover {
      background: var(--h2-button-secondary-hover-bg, #545b62);
    }
    
    .danger {
      background: var(--h2-button-danger-bg, #dc3545);
    }
    
    .danger:hover {
      background: var(--h2-button-danger-hover-bg, #c82333);
    }
  `;

  @property({ type: String })
  variant: 'primary' | 'secondary' | 'danger' = 'primary';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html`
      <button 
        type="${this.type}"
        ?disabled="${this.disabled}"
        class="${this.variant}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('h2-click', {
      detail: { originalEvent: e },
      bubbles: true,
      composed: true
    }));
  }
}