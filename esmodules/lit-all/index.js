/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, it = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = Symbol(), $t = /* @__PURE__ */ new WeakMap();
let Ut = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== nt)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (it && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = $t.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && $t.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Yt = (s) => new Ut(typeof s == "string" ? s : s + "", void 0, nt), Te = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, r) => i + ((o) => {
    if (o._$cssResult$ === !0)
      return o.cssText;
    if (typeof o == "number")
      return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[r + 1], s[0]);
  return new Ut(e, s, nt);
}, Jt = (s, t) => {
  if (it)
    s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else
    for (const e of t) {
      const i = document.createElement("style"), n = V.litNonce;
      n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
    }
}, pt = it ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules)
    e += i.cssText;
  return Yt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Qt, getOwnPropertyDescriptor: te, getOwnPropertyNames: ee, getOwnPropertySymbols: se, getPrototypeOf: ie } = Object, C = globalThis, ft = C.trustedTypes, ne = ft ? ft.emptyScript : "", Z = C.reactiveElementPolyfillSupport, H = (s, t) => s, z = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? ne : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, rt = (s, t) => !Ft(s, t), _t = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = _t) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Qt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = te(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const a = n == null ? void 0 : n.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? _t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties")))
      return;
    const t = ie(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, i = [...ee(e), ...se(e)];
      for (const n of i)
        this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0)
        for (const [i, n] of e)
          this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i)
        e.unshift(pt(n));
    } else
      t !== void 0 && e.push(pt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys())
      this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Jt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : z).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), h = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : z;
      this._$Em = n;
      const l = h.fromAttribute(e, a.type);
      this[n] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i) {
    var n;
    if (t !== void 0) {
      const r = this.constructor, o = this[t];
      if (i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? rt)(o, e) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(r._$Eu(t, i))))
        return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep)
          this[r] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0)
        for (const [r, o] of n) {
          const { wrapped: a } = o, h = this[r];
          a !== !0 || this._$AL.has(r) || h === void 0 || this.C(r, void 0, o, h);
        }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[H("elementProperties")] = /* @__PURE__ */ new Map(), M[H("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: M }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, G = N.trustedTypes, yt = G ? G.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ot = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + v, re = `<${ht}>`, P = document, L = () => P.createComment(""), D = (s) => s === null || typeof s != "object" && typeof s != "function", at = Array.isArray, Rt = (s) => at(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, At = /-->/g, mt = />/g, S = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, vt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, ct = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), oe = ct(1), he = ct(2), xe = ct(3), f = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), w = P.createTreeWalker(P, 129);
function Ht(s, t) {
  if (!at(s) || !s.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(t) : t;
}
const Nt = (s, t) => {
  const e = s.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
  for (let a = 0; a < e; a++) {
    const h = s[a];
    let l, d, c = -1, p = 0;
    for (; p < h.length && (o.lastIndex = p, d = o.exec(h), d !== null); )
      p = o.lastIndex, o === O ? d[1] === "!--" ? o = At : d[1] !== void 0 ? o = mt : d[2] !== void 0 ? (Ot.test(d[2]) && (n = RegExp("</" + d[2], "g")), o = S) : d[3] !== void 0 && (o = S) : o === S ? d[0] === ">" ? (o = n ?? O, c = -1) : d[1] === void 0 ? c = -2 : (c = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? S : d[3] === '"' ? vt : gt) : o === vt || o === gt ? o = S : o === At || o === mt ? o = O : (o = S, n = void 0);
    const u = o === S && s[a + 1].startsWith("/>") ? " " : "";
    r += o === O ? h + re : c >= 0 ? (i.push(l), h.slice(0, c) + ot + h.slice(c) + v + u) : h + v + (c === -2 ? a : u);
  }
  return [Ht(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, h = this.parts, [l, d] = Nt(t, e);
    if (this.el = I.createElement(l, i), w.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = w.nextNode()) !== null && h.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes())
          for (const c of n.getAttributeNames())
            if (c.endsWith(ot)) {
              const p = d[o++], u = n.getAttribute(c).split(v), _ = /([.?@])?(.*)/.exec(p);
              h.push({ type: 1, index: r, name: _[2], strings: u, ctor: _[1] === "." ? Lt : _[1] === "?" ? Dt : _[1] === "@" ? It : j }), n.removeAttribute(c);
            } else
              c.startsWith(v) && (h.push({ type: 6, index: r }), n.removeAttribute(c));
        if (Ot.test(n.tagName)) {
          const c = n.textContent.split(v), p = c.length - 1;
          if (p > 0) {
            n.textContent = G ? G.emptyScript : "";
            for (let u = 0; u < p; u++)
              n.append(c[u], L()), w.nextNode(), h.push({ type: 2, index: ++r });
            n.append(c[p], L());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === ht)
          h.push({ type: 2, index: r });
        else {
          let c = -1;
          for (; (c = n.data.indexOf(v, c + 1)) !== -1; )
            h.push({ type: 7, index: r }), c += v.length - 1;
        }
      r++;
    }
  }
  static createElement(t, e) {
    const i = P.createElement("template");
    return i.innerHTML = t, i;
  }
}
function x(s, t, e = s, i) {
  var o, a;
  if (t === f)
    return t;
  let n = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = D(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), r === void 0 ? n = void 0 : (n = new r(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = x(s, n._$AS(s, t.values), n, i)), t;
}
let kt = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? P).importNode(e, !0);
    w.currentNode = n;
    let r = w.nextNode(), o = 0, a = 0, h = i[0];
    for (; h !== void 0; ) {
      if (o === h.index) {
        let l;
        h.type === 2 ? l = new R(r, r.nextSibling, this, t) : h.type === 1 ? l = new h.ctor(r, h.name, h.strings, this, t) : h.type === 6 && (l = new Bt(r, this, t)), this._$AV.push(l), h = i[++a];
      }
      o !== (h == null ? void 0 : h.index) && (r = w.nextNode(), o++);
    }
    return w.currentNode = P, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
};
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), D(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== f && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Ht(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n)
      this._$AH.p(e);
    else {
      const o = new kt(n, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Et.get(t.strings);
    return e === void 0 && Et.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t)
      n === e.length ? e.push(i = new R(this.O(L()), this.O(L()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = t.nextSibling;
      t.remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = $;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0)
      t = x(this, t, e, 0), o = !D(t) || t !== this._$AH && t !== f, o && (this._$AH = t);
    else {
      const a = t;
      let h, l;
      for (t = r[0], h = 0; h < r.length - 1; h++)
        l = x(this, a[i + h], e, h), l === f && (l = this._$AH[h]), o || (o = !D(l) || l !== this._$AH[h]), l === $ ? t = $ : t !== $ && (t += (l ?? "") + r[h + 1]), this._$AH[h] = l;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Lt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Dt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
class It extends j {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? $) === f)
      return;
    const i = this._$AH, n = t === $ && i !== $ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== $ && (i === $ || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const ae = { M: ot, P: v, A: ht, C: 1, L: Nt, R: kt, D: Rt, V: x, I: R, H: j, N: Dt, U: It, B: Lt, F: Bt }, J = N.litHtmlPolyfillSupport;
J == null || J(I, R), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.1");
const jt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new R(t.insertBefore(L(), r), r, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis;
let q = class extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return f;
  }
};
var Mt;
q._$litElement$ = !0, q.finalized = !0, (Mt = T.litElementHydrateSupport) == null || Mt.call(T, { LitElement: q });
const F = T.litElementPolyfillSupport;
F == null || F({ LitElement: q });
const Re = { _$AK: (s, t, e) => {
  s._$AK(t, e);
}, _$AL: (s) => s._$AL };
(T.litElementVersions ?? (T.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = !1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: rt }, le = (s = ce, t, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), r.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const h = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, h, s);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, s, a), a;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(a) {
      const h = this[o];
      t.call(this, a), this.requestUpdate(o, h, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function de(s) {
  return (t, e) => typeof e == "object" ? le(s, t, e) : ((i, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ne(s) {
  return de({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ke(s) {
  return (t, e) => {
    const i = typeof t == "function" ? t : t[e];
    Object.assign(i, s);
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Le(s, t) {
  return (e, i, n) => {
    const r = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(s)) ?? null;
    };
    if (t) {
      const { get: o, set: a } = typeof i == "object" ? e : n ?? (() => {
        const h = Symbol();
        return { get() {
          return this[h];
        }, set(l) {
          this[h] = l;
        } };
      })();
      return U(e, i, { get() {
        let h = o.call(this);
        return h === void 0 && (h = r(this), (h !== null || this.hasUpdated) && a.call(this, h)), h;
      } });
    }
    return U(e, i, { get() {
      return r(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ue;
function De(s) {
  return (t, e) => U(t, e, { get() {
    return (this.renderRoot ?? ue ?? (ue = document.createDocumentFragment())).querySelectorAll(s);
  } });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ie(s) {
  return (t, e) => U(t, e, { async get() {
    var i;
    return await this.updateComplete, ((i = this.renderRoot) == null ? void 0 : i.querySelector(s)) ?? null;
  } });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Be(s) {
  return (t, e) => {
    const { slot: i, selector: n } = s ?? {}, r = "slot" + (i ? `[name=${i}]` : ":not([name])");
    return U(t, e, { get() {
      var h;
      const o = (h = this.renderRoot) == null ? void 0 : h.querySelector(r), a = (o == null ? void 0 : o.assignedElements(s)) ?? [];
      return n === void 0 ? a : a.filter((l) => l.matches(n));
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function je(s) {
  return (t, e) => {
    const { slot: i } = s ?? {}, n = "slot" + (i ? `[name=${i}]` : ":not([name])");
    return U(t, e, { get() {
      var o;
      const r = (o = this.renderRoot) == null ? void 0 : o.querySelector(n);
      return (r == null ? void 0 : r.assignedNodes(s)) ?? [];
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, y = (s) => (...t) => ({ _$litDirective$: s, values: t });
let m = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: $e } = ae, pe = (s) => s === null || typeof s != "object" && typeof s != "function", qe = { HTML: 1, SVG: 2, MATHML: 3 }, bt = (s, t) => t === void 0 ? (s == null ? void 0 : s._$litType$) !== void 0 : (s == null ? void 0 : s._$litType$) === t, fe = (s) => {
  var t;
  return ((t = s == null ? void 0 : s._$litType$) == null ? void 0 : t.h) != null;
}, ze = (s) => (s == null ? void 0 : s._$litDirective$) !== void 0, Ge = (s) => s == null ? void 0 : s._$litDirective$, Vt = (s) => s.strings === void 0, Ct = () => document.createComment(""), b = (s, t, e) => {
  var r;
  const i = s._$AA.parentNode, n = t === void 0 ? s._$AB : t._$AA;
  if (e === void 0) {
    const o = i.insertBefore(Ct(), n), a = i.insertBefore(Ct(), n);
    e = new $e(o, a, s, s.options);
  } else {
    const o = e._$AB.nextSibling, a = e._$AM, h = a !== s;
    if (h) {
      let l;
      (r = e._$AQ) == null || r.call(e, s), e._$AM = s, e._$AP !== void 0 && (l = s._$AU) !== a._$AU && e._$AP(l);
    }
    if (o !== n || h) {
      let l = e._$AA;
      for (; l !== o; ) {
        const d = l.nextSibling;
        i.insertBefore(l, n), l = d;
      }
    }
  }
  return e;
}, E = (s, t, e = s) => (s._$AI(t, e), s), _e = {}, B = (s, t = _e) => s._$AH = t, et = (s) => s._$AH, Q = (s) => {
  s._$AR(), s._$AA.remove();
}, qt = (s) => {
  s._$AR();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = (s, t) => {
  var i;
  const e = s._$AN;
  if (e === void 0)
    return !1;
  for (const n of e)
    (i = n._$AO) == null || i.call(n, t, !1), k(n, t);
  return !0;
}, K = (s) => {
  let t, e;
  do {
    if ((t = s._$AM) === void 0)
      break;
    e = t._$AN, e.delete(s), s = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, zt = (s) => {
  for (let t; t = s._$AM; s = t) {
    let e = t._$AN;
    if (e === void 0)
      t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(s))
      break;
    e.add(s), me(t);
  }
};
function ye(s) {
  this._$AN !== void 0 ? (K(this), this._$AM = s, zt(this)) : this._$AM = s;
}
function Ae(s, t = !1, e = 0) {
  const i = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0)
    if (t)
      if (Array.isArray(i))
        for (let r = e; r < i.length; r++)
          k(i[r], !1), K(i[r]);
      else
        i != null && (k(i, !1), K(i));
    else
      k(this, s);
}
const me = (s) => {
  s.type == A.CHILD && (s._$AP ?? (s._$AP = Ae), s._$AQ ?? (s._$AQ = ye));
};
class lt extends m {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, i) {
    super._$AT(t, e, i), zt(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var i, n;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (n = this.disconnected) == null || n.call(this)), e && (k(this, t), K(this));
  }
  setValue(t) {
    if (Vt(this._$Ct))
      this._$Ct._$AI(t, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = async (s, t) => {
  for await (const e of s)
    if (await t(e) === !1)
      return;
};
let Gt = class {
  constructor(t) {
    this.G = t;
  }
  disconnect() {
    this.G = void 0;
  }
  reconnect(t) {
    this.G = t;
  }
  deref() {
    return this.G;
  }
}, Kt = class {
  constructor() {
    this.Y = void 0, this.Z = void 0;
  }
  get() {
    return this.Y;
  }
  pause() {
    this.Y ?? (this.Y = new Promise((t) => this.Z = t));
  }
  resume() {
    var t;
    (t = this.Z) == null || t.call(this), this.Y = this.Z = void 0;
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Wt = class extends lt {
  constructor() {
    super(...arguments), this._$CK = new Gt(this), this._$CX = new Kt();
  }
  render(t, e) {
    return f;
  }
  update(t, [e, i]) {
    if (this.isConnected || this.disconnected(), e === this._$CJ)
      return f;
    this._$CJ = e;
    let n = 0;
    const { _$CK: r, _$CX: o } = this;
    return ge(e, async (a) => {
      for (; o.get(); )
        await o.get();
      const h = r.deref();
      if (h !== void 0) {
        if (h._$CJ !== e)
          return !1;
        i !== void 0 && (a = i(a, n)), h.commitValue(a, n), n++;
      }
      return !0;
    }), f;
  }
  commitValue(t, e) {
    this.setValue(t);
  }
  disconnected() {
    this._$CK.disconnect(), this._$CX.pause();
  }
  reconnected() {
    this._$CK.reconnect(this), this._$CX.resume();
  }
};
const Ze = y(Wt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = y(class extends Wt {
  constructor(s) {
    if (super(s), s.type !== A.CHILD)
      throw Error("asyncAppend can only be used in child expressions");
  }
  update(s, t) {
    return this._$Ctt = s, super.update(s, t);
  }
  commitValue(s, t) {
    t === 0 && qt(this._$Ctt);
    const e = b(this._$Ctt);
    E(e, s);
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = (s) => fe(s) ? s._$litType$.h : s.strings, Je = y(class extends m {
  constructor(s) {
    super(s), this.et = /* @__PURE__ */ new WeakMap();
  }
  render(s) {
    return [s];
  }
  update(s, [t]) {
    const e = bt(this.it) ? St(this.it) : null, i = bt(t) ? St(t) : null;
    if (e !== null && (i === null || e !== i)) {
      const n = et(s).pop();
      let r = this.et.get(e);
      if (r === void 0) {
        const o = document.createDocumentFragment();
        r = jt($, o), r.setConnected(!1), this.et.set(e, r);
      }
      B(r, [n]), b(r, void 0, n);
    }
    if (i !== null) {
      if (e === null || e !== i) {
        const n = this.et.get(i);
        if (n !== void 0) {
          const r = et(n).pop();
          qt(s), b(s, void 0, r), B(s, [r]);
        }
      }
      this.it = t;
    } else
      this.it = void 0;
    return this.render(t);
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = (s, t, e) => {
  for (const i of t)
    if (i[0] === s)
      return (0, i[1])();
  return e == null ? void 0 : e();
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qe = y(class extends m {
  constructor(s) {
    var t;
    if (super(s), s.type !== A.ATTRIBUTE || s.name !== "class" || ((t = s.strings) == null ? void 0 : t.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return " " + Object.keys(s).filter((t) => s[t]).join(" ") + " ";
  }
  update(s, [t]) {
    var i, n;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), s.strings !== void 0 && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in t)
        t[r] && !((i = this.nt) != null && i.has(r)) && this.st.add(r);
      return this.render(t);
    }
    const e = s.element.classList;
    for (const r of this.st)
      r in t || (e.remove(r), this.st.delete(r));
    for (const r in t) {
      const o = !!t[r];
      o === this.st.has(r) || (n = this.nt) != null && n.has(r) || (o ? (e.add(r), this.st.add(r)) : (e.remove(r), this.st.delete(r)));
    }
    return f;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = {}, ts = y(class extends m {
  constructor() {
    super(...arguments), this.ot = ve;
  }
  render(s, t) {
    return t();
  }
  update(s, [t, e]) {
    if (Array.isArray(t)) {
      if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((i, n) => i === this.ot[n]))
        return f;
    } else if (this.ot === t)
      return f;
    return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, e);
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const es = (s) => s ?? $;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* ss(s, t) {
  const e = typeof t == "function";
  if (s !== void 0) {
    let i = -1;
    for (const n of s)
      i > -1 && (yield e ? t(i) : t), i++, yield n;
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const is = y(class extends m {
  constructor() {
    super(...arguments), this.key = $;
  }
  render(s, t) {
    return this.key = s, t;
  }
  update(s, [t, e]) {
    return t !== this.key && (B(s), this.key = t), e;
  }
});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ns = y(class extends m {
  constructor(s) {
    if (super(s), s.type !== A.PROPERTY && s.type !== A.ATTRIBUTE && s.type !== A.BOOLEAN_ATTRIBUTE)
      throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Vt(s))
      throw Error("`live` bindings can only contain a single expression");
  }
  render(s) {
    return s;
  }
  update(s, [t]) {
    if (t === f || t === $)
      return t;
    const e = s.element, i = s.name;
    if (s.type === A.PROPERTY) {
      if (t === e[i])
        return f;
    } else if (s.type === A.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i))
        return f;
    } else if (s.type === A.ATTRIBUTE && e.getAttribute(i) === t + "")
      return f;
    return B(s), t;
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* rs(s, t) {
  if (s !== void 0) {
    let e = 0;
    for (const i of s)
      yield t(i, e++);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* os(s, t, e = 1) {
  const i = t === void 0 ? 0 : s;
  t ?? (t = s);
  for (let n = i; e > 0 ? n < t : t < n; n += e)
    yield n;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hs = () => new Ee();
let Ee = class {
};
const tt = /* @__PURE__ */ new WeakMap(), cs = y(class extends lt {
  render(s) {
    return $;
  }
  update(s, [t]) {
    var i;
    const e = t !== this.G;
    return e && this.G !== void 0 && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = t, this.ht = (i = s.options) == null ? void 0 : i.host, this.rt(this.ct = s.element)), $;
  }
  rt(s) {
    if (this.isConnected || (s = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let e = tt.get(t);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), tt.set(t, e)), e.get(this.G) !== void 0 && this.G.call(this.ht, void 0), e.set(this.G, s), s !== void 0 && this.G.call(this.ht, s);
    } else
      this.G.value = s;
  }
  get lt() {
    var s, t;
    return typeof this.G == "function" ? (s = tt.get(this.ht ?? globalThis)) == null ? void 0 : s.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = (s, t, e) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = t; n <= e; n++)
    i.set(s[n], n);
  return i;
}, ls = y(class extends m {
  constructor(s) {
    if (super(s), s.type !== A.CHILD)
      throw Error("repeat() can only be used in text expressions");
  }
  dt(s, t, e) {
    let i;
    e === void 0 ? e = t : t !== void 0 && (i = t);
    const n = [], r = [];
    let o = 0;
    for (const a of s)
      n[o] = i ? i(a, o) : o, r[o] = e(a, o), o++;
    return { values: r, keys: n };
  }
  render(s, t, e) {
    return this.dt(s, t, e).values;
  }
  update(s, [t, e, i]) {
    const n = et(s), { values: r, keys: o } = this.dt(t, e, i);
    if (!Array.isArray(n))
      return this.ut = o, r;
    const a = this.ut ?? (this.ut = []), h = [];
    let l, d, c = 0, p = n.length - 1, u = 0, _ = r.length - 1;
    for (; c <= p && u <= _; )
      if (n[c] === null)
        c++;
      else if (n[p] === null)
        p--;
      else if (a[c] === o[u])
        h[u] = E(n[c], r[u]), c++, u++;
      else if (a[p] === o[_])
        h[_] = E(n[p], r[_]), p--, _--;
      else if (a[c] === o[_])
        h[_] = E(n[c], r[_]), b(s, h[_ + 1], n[c]), c++, _--;
      else if (a[p] === o[u])
        h[u] = E(n[p], r[u]), b(s, n[c], n[p]), p--, u++;
      else if (l === void 0 && (l = wt(o, u, _), d = wt(a, c, p)), l.has(a[c]))
        if (l.has(a[p])) {
          const g = d.get(o[u]), X = g !== void 0 ? n[g] : null;
          if (X === null) {
            const ut = b(s, n[c]);
            E(ut, r[u]), h[u] = ut;
          } else
            h[u] = E(X, r[u]), b(s, n[c], X), n[g] = null;
          u++;
        } else
          Q(n[p]), p--;
      else
        Q(n[c]), c++;
    for (; u <= _; ) {
      const g = b(s, h[_ + 1]);
      E(g, r[u]), h[u++] = g;
    }
    for (; c <= p; ) {
      const g = n[c++];
      g !== null && Q(g);
    }
    return this.ut = o, B(s, h), f;
  }
});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = "important", be = " !" + Xt, ds = y(class extends m {
  constructor(s) {
    var t;
    if (super(s), s.type !== A.ATTRIBUTE || s.name !== "style" || ((t = s.strings) == null ? void 0 : t.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return Object.keys(s).reduce((t, e) => {
      const i = s[e];
      return i == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${i};`;
    }, "");
  }
  update(s, [t]) {
    const { style: e } = s.element;
    if (this.ft === void 0)
      return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const i of this.ft)
      t[i] == null && (this.ft.delete(i), i.includes("-") ? e.removeProperty(i) : e[i] = null);
    for (const i in t) {
      const n = t[i];
      if (n != null) {
        this.ft.add(i);
        const r = typeof n == "string" && n.endsWith(be);
        i.includes("-") || r ? e.setProperty(i, r ? n.slice(0, -11) : n, r ? Xt : "") : e[i] = n;
      }
    }
    return f;
  }
});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const us = y(class extends m {
  constructor(s) {
    if (super(s), s.type !== A.CHILD)
      throw Error("templateContent can only be used in child bindings");
  }
  render(s) {
    return this.vt === s ? f : (this.vt = s, document.importNode(s.content, !0));
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class W extends m {
  constructor(t) {
    if (super(t), this.it = $, t.type !== A.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === $ || t == null)
      return this._t = void 0, this.it = t;
    if (t === f)
      return t;
    if (typeof t != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it)
      return this._t;
    this.it = t;
    const e = [t];
    return e.raw = e, this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
}
W.directiveName = "unsafeHTML", W.resultType = 1;
const $s = y(W);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class st extends W {
}
st.directiveName = "unsafeSVG", st.resultType = 2;
const ps = y(st);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = (s) => !pe(s) && typeof s.then == "function", Pt = 1073741823;
let Ce = class extends lt {
  constructor() {
    super(...arguments), this._$Cwt = Pt, this._$Cbt = [], this._$CK = new Gt(this), this._$CX = new Kt();
  }
  render(...t) {
    return t.find((e) => !Tt(e)) ?? f;
  }
  update(t, e) {
    const i = this._$Cbt;
    let n = i.length;
    this._$Cbt = e;
    const r = this._$CK, o = this._$CX;
    this.isConnected || this.disconnected();
    for (let a = 0; a < e.length && !(a > this._$Cwt); a++) {
      const h = e[a];
      if (!Tt(h))
        return this._$Cwt = a, h;
      a < n && h === i[a] || (this._$Cwt = Pt, n = 0, Promise.resolve(h).then(async (l) => {
        for (; o.get(); )
          await o.get();
        const d = r.deref();
        if (d !== void 0) {
          const c = d._$Cbt.indexOf(h);
          c > -1 && c < d._$Cwt && (d._$Cwt = c, d.setValue(l));
        }
      }));
    }
    return f;
  }
  disconnected() {
    this._$CK.disconnect(), this._$CX.pause();
  }
  reconnected() {
    this._$CK.reconnect(this), this._$CX.resume();
  }
};
const _s = y(Ce);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ys(s, t, e) {
  return s ? t(s) : e == null ? void 0 : e(s);
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = Symbol.for(""), Se = (s) => {
  if ((s == null ? void 0 : s.r) === dt)
    return s == null ? void 0 : s._$litStatic$;
}, As = (s) => ({ _$litStatic$: s, r: dt }), ms = (s, ...t) => ({ _$litStatic$: t.reduce((e, i, n) => e + ((r) => {
  if (r._$litStatic$ !== void 0)
    return r._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${r}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(i) + s[n + 1], s[0]), r: dt }), xt = /* @__PURE__ */ new Map(), Zt = (s) => (t, ...e) => {
  const i = e.length;
  let n, r;
  const o = [], a = [];
  let h, l = 0, d = !1;
  for (; l < i; ) {
    for (h = t[l]; l < i && (r = e[l], (n = Se(r)) !== void 0); )
      h += n + t[++l], d = !0;
    l !== i && a.push(r), o.push(h), l++;
  }
  if (l === i && o.push(t[i]), d) {
    const c = o.join("$$lit$$");
    (t = xt.get(c)) === void 0 && (o.raw = o, xt.set(c, t = o)), e = a;
  }
  return s(t, ...e);
}, gs = Zt(oe), vs = Zt(he);
export {
  lt as AsyncDirective,
  Wt as AsyncReplaceDirective,
  Ut as CSSResult,
  m as Directive,
  q as LitElement,
  A as PartType,
  M as ReactiveElement,
  qe as TemplateResultType,
  W as UnsafeHTMLDirective,
  Ce as UntilDirective,
  Re as _$LE,
  ae as _$LH,
  Jt as adoptStyles,
  Ye as asyncAppend,
  Ze as asyncReplace,
  Je as cache,
  Fe as choose,
  Qe as classMap,
  qt as clearPart,
  hs as createRef,
  Te as css,
  He as customElement,
  z as defaultConverter,
  y as directive,
  ke as eventOptions,
  et as getCommittedValue,
  pt as getCompatibleStyle,
  Ge as getDirectiveClass,
  ts as guard,
  oe as html,
  es as ifDefined,
  b as insertPart,
  fe as isCompiledTemplateResult,
  ze as isDirectiveResult,
  pe as isPrimitive,
  Oe as isServer,
  Vt as isSingleExpression,
  bt as isTemplateResult,
  ss as join,
  is as keyed,
  ms as literal,
  ns as live,
  rs as map,
  xe as mathml,
  f as noChange,
  rt as notEqual,
  $ as nothing,
  de as property,
  Le as query,
  De as queryAll,
  Be as queryAssignedElements,
  je as queryAssignedNodes,
  Ie as queryAsync,
  os as range,
  cs as ref,
  Q as removePart,
  jt as render,
  ls as repeat,
  E as setChildPartValue,
  B as setCommittedValue,
  le as standardProperty,
  Ne as state,
  gs as staticHtml,
  vs as staticSvg,
  ds as styleMap,
  it as supportsAdoptingStyleSheets,
  he as svg,
  us as templateContent,
  Yt as unsafeCSS,
  $s as unsafeHTML,
  ps as unsafeSVG,
  As as unsafeStatic,
  _s as until,
  ys as when,
  Zt as withStatic
};
//# sourceMappingURL=index.js.map
