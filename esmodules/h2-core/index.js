import { css as g, property as s, customElement as f, LitElement as y, html as a, query as w, state as _ } from "@esm/lit-all";
var m = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, x = (e, t, r, i) => {
  for (var o = i > 1 ? void 0 : i ? $(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (o = (i ? n(t, r, o) : n(o)) || o);
  return i && o && m(t, r, o), o;
};
let v = class extends y {
  constructor() {
    super(...arguments), this.variant = "primary", this.disabled = !1, this.type = "button";
  }
  render() {
    return a`
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
  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault(), e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent("h2-click", {
      detail: { originalEvent: e },
      bubbles: !0,
      composed: !0
    }));
  }
};
v.styles = g`
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
x([
  s({ type: String })
], v.prototype, "variant", 2);
x([
  s({ type: Boolean })
], v.prototype, "disabled", 2);
x([
  s({ type: String })
], v.prototype, "type", 2);
v = x([
  f("h2-button")
], v);
var k = Object.defineProperty, O = Object.getOwnPropertyDescriptor, h = (e, t, r, i) => {
  for (var o = i > 1 ? void 0 : i ? O(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (o = (i ? n(t, r, o) : n(o)) || o);
  return i && o && k(t, r, o), o;
};
let d = class extends y {
  constructor() {
    super(...arguments), this.label = "", this.value = "", this.placeholder = "", this.type = "text", this.disabled = !1, this.required = !1, this.error = "";
  }
  render() {
    return a`
      <div class="input-container">
        ${this.label ? a`<label for="input">${this.label}</label>` : ""}
        <input
          id="input"
          type="${this.type}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          class="${this.error ? "error" : ""}"
          @input="${this._handleInput}"
          @change="${this._handleChange}"
          @blur="${this._handleBlur}"
        />
        ${this.error ? a`<div class="error-message">${this.error}</div>` : ""}
      </div>
    `;
  }
  _handleInput(e) {
    const t = e.target;
    this.value = t.value, this.dispatchEvent(new CustomEvent("h2-input", {
      detail: { value: this.value, originalEvent: e },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleChange(e) {
    this.dispatchEvent(new CustomEvent("h2-change", {
      detail: { value: this.value, originalEvent: e },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleBlur(e) {
    this.dispatchEvent(new CustomEvent("h2-blur", {
      detail: { value: this.value, originalEvent: e },
      bubbles: !0,
      composed: !0
    }));
  }
  focus() {
    var e;
    (e = this._input) == null || e.focus();
  }
  blur() {
    var e;
    (e = this._input) == null || e.blur();
  }
};
d.styles = g`
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
h([
  s({ type: String })
], d.prototype, "label", 2);
h([
  s({ type: String })
], d.prototype, "value", 2);
h([
  s({ type: String })
], d.prototype, "placeholder", 2);
h([
  s({ type: String })
], d.prototype, "type", 2);
h([
  s({ type: Boolean })
], d.prototype, "disabled", 2);
h([
  s({ type: Boolean })
], d.prototype, "required", 2);
h([
  s({ type: String })
], d.prototype, "error", 2);
h([
  w("input")
], d.prototype, "_input", 2);
d = h([
  f("h2-input")
], d);
var C = Object.defineProperty, E = Object.getOwnPropertyDescriptor, u = (e, t, r, i) => {
  for (var o = i > 1 ? void 0 : i ? E(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (o = (i ? n(t, r, o) : n(o)) || o);
  return i && o && C(t, r, o), o;
};
let p = class extends y {
  constructor() {
    super(...arguments), this.label = "", this.value = "", this.placeholder = "Select an option", this.options = [], this.disabled = !1, this._open = !1, this._handleDocumentClick = (e) => {
      this.contains(e.target) || (this._open = !1);
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("click", this._handleDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("click", this._handleDocumentClick);
  }
  render() {
    const e = this.options.find((t) => t.value === this.value);
    return a`
      <div class="select-container">
        ${this.label ? a`<label>${this.label}</label>` : ""}
        <div 
          class="select-trigger ${this.disabled ? "disabled" : ""}"
          tabindex="${this.disabled ? -1 : 0}"
          @click="${this._handleTriggerClick}"
          @keydown="${this._handleKeyDown}"
        >
          <span class="${e ? "" : "placeholder"}">
            ${e ? e.label : this.placeholder}
          </span>
          <div class="arrow ${this._open ? "open" : ""}"></div>
        </div>
        ${this._open && !this.disabled ? a`
          <div class="dropdown">
            ${this.options.map((t) => a`
              <div 
                class="option ${t.value === this.value ? "selected" : ""} ${t.disabled ? "disabled" : ""}"
                @click="${() => this._selectOption(t)}"
              >
                ${t.label}
              </div>
            `)}
          </div>
        ` : ""}
      </div>
    `;
  }
  _handleTriggerClick() {
    this.disabled || (this._open = !this._open);
  }
  _handleKeyDown(e) {
    if (!this.disabled)
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault(), this._open = !this._open;
          break;
        case "Escape":
          this._open = !1;
          break;
        case "ArrowDown":
          e.preventDefault(), this._open ? this._selectNextOption() : this._open = !0;
          break;
        case "ArrowUp":
          e.preventDefault(), this._open && this._selectPreviousOption();
          break;
      }
  }
  _selectOption(e) {
    e.disabled || (this.value = e.value, this._open = !1, this.dispatchEvent(new CustomEvent("h2-change", {
      detail: { value: this.value, option: e },
      bubbles: !0,
      composed: !0
    })));
  }
  _selectNextOption() {
    const e = this.options.findIndex((i) => i.value === this.value), t = e < this.options.length - 1 ? e + 1 : 0, r = this.options[t];
    r && !r.disabled && this._selectOption(r);
  }
  _selectPreviousOption() {
    const e = this.options.findIndex((i) => i.value === this.value), t = e > 0 ? e - 1 : this.options.length - 1, r = this.options[t];
    r && !r.disabled && this._selectOption(r);
  }
};
p.styles = g`
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
u([
  s({ type: String })
], p.prototype, "label", 2);
u([
  s({ type: String })
], p.prototype, "value", 2);
u([
  s({ type: String })
], p.prototype, "placeholder", 2);
u([
  s({ type: Array })
], p.prototype, "options", 2);
u([
  s({ type: Boolean })
], p.prototype, "disabled", 2);
u([
  _()
], p.prototype, "_open", 2);
u([
  w(".select-trigger")
], p.prototype, "_trigger", 2);
p = u([
  f("h2-select")
], p);
var D = Object.defineProperty, P = Object.getOwnPropertyDescriptor, b = (e, t, r, i) => {
  for (var o = i > 1 ? void 0 : i ? P(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (o = (i ? n(t, r, o) : n(o)) || o);
  return i && o && D(t, r, o), o;
};
let c = class extends y {
  constructor() {
    super(...arguments), this.title = "", this.open = !1, this.size = "md", this.closable = !0, this.closeOnOverlayClick = !0, this._handleKeyDown = (e) => {
      e.key === "Escape" && this.closable && this.close();
    };
  }
  render() {
    return this.open ? a`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="dialog size-${this.size}" @click="${this._stopPropagation}">
          ${this.title || this.closable ? a`
            <div class="header">
              ${this.title ? a`<h2 class="title">${this.title}</h2>` : a`<div></div>`}
              ${this.closable ? a`
                <button class="close-button" @click="${this.close}">×</button>
              ` : ""}
            </div>
          ` : ""}
          
          <div class="content">
            <slot></slot>
          </div>
          
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    ` : a``;
  }
  show() {
    this.open = !0, this.dispatchEvent(new CustomEvent("h2-dialog-open", {
      bubbles: !0,
      composed: !0
    }));
  }
  close() {
    this.open = !1, this.dispatchEvent(new CustomEvent("h2-dialog-close", {
      bubbles: !0,
      composed: !0
    }));
  }
  _handleOverlayClick(e) {
    this.closeOnOverlayClick && e.target === e.currentTarget && this.close();
  }
  _stopPropagation(e) {
    e.stopPropagation();
  }
  updated(e) {
    super.updated(e), e.has("open") && (this.open ? (document.body.style.overflow = "hidden", this.addEventListener("keydown", this._handleKeyDown)) : (document.body.style.overflow = "", this.removeEventListener("keydown", this._handleKeyDown)));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.body.style.overflow = "", this.removeEventListener("keydown", this._handleKeyDown);
  }
};
c.styles = g`
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
b([
  s({ type: String })
], c.prototype, "title", 2);
b([
  s({ type: Boolean, reflect: !0 })
], c.prototype, "open", 2);
b([
  s({ type: String })
], c.prototype, "size", 2);
b([
  s({ type: Boolean })
], c.prototype, "closable", 2);
b([
  s({ type: Boolean })
], c.prototype, "closeOnOverlayClick", 2);
b([
  w(".dialog")
], c.prototype, "_dialog", 2);
c = b([
  f("h2-dialog")
], c);
export {
  v as H2Button,
  c as H2Dialog,
  d as H2Input,
  p as H2Select
};
//# sourceMappingURL=index.js.map
