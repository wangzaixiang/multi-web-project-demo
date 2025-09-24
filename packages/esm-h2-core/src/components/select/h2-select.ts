import { LitElement, html, css } from '@esm/lit-all';
import { customElement, property, state, query } from '@esm/lit-all';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('h2-select')
export class H2Select extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    
    .select-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    label {
      font-size: 14px;
      font-weight: 500;
      color: var(--h2-select-label-color, #333);
    }
    
    .select-trigger {
      padding: 8px 12px;
      border: 1px solid var(--h2-select-border-color, #ccc);
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
    }
    
    .select-trigger:focus {
      outline: none;
      border-color: var(--h2-select-focus-border-color, #007bff);
      box-shadow: 0 0 0 2px var(--h2-select-focus-shadow-color, rgba(0, 123, 255, 0.25));
    }
    
    .select-trigger.disabled {
      background-color: var(--h2-select-disabled-bg, #f8f9fa);
      cursor: not-allowed;
    }
    
    .arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #666;
      transition: transform 0.2s;
    }
    
    .arrow.open {
      transform: rotate(180deg);
    }
    
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid var(--h2-select-border-color, #ccc);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .option {
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .option:hover:not(.disabled) {
      background-color: var(--h2-select-option-hover-bg, #f8f9fa);
    }
    
    .option.selected {
      background-color: var(--h2-select-option-selected-bg, #007bff);
      color: white;
    }
    
    .option.disabled {
      color: #ccc;
      cursor: not-allowed;
    }
    
    .placeholder {
      color: var(--h2-select-placeholder-color, #999);
    }
  `;

  @property({ type: String })
  label = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = 'Select an option';

  @property({ type: Array })
  options: SelectOption[] = [];

  @property({ type: Boolean })
  disabled = false;

  @state()
  private _open = false;

  @query('.select-trigger')
  private _trigger!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
  }

  render() {
    const selectedOption = this.options.find(opt => opt.value === this.value);
    
    return html`
      <div class="select-container">
        ${this.label ? html`<label>${this.label}</label>` : ''}
        <div 
          class="select-trigger ${this.disabled ? 'disabled' : ''}"
          tabindex="${this.disabled ? -1 : 0}"
          @click="${this._handleTriggerClick}"
          @keydown="${this._handleKeyDown}"
        >
          <span class="${!selectedOption ? 'placeholder' : ''}">
            ${selectedOption ? selectedOption.label : this.placeholder}
          </span>
          <div class="arrow ${this._open ? 'open' : ''}"></div>
        </div>
        ${this._open && !this.disabled ? html`
          <div class="dropdown">
            ${this.options.map(option => html`
              <div 
                class="option ${option.value === this.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}"
                @click="${() => this._selectOption(option)}"
              >
                ${option.label}
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _handleTriggerClick() {
    if (!this.disabled) {
      this._open = !this._open;
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this._open = !this._open;
        break;
      case 'Escape':
        this._open = false;
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!this._open) {
          this._open = true;
        } else {
          this._selectNextOption();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this._open) {
          this._selectPreviousOption();
        }
        break;
    }
  }

  private _selectOption(option: SelectOption) {
    if (option.disabled) return;
    
    this.value = option.value;
    this._open = false;
    
    this.dispatchEvent(new CustomEvent('h2-change', {
      detail: { value: this.value, option },
      bubbles: true,
      composed: true
    }));
  }

  private _selectNextOption() {
    const currentIndex = this.options.findIndex(opt => opt.value === this.value);
    const nextIndex = currentIndex < this.options.length - 1 ? currentIndex + 1 : 0;
    const nextOption = this.options[nextIndex];
    if (nextOption && !nextOption.disabled) {
      this._selectOption(nextOption);
    }
  }

  private _selectPreviousOption() {
    const currentIndex = this.options.findIndex(opt => opt.value === this.value);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.options.length - 1;
    const prevOption = this.options[prevIndex];
    if (prevOption && !prevOption.disabled) {
      this._selectOption(prevOption);
    }
  }

  private _handleDocumentClick = (e: Event) => {
    if (!this.contains(e.target as Node)) {
      this._open = false;
    }
  };
}