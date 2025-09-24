import { LitElement, html, css } from '@demo/lit-all';
import { customElement, property, state, query } from '@demo/lit-all';

@customElement('h2-dialog')
export class H2Dialog extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
    
    :host([open]) {
      display: block;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-width: 300px;
    }
    
    .header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--h2-dialog-border-color, #e9ecef);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--h2-dialog-title-color, #333);
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--h2-dialog-close-color, #666);
    }
    
    .close-button:hover {
      color: var(--h2-dialog-close-hover-color, #333);
    }
    
    .content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    
    .footer {
      padding: 16px 20px;
      border-top: 1px solid var(--h2-dialog-border-color, #e9ecef);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .size-sm {
      min-width: 300px;
      max-width: 400px;
    }
    
    .size-md {
      min-width: 400px;
      max-width: 600px;
    }
    
    .size-lg {
      min-width: 600px;
      max-width: 800px;
    }
    
    .size-xl {
      min-width: 800px;
      max-width: 1000px;
    }
  `;

  @property({ type: String })
  title = '';

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  @property({ type: Boolean })
  closable = true;

  @property({ type: Boolean })
  closeOnOverlayClick = true;

  @query('.dialog')
  private _dialog!: HTMLElement;

  render() {
    if (!this.open) return html``;

    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="dialog size-${this.size}" @click="${this._stopPropagation}">
          ${this.title || this.closable ? html`
            <div class="header">
              ${this.title ? html`<h2 class="title">${this.title}</h2>` : html`<div></div>`}
              ${this.closable ? html`
                <button class="close-button" @click="${this.close}">×</button>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="content">
            <slot></slot>
          </div>
          
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('h2-dialog-open', {
      bubbles: true,
      composed: true
    }));
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('h2-dialog-close', {
      bubbles: true,
      composed: true
    }));
  }

  private _handleOverlayClick(e: Event) {
    if (this.closeOnOverlayClick && e.target === e.currentTarget) {
      this.close();
    }
  }

  private _stopPropagation(e: Event) {
    e.stopPropagation();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    
    if (changedProperties.has('open')) {
      if (this.open) {
        document.body.style.overflow = 'hidden';
        this.addEventListener('keydown', this._handleKeyDown);
      } else {
        document.body.style.overflow = '';
        this.removeEventListener('keydown', this._handleKeyDown);
      }
    }
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closable) {
      this.close();
    }
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.style.overflow = '';
    this.removeEventListener('keydown', this._handleKeyDown);
  }
}