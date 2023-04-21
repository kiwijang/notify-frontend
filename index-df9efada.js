(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]'))
    n(o);
  new MutationObserver((o) => {
    for (const i of o)
      if (i.type === "childList")
        for (const a of i.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(o) {
    const i = {};
    return o.integrity && (i.integrity = o.integrity), o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? i.credentials = "include" : o.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
  }
  function n(o) {
    if (o.ep)
      return;
    o.ep = !0;
    const i = t(o);
    fetch(o.href, i);
  }
})();
function fe(r) {
  return r = r || [], Array.isArray(r) ? r : [r];
}
function C(r) {
  return `[Vaadin.Router] ${r}`;
}
function Ut(r) {
  if (typeof r != "object")
    return String(r);
  const e = Object.prototype.toString.call(r).match(/ (.*)\]$/)[1];
  return e === "Object" || e === "Array" ? `${e} ${JSON.stringify(r)}` : e;
}
const pe = "module", _e = "nomodule", Ue = [pe, _e];
function Fe(r) {
  if (!r.match(/.+\.[m]?js$/))
    throw new Error(
      C(`Unsupported type for bundle "${r}": .js or .mjs expected.`)
    );
}
function _t(r) {
  if (!r || !P(r.path))
    throw new Error(
      C('Expected route config to be an object with a "path" string property, or an array of such objects')
    );
  const e = r.bundle, t = ["component", "redirect", "bundle"];
  if (!I(r.action) && !Array.isArray(r.children) && !I(r.children) && !ve(e) && !t.some((n) => P(r[n])))
    throw new Error(
      C(
        `Expected route config "${r.path}" to include either "${t.join('", "')}" or "action" function but none found.`
      )
    );
  if (e)
    if (P(e))
      Fe(e);
    else if (Ue.some((n) => n in e))
      Ue.forEach((n) => n in e && Fe(e[n]));
    else
      throw new Error(
        C('Expected route bundle to include either "' + _e + '" or "' + pe + '" keys, or both')
      );
  r.redirect && ["bundle", "component"].forEach((n) => {
    n in r && console.warn(
      C(
        `Route config "${r.path}" has both "redirect" and "${n}" properties, and "redirect" will always override the latter. Did you mean to only use "${n}"?`
      )
    );
  });
}
function Ve(r) {
  fe(r).forEach((e) => _t(e));
}
function ze(r, e) {
  let t = document.head.querySelector('script[src="' + r + '"][async]');
  return t || (t = document.createElement("script"), t.setAttribute("src", r), e === pe ? t.setAttribute("type", pe) : e === _e && t.setAttribute(_e, ""), t.async = !0), new Promise((n, o) => {
    t.onreadystatechange = t.onload = (i) => {
      t.__dynamicImportLoaded = !0, n(i);
    }, t.onerror = (i) => {
      t.parentNode && t.parentNode.removeChild(t), o(i);
    }, t.parentNode === null ? document.head.appendChild(t) : t.__dynamicImportLoaded && n();
  });
}
function Mt(r) {
  return P(r) ? ze(r) : Promise.race(
    Ue.filter((e) => e in r).map((e) => ze(r[e], e))
  );
}
function Z(r, e) {
  return !window.dispatchEvent(new CustomEvent(
    `vaadin-router-${r}`,
    { cancelable: r === "go", detail: e }
  ));
}
function ve(r) {
  return typeof r == "object" && !!r;
}
function I(r) {
  return typeof r == "function";
}
function P(r) {
  return typeof r == "string";
}
function vt(r) {
  const e = new Error(C(`Page not found (${r.pathname})`));
  return e.context = r, e.code = 404, e;
}
const z = new class {
}();
function Ht(r) {
  const e = r.port, t = r.protocol, i = t === "http:" && e === "80" || t === "https:" && e === "443" ? r.hostname : r.host;
  return `${t}//${i}`;
}
function Ge(r) {
  if (r.defaultPrevented || r.button !== 0 || r.shiftKey || r.ctrlKey || r.altKey || r.metaKey)
    return;
  let e = r.target;
  const t = r.composedPath ? r.composedPath() : r.path || [];
  for (let h = 0; h < t.length; h++) {
    const s = t[h];
    if (s.nodeName && s.nodeName.toLowerCase() === "a") {
      e = s;
      break;
    }
  }
  for (; e && e.nodeName.toLowerCase() !== "a"; )
    e = e.parentNode;
  if (!e || e.nodeName.toLowerCase() !== "a" || e.target && e.target.toLowerCase() !== "_self" || e.hasAttribute("download") || e.hasAttribute("router-ignore") || e.pathname === window.location.pathname && e.hash !== "" || (e.origin || Ht(e)) !== window.location.origin)
    return;
  const { pathname: o, search: i, hash: a } = e;
  Z("go", { pathname: o, search: i, hash: a }) && (r.preventDefault(), r && r.type === "click" && window.scrollTo(0, 0));
}
const It = {
  activate() {
    window.document.addEventListener("click", Ge);
  },
  inactivate() {
    window.document.removeEventListener("click", Ge);
  }
}, jt = /Trident/.test(navigator.userAgent);
jt && !I(window.PopStateEvent) && (window.PopStateEvent = function(r, e) {
  e = e || {};
  var t = document.createEvent("Event");
  return t.initEvent(r, !!e.bubbles, !!e.cancelable), t.state = e.state || null, t;
}, window.PopStateEvent.prototype = window.Event.prototype);
function xe(r) {
  if (r.state === "vaadin-router-ignore")
    return;
  const { pathname: e, search: t, hash: n } = window.location;
  Z("go", { pathname: e, search: t, hash: n });
}
const kt = {
  activate() {
    window.addEventListener("popstate", xe);
  },
  inactivate() {
    window.removeEventListener("popstate", xe);
  }
};
var J = Et, Dt = je, Bt = Gt, Ft = yt, Vt = wt, gt = "/", mt = "./", zt = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  "(\\\\.)",
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
  // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
  "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"
].join("|"), "g");
function je(r, e) {
  for (var t = [], n = 0, o = 0, i = "", a = e && e.delimiter || gt, h = e && e.delimiters || mt, s = !1, l; (l = zt.exec(r)) !== null; ) {
    var _ = l[0], f = l[1], p = l.index;
    if (i += r.slice(o, p), o = p + _.length, f) {
      i += f[1], s = !0;
      continue;
    }
    var g = "", E = r[o], O = l[2], X = l[3], j = l[4], L = l[5];
    if (!s && i.length) {
      var k = i.length - 1;
      h.indexOf(i[k]) > -1 && (g = i[k], i = i.slice(0, k));
    }
    i && (t.push(i), i = "", s = !1);
    var D = g !== "" && E !== void 0 && E !== g, we = L === "+" || L === "*", se = L === "?" || L === "*", ae = g || a, B = X || j;
    t.push({
      name: O || n++,
      prefix: g,
      delimiter: ae,
      optional: se,
      repeat: we,
      partial: D,
      pattern: B ? xt(B) : "[^" + T(ae) + "]+?"
    });
  }
  return (i || o < r.length) && t.push(i + r.substr(o)), t;
}
function Gt(r, e) {
  return yt(je(r, e));
}
function yt(r) {
  for (var e = new Array(r.length), t = 0; t < r.length; t++)
    typeof r[t] == "object" && (e[t] = new RegExp("^(?:" + r[t].pattern + ")$"));
  return function(n, o) {
    for (var i = "", a = o && o.encode || encodeURIComponent, h = 0; h < r.length; h++) {
      var s = r[h];
      if (typeof s == "string") {
        i += s;
        continue;
      }
      var l = n ? n[s.name] : void 0, _;
      if (Array.isArray(l)) {
        if (!s.repeat)
          throw new TypeError('Expected "' + s.name + '" to not repeat, but got array');
        if (l.length === 0) {
          if (s.optional)
            continue;
          throw new TypeError('Expected "' + s.name + '" to not be empty');
        }
        for (var f = 0; f < l.length; f++) {
          if (_ = a(l[f], s), !e[h].test(_))
            throw new TypeError('Expected all "' + s.name + '" to match "' + s.pattern + '"');
          i += (f === 0 ? s.prefix : s.delimiter) + _;
        }
        continue;
      }
      if (typeof l == "string" || typeof l == "number" || typeof l == "boolean") {
        if (_ = a(String(l), s), !e[h].test(_))
          throw new TypeError('Expected "' + s.name + '" to match "' + s.pattern + '", but got "' + _ + '"');
        i += s.prefix + _;
        continue;
      }
      if (s.optional) {
        s.partial && (i += s.prefix);
        continue;
      }
      throw new TypeError('Expected "' + s.name + '" to be ' + (s.repeat ? "an array" : "a string"));
    }
    return i;
  };
}
function T(r) {
  return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function xt(r) {
  return r.replace(/([=!:$/()])/g, "\\$1");
}
function $t(r) {
  return r && r.sensitive ? "" : "i";
}
function Wt(r, e) {
  if (!e)
    return r;
  var t = r.source.match(/\((?!\?)/g);
  if (t)
    for (var n = 0; n < t.length; n++)
      e.push({
        name: n,
        prefix: null,
        delimiter: null,
        optional: !1,
        repeat: !1,
        partial: !1,
        pattern: null
      });
  return r;
}
function Kt(r, e, t) {
  for (var n = [], o = 0; o < r.length; o++)
    n.push(Et(r[o], e, t).source);
  return new RegExp("(?:" + n.join("|") + ")", $t(t));
}
function qt(r, e, t) {
  return wt(je(r, t), e, t);
}
function wt(r, e, t) {
  t = t || {};
  for (var n = t.strict, o = t.start !== !1, i = t.end !== !1, a = T(t.delimiter || gt), h = t.delimiters || mt, s = [].concat(t.endsWith || []).map(T).concat("$").join("|"), l = o ? "^" : "", _ = r.length === 0, f = 0; f < r.length; f++) {
    var p = r[f];
    if (typeof p == "string")
      l += T(p), _ = f === r.length - 1 && h.indexOf(p[p.length - 1]) > -1;
    else {
      var g = p.repeat ? "(?:" + p.pattern + ")(?:" + T(p.delimiter) + "(?:" + p.pattern + "))*" : p.pattern;
      e && e.push(p), p.optional ? p.partial ? l += T(p.prefix) + "(" + g + ")?" : l += "(?:" + T(p.prefix) + "(" + g + "))?" : l += T(p.prefix) + "(" + g + ")";
    }
  }
  return i ? (n || (l += "(?:" + a + ")?"), l += s === "$" ? "$" : "(?=" + s + ")") : (n || (l += "(?:" + a + "(?=" + s + "))?"), _ || (l += "(?=" + a + "|" + s + ")")), new RegExp(l, $t(t));
}
function Et(r, e, t) {
  return r instanceof RegExp ? Wt(r, e) : Array.isArray(r) ? Kt(
    /** @type {!Array} */
    r,
    e,
    t
  ) : qt(
    /** @type {string} */
    r,
    e,
    t
  );
}
J.parse = Dt;
J.compile = Bt;
J.tokensToFunction = Ft;
J.tokensToRegExp = Vt;
const { hasOwnProperty: Jt } = Object.prototype, Me = /* @__PURE__ */ new Map();
Me.set("|false", {
  keys: [],
  pattern: /(?:)/
});
function We(r) {
  try {
    return decodeURIComponent(r);
  } catch {
    return r;
  }
}
function Xt(r, e, t, n, o) {
  t = !!t;
  const i = `${r}|${t}`;
  let a = Me.get(i);
  if (!a) {
    const l = [];
    a = {
      keys: l,
      pattern: J(r, l, {
        end: t,
        strict: r === ""
      })
    }, Me.set(i, a);
  }
  const h = a.pattern.exec(e);
  if (!h)
    return null;
  const s = Object.assign({}, o);
  for (let l = 1; l < h.length; l++) {
    const _ = a.keys[l - 1], f = _.name, p = h[l];
    (p !== void 0 || !Jt.call(s, f)) && (_.repeat ? s[f] = p ? p.split(_.delimiter).map(We) : [] : s[f] = p && We(p));
  }
  return {
    path: h[0],
    keys: (n || []).concat(a.keys),
    params: s
  };
}
function bt(r, e, t, n, o) {
  let i, a, h = 0, s = r.path || "";
  return s.charAt(0) === "/" && (t && (s = s.substr(1)), t = !0), {
    next(l) {
      if (r === l)
        return { done: !0 };
      const _ = r.__children = r.__children || r.children;
      if (!i && (i = Xt(s, e, !_, n, o), i))
        return {
          done: !1,
          value: {
            route: r,
            keys: i.keys,
            params: i.params,
            path: i.path
          }
        };
      if (i && _)
        for (; h < _.length; ) {
          if (!a) {
            const p = _[h];
            p.parent = r;
            let g = i.path.length;
            g > 0 && e.charAt(g) === "/" && (g += 1), a = bt(
              p,
              e.substr(g),
              t,
              i.keys,
              i.params
            );
          }
          const f = a.next(l);
          if (!f.done)
            return {
              done: !1,
              value: f.value
            };
          a = null, h++;
        }
      return { done: !0 };
    }
  };
}
function Qt(r) {
  if (I(r.route.action))
    return r.route.action(r);
}
function Yt(r, e) {
  let t = e;
  for (; t; )
    if (t = t.parent, t === r)
      return !0;
  return !1;
}
function Zt(r) {
  let e = `Path '${r.pathname}' is not properly resolved due to an error.`;
  const t = (r.route || {}).path;
  return t && (e += ` Resolution had failed on route: '${t}'`), e;
}
function er(r, e) {
  const { route: t, path: n } = e;
  if (t && !t.__synthetic) {
    const o = { path: n, route: t };
    if (!r.chain)
      r.chain = [];
    else if (t.parent) {
      let i = r.chain.length;
      for (; i-- && r.chain[i].route && r.chain[i].route !== t.parent; )
        r.chain.pop();
    }
    r.chain.push(o);
  }
}
class te {
  constructor(e, t = {}) {
    if (Object(e) !== e)
      throw new TypeError("Invalid routes");
    this.baseUrl = t.baseUrl || "", this.errorHandler = t.errorHandler, this.resolveRoute = t.resolveRoute || Qt, this.context = Object.assign({ resolver: this }, t.context), this.root = Array.isArray(e) ? { path: "", __children: e, parent: null, __synthetic: !0 } : e, this.root.parent = null;
  }
  /**
   * Returns the current list of routes (as a shallow copy). Adding / removing
   * routes to / from the returned array does not affect the routing config,
   * but modifying the route objects does.
   *
   * @return {!Array<!Router.Route>}
   */
  getRoutes() {
    return [...this.root.__children];
  }
  /**
   * Sets the routing config (replacing the existing one).
   *
   * @param {!Array<!Router.Route>|!Router.Route} routes a single route or an array of those
   *    (the array is shallow copied)
   */
  setRoutes(e) {
    Ve(e);
    const t = [...fe(e)];
    this.root.__children = t;
  }
  /**
   * Appends one or several routes to the routing config and returns the
   * effective routing config after the operation.
   *
   * @param {!Array<!Router.Route>|!Router.Route} routes a single route or an array of those
   *    (the array is shallow copied)
   * @return {!Array<!Router.Route>}
   * @protected
   */
  addRoutes(e) {
    return Ve(e), this.root.__children.push(...fe(e)), this.getRoutes();
  }
  /**
   * Removes all existing routes from the routing config.
   */
  removeRoutes() {
    this.setRoutes([]);
  }
  /**
   * Asynchronously resolves the given pathname, i.e. finds all routes matching
   * the pathname and tries resolving them one after another in the order they
   * are listed in the routes config until the first non-null result.
   *
   * Returns a promise that is fulfilled with the return value of an object that consists of the first
   * route handler result that returns something other than `null` or `undefined` and context used to get this result.
   *
   * If no route handlers return a non-null result, or if no route matches the
   * given pathname the returned promise is rejected with a 'page not found'
   * `Error`.
   *
   * @param {!string|!{pathname: !string}} pathnameOrContext the pathname to
   *    resolve or a context object with a `pathname` property and other
   *    properties to pass to the route resolver functions.
   * @return {!Promise<any>}
   */
  resolve(e) {
    const t = Object.assign(
      {},
      this.context,
      P(e) ? { pathname: e } : e
    ), n = bt(
      this.root,
      this.__normalizePathname(t.pathname),
      this.baseUrl
    ), o = this.resolveRoute;
    let i = null, a = null, h = t;
    function s(l, _ = i.value.route, f) {
      const p = f === null && i.value.route;
      return i = a || n.next(p), a = null, !l && (i.done || !Yt(_, i.value.route)) ? (a = i, Promise.resolve(z)) : i.done ? Promise.reject(vt(t)) : (h = Object.assign(
        h ? { chain: h.chain ? h.chain.slice(0) : [] } : {},
        t,
        i.value
      ), er(h, i.value), Promise.resolve(o(h)).then((g) => g != null && g !== z ? (h.result = g.result || g, h) : s(l, _, g)));
    }
    return t.next = s, Promise.resolve().then(() => s(!0, this.root)).catch((l) => {
      const _ = Zt(h);
      if (l ? console.warn(_) : l = new Error(_), l.context = l.context || h, l instanceof DOMException || (l.code = l.code || 500), this.errorHandler)
        return h.result = this.errorHandler(l), h;
      throw l;
    });
  }
  /**
   * URL constructor polyfill hook. Creates and returns an URL instance.
   */
  static __createUrl(e, t) {
    return new URL(e, t);
  }
  /**
   * If the baseUrl property is set, transforms the baseUrl and returns the full
   * actual `base` string for using in the `new URL(path, base);` and for
   * prepernding the paths with. The returned base ends with a trailing slash.
   *
   * Otherwise, returns empty string.
   */
  get __effectiveBaseUrl() {
    return this.baseUrl ? this.constructor.__createUrl(
      this.baseUrl,
      document.baseURI || document.URL
    ).href.replace(/[^\/]*$/, "") : "";
  }
  /**
   * If the baseUrl is set, matches the pathname with the router’s baseUrl,
   * and returns the local pathname with the baseUrl stripped out.
   *
   * If the pathname does not match the baseUrl, returns undefined.
   *
   * If the `baseUrl` is not set, returns the unmodified pathname argument.
   */
  __normalizePathname(e) {
    if (!this.baseUrl)
      return e;
    const t = this.__effectiveBaseUrl, n = this.constructor.__createUrl(e, t).href;
    if (n.slice(0, t.length) === t)
      return n.slice(t.length);
  }
}
te.pathToRegexp = J;
const { pathToRegexp: Ke } = te, qe = /* @__PURE__ */ new Map();
function At(r, e, t) {
  const n = e.name || e.component;
  if (n && (r.has(n) ? r.get(n).push(e) : r.set(n, [e])), Array.isArray(t))
    for (let o = 0; o < t.length; o++) {
      const i = t[o];
      i.parent = e, At(r, i, i.__children || i.children);
    }
}
function Je(r, e) {
  const t = r.get(e);
  if (t && t.length > 1)
    throw new Error(
      `Duplicate route with name "${e}". Try seting unique 'name' route properties.`
    );
  return t && t[0];
}
function Xe(r) {
  let e = r.path;
  return e = Array.isArray(e) ? e[0] : e, e !== void 0 ? e : "";
}
function tr(r, e = {}) {
  if (!(r instanceof te))
    throw new TypeError("An instance of Resolver is expected");
  const t = /* @__PURE__ */ new Map();
  return (n, o) => {
    let i = Je(t, n);
    if (!i && (t.clear(), At(t, r.root, r.root.__children), i = Je(t, n), !i))
      throw new Error(`Route "${n}" not found`);
    let a = qe.get(i.fullPath);
    if (!a) {
      let s = Xe(i), l = i.parent;
      for (; l; ) {
        const g = Xe(l);
        g && (s = g.replace(/\/$/, "") + "/" + s.replace(/^\//, "")), l = l.parent;
      }
      const _ = Ke.parse(s), f = Ke.tokensToFunction(_), p = /* @__PURE__ */ Object.create(null);
      for (let g = 0; g < _.length; g++)
        P(_[g]) || (p[_[g].name] = !0);
      a = { toPath: f, keys: p }, qe.set(s, a), i.fullPath = s;
    }
    let h = a.toPath(o, e) || "/";
    if (e.stringifyQueryParams && o) {
      const s = {}, l = Object.keys(o);
      for (let f = 0; f < l.length; f++) {
        const p = l[f];
        a.keys[p] || (s[p] = o[p]);
      }
      const _ = e.stringifyQueryParams(s);
      _ && (h += _.charAt(0) === "?" ? _ : `?${_}`);
    }
    return h;
  };
}
let Qe = [];
function rr(r) {
  Qe.forEach((e) => e.inactivate()), r.forEach((e) => e.activate()), Qe = r;
}
const nr = (r) => {
  const e = getComputedStyle(r).getPropertyValue("animation-name");
  return e && e !== "none";
}, ir = (r, e) => {
  const t = () => {
    r.removeEventListener("animationend", t), e();
  };
  r.addEventListener("animationend", t);
};
function Ye(r, e) {
  return r.classList.add(e), new Promise((t) => {
    if (nr(r)) {
      const n = r.getBoundingClientRect(), o = `height: ${n.bottom - n.top}px; width: ${n.right - n.left}px`;
      r.setAttribute("style", `position: absolute; ${o}`), ir(r, () => {
        r.classList.remove(e), r.removeAttribute("style"), t();
      });
    } else
      r.classList.remove(e), t();
  });
}
const or = 256;
function Ae(r) {
  return r != null;
}
function sr(r) {
  const e = Object.assign({}, r);
  return delete e.next, e;
}
function R({ pathname: r = "", search: e = "", hash: t = "", chain: n = [], params: o = {}, redirectFrom: i, resolver: a }, h) {
  const s = n.map((l) => l.route);
  return {
    baseUrl: a && a.baseUrl || "",
    pathname: r,
    search: e,
    hash: t,
    routes: s,
    route: h || s.length && s[s.length - 1] || null,
    params: o,
    redirectFrom: i,
    getUrl: (l = {}) => he(
      S.pathToRegexp.compile(
        St(s)
      )(Object.assign({}, o, l)),
      a
    )
  };
}
function Ze(r, e) {
  const t = Object.assign({}, r.params);
  return {
    redirect: {
      pathname: e,
      from: r.pathname,
      params: t
    }
  };
}
function ar(r, e) {
  e.location = R(r);
  const t = r.chain.map((n) => n.route).indexOf(r.route);
  return r.chain[t].element = e, e;
}
function ce(r, e, t) {
  if (I(r))
    return r.apply(t, e);
}
function et(r, e, t) {
  return (n) => {
    if (n && (n.cancel || n.redirect))
      return n;
    if (t)
      return ce(t[r], e, t);
  };
}
function lr(r, e) {
  if (!Array.isArray(r) && !ve(r))
    throw new Error(
      C(
        `Incorrect "children" value for the route ${e.path}: expected array or object, but got ${r}`
      )
    );
  e.__children = [];
  const t = fe(r);
  for (let n = 0; n < t.length; n++)
    _t(t[n]), e.__children.push(t[n]);
}
function le(r) {
  if (r && r.length) {
    const e = r[0].parentNode;
    for (let t = 0; t < r.length; t++)
      e.removeChild(r[t]);
  }
}
function he(r, e) {
  const t = e.__effectiveBaseUrl;
  return t ? e.constructor.__createUrl(r.replace(/^\//, ""), t).pathname : r;
}
function St(r) {
  return r.map((e) => e.path).reduce((e, t) => t.length ? e.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : e, "");
}
class S extends te {
  /**
   * Creates a new Router instance with a given outlet, and
   * automatically subscribes it to navigation events on the `window`.
   * Using a constructor argument or a setter for outlet is equivalent:
   *
   * ```
   * const router = new Router();
   * router.setOutlet(outlet);
   * ```
   * @param {?Node=} outlet
   * @param {?RouterOptions=} options
   */
  constructor(e, t) {
    const n = document.head.querySelector("base"), o = n && n.getAttribute("href");
    super([], Object.assign({
      // Default options
      baseUrl: o && te.__createUrl(o, document.URL).pathname.replace(/[^\/]*$/, "")
    }, t)), this.resolveRoute = (a) => this.__resolveRoute(a);
    const i = S.NavigationTrigger;
    S.setTriggers.apply(S, Object.keys(i).map((a) => i[a])), this.baseUrl, this.ready, this.ready = Promise.resolve(e), this.location, this.location = R({ resolver: this }), this.__lastStartedRenderId = 0, this.__navigationEventHandler = this.__onNavigationEvent.bind(this), this.setOutlet(e), this.subscribe(), this.__createdByRouter = /* @__PURE__ */ new WeakMap(), this.__addedByRouter = /* @__PURE__ */ new WeakMap();
  }
  __resolveRoute(e) {
    const t = e.route;
    let n = Promise.resolve();
    I(t.children) && (n = n.then(() => t.children(sr(e))).then((i) => {
      !Ae(i) && !I(t.children) && (i = t.children), lr(i, t);
    }));
    const o = {
      redirect: (i) => Ze(e, i),
      component: (i) => {
        const a = document.createElement(i);
        return this.__createdByRouter.set(a, !0), a;
      }
    };
    return n.then(() => {
      if (this.__isLatestRender(e))
        return ce(t.action, [e, o], t);
    }).then((i) => {
      if (Ae(i) && (i instanceof HTMLElement || i.redirect || i === z))
        return i;
      if (P(t.redirect))
        return o.redirect(t.redirect);
      if (t.bundle)
        return Mt(t.bundle).then(() => {
        }, () => {
          throw new Error(C(`Bundle not found: ${t.bundle}. Check if the file name is correct`));
        });
    }).then((i) => {
      if (Ae(i))
        return i;
      if (P(t.component))
        return o.component(t.component);
    });
  }
  /**
   * Sets the router outlet (the DOM node where the content for the current
   * route is inserted). Any content pre-existing in the router outlet is
   * removed at the end of each render pass.
   *
   * NOTE: this method is automatically invoked first time when creating a new Router instance.
   *
   * @param {?Node} outlet the DOM node where the content for the current route
   *     is inserted.
   */
  setOutlet(e) {
    e && this.__ensureOutlet(e), this.__outlet = e;
  }
  /**
   * Returns the current router outlet. The initial value is `undefined`.
   *
   * @return {?Node} the current router outlet (or `undefined`)
   */
  getOutlet() {
    return this.__outlet;
  }
  /**
   * Sets the routing config (replacing the existing one) and triggers a
   * navigation event so that the router outlet is refreshed according to the
   * current `window.location` and the new routing config.
   *
   * Each route object may have the following properties, listed here in the processing order:
   * * `path` – the route path (relative to the parent route if any) in the
   * [express.js syntax](https://expressjs.com/en/guide/routing.html#route-paths").
   *
   * * `children` – an array of nested routes or a function that provides this
   * array at the render time. The function can be synchronous or asynchronous:
   * in the latter case the render is delayed until the returned promise is
   * resolved. The `children` function is executed every time when this route is
   * being rendered. This allows for dynamic route structures (e.g. backend-defined),
   * but it might have a performance impact as well. In order to avoid calling
   * the function on subsequent renders, you can override the `children` property
   * of the route object and save the calculated array there
   * (via `context.route.children = [ route1, route2, ...];`).
   * Parent routes are fully resolved before resolving the children. Children
   * 'path' values are relative to the parent ones.
   *
   * * `action` – the action that is executed before the route is resolved.
   * The value for this property should be a function, accepting `context`
   * and `commands` parameters described below. If present, this function is
   * always invoked first, disregarding of the other properties' presence.
   * The action can return a result directly or within a `Promise`, which
   * resolves to the result. If the action result is an `HTMLElement` instance,
   * a `commands.component(name)` result, a `commands.redirect(path)` result,
   * or a `context.next()` result, the current route resolution is finished,
   * and other route config properties are ignored.
   * See also **Route Actions** section in [Live Examples](#/classes/Router/demos/demo/index.html).
   *
   * * `redirect` – other route's path to redirect to. Passes all route parameters to the redirect target.
   * The target route should also be defined.
   * See also **Redirects** section in [Live Examples](#/classes/Router/demos/demo/index.html).
   *
   * * `bundle` – string containing the path to `.js` or `.mjs` bundle to load before resolving the route,
   * or the object with "module" and "nomodule" keys referring to different bundles.
   * Each bundle is only loaded once. If "module" and "nomodule" are set, only one bundle is loaded,
   * depending on whether the browser supports ES modules or not.
   * The property is ignored when either an `action` returns the result or `redirect` property is present.
   * Any error, e.g. 404 while loading bundle will cause route resolution to throw.
   * See also **Code Splitting** section in [Live Examples](#/classes/Router/demos/demo/index.html).
   *
   * * `component` – the tag name of the Web Component to resolve the route to.
   * The property is ignored when either an `action` returns the result or `redirect` property is present.
   * If route contains the `component` property (or an action that return a component)
   * and its child route also contains the `component` property, child route's component
   * will be rendered as a light dom child of a parent component.
   *
   * * `name` – the string name of the route to use in the
   * [`router.urlForName(name, params)`](#/classes/Router#method-urlForName)
   * navigation helper method.
   *
   * For any route function (`action`, `children`) defined, the corresponding `route` object is available inside the callback
   * through the `this` reference. If you need to access it, make sure you define the callback as a non-arrow function
   * because arrow functions do not have their own `this` reference.
   *
   * `context` object that is passed to `action` function holds the following properties:
   * * `context.pathname` – string with the pathname being resolved
   *
   * * `context.search` – search query string
   *
   * * `context.hash` – hash string
   *
   * * `context.params` – object with route parameters
   *
   * * `context.route` – object that holds the route that is currently being rendered.
   *
   * * `context.next()` – function for asynchronously getting the next route
   * contents from the resolution chain (if any)
   *
   * `commands` object that is passed to `action` function has
   * the following methods:
   *
   * * `commands.redirect(path)` – function that creates a redirect data
   * for the path specified.
   *
   * * `commands.component(component)` – function that creates a new HTMLElement
   * with current context. Note: the component created by this function is reused if visiting the same path twice in row.
   *
   *
   * @param {!Array<!Route>|!Route} routes a single route or an array of those
   * @param {?boolean} skipRender configure the router but skip rendering the
   *     route corresponding to the current `window.location` values
   *
   * @return {!Promise<!Node>}
   */
  setRoutes(e, t = !1) {
    return this.__previousContext = void 0, this.__urlForName = void 0, super.setRoutes(e), t || this.__onNavigationEvent(), this.ready;
  }
  /**
   * Asynchronously resolves the given pathname and renders the resolved route
   * component into the router outlet. If no router outlet is set at the time of
   * calling this method, or at the time when the route resolution is completed,
   * a `TypeError` is thrown.
   *
   * Returns a promise that is fulfilled with the router outlet DOM Node after
   * the route component is created and inserted into the router outlet, or
   * rejected if no route matches the given path.
   *
   * If another render pass is started before the previous one is completed, the
   * result of the previous render pass is ignored.
   *
   * @param {!string|!{pathname: !string, search: ?string, hash: ?string}} pathnameOrContext
   *    the pathname to render or a context object with a `pathname` property,
   *    optional `search` and `hash` properties, and other properties
   *    to pass to the resolver.
   * @param {boolean=} shouldUpdateHistory
   *    update browser history with the rendered location
   * @return {!Promise<!Node>}
   */
  render(e, t) {
    const n = ++this.__lastStartedRenderId, o = Object.assign(
      {
        search: "",
        hash: ""
      },
      P(e) ? { pathname: e } : e,
      {
        __renderId: n
      }
    );
    return this.ready = this.resolve(o).then((i) => this.__fullyResolveChain(i)).then((i) => {
      if (this.__isLatestRender(i)) {
        const a = this.__previousContext;
        if (i === a)
          return this.__updateBrowserHistory(a, !0), this.location;
        if (this.location = R(i), t && this.__updateBrowserHistory(i, n === 1), Z("location-changed", { router: this, location: this.location }), i.__skipAttach)
          return this.__copyUnchangedElements(i, a), this.__previousContext = i, this.location;
        this.__addAppearingContent(i, a);
        const h = this.__animateIfNeeded(i);
        return this.__runOnAfterEnterCallbacks(i), this.__runOnAfterLeaveCallbacks(i, a), h.then(() => {
          if (this.__isLatestRender(i))
            return this.__removeDisappearingContent(), this.__previousContext = i, this.location;
        });
      }
    }).catch((i) => {
      if (n === this.__lastStartedRenderId)
        throw t && this.__updateBrowserHistory(o), le(this.__outlet && this.__outlet.children), this.location = R(Object.assign(o, { resolver: this })), Z("error", Object.assign({ router: this, error: i }, o)), i;
    }), this.ready;
  }
  // `topOfTheChainContextBeforeRedirects` is a context coming from Resolver.resolve().
  // It would contain a 'redirect' route or the first 'component' route that
  // matched the pathname. There might be more child 'component' routes to be
  // resolved and added into the chain. This method would find and add them.
  // `contextBeforeRedirects` is the context containing such a child component
  // route. It's only necessary when this method is called recursively (otherwise
  // it's the same as the 'top of the chain' context).
  //
  // Apart from building the chain of child components, this method would also
  // handle 'redirect' routes, call 'onBefore' callbacks and handle 'prevent'
  // and 'redirect' callback results.
  __fullyResolveChain(e, t = e) {
    return this.__findComponentContextAfterAllRedirects(t).then((n) => {
      const i = n !== t ? n : e, h = he(
        St(n.chain),
        n.resolver
      ) === n.pathname, s = (l, _ = l.route, f) => l.next(void 0, _, f).then((p) => p === null || p === z ? h ? l : _.parent !== null ? s(l, _.parent, p) : p : p);
      return s(n).then((l) => {
        if (l === null || l === z)
          throw vt(i);
        return l && l !== z && l !== n ? this.__fullyResolveChain(i, l) : this.__amendWithOnBeforeCallbacks(n);
      });
    });
  }
  __findComponentContextAfterAllRedirects(e) {
    const t = e.result;
    return t instanceof HTMLElement ? (ar(e, t), Promise.resolve(e)) : t.redirect ? this.__redirect(t.redirect, e.__redirectCount, e.__renderId).then((n) => this.__findComponentContextAfterAllRedirects(n)) : t instanceof Error ? Promise.reject(t) : Promise.reject(
      new Error(
        C(
          `Invalid route resolution result for path "${e.pathname}". Expected redirect object or HTML element, but got: "${Ut(t)}". Double check the action return value for the route.`
        )
      )
    );
  }
  __amendWithOnBeforeCallbacks(e) {
    return this.__runOnBeforeCallbacks(e).then((t) => t === this.__previousContext || t === e ? t : this.__fullyResolveChain(t));
  }
  __runOnBeforeCallbacks(e) {
    const t = this.__previousContext || {}, n = t.chain || [], o = e.chain;
    let i = Promise.resolve();
    const a = () => ({ cancel: !0 }), h = (s) => Ze(e, s);
    if (e.__divergedChainIndex = 0, e.__skipAttach = !1, n.length) {
      for (let s = 0; s < Math.min(n.length, o.length) && !(n[s].route !== o[s].route || n[s].path !== o[s].path && n[s].element !== o[s].element || !this.__isReusableElement(n[s].element, o[s].element)); s = ++e.__divergedChainIndex)
        ;
      if (e.__skipAttach = // Same route chain
      o.length === n.length && e.__divergedChainIndex == o.length && // Same element
      this.__isReusableElement(e.result, t.result), e.__skipAttach) {
        for (let s = o.length - 1; s >= 0; s--)
          i = this.__runOnBeforeLeaveCallbacks(i, e, { prevent: a }, n[s]);
        for (let s = 0; s < o.length; s++)
          i = this.__runOnBeforeEnterCallbacks(i, e, { prevent: a, redirect: h }, o[s]), n[s].element.location = R(e, n[s].route);
      } else
        for (let s = n.length - 1; s >= e.__divergedChainIndex; s--)
          i = this.__runOnBeforeLeaveCallbacks(i, e, { prevent: a }, n[s]);
    }
    if (!e.__skipAttach)
      for (let s = 0; s < o.length; s++)
        s < e.__divergedChainIndex ? s < n.length && n[s].element && (n[s].element.location = R(e, n[s].route)) : (i = this.__runOnBeforeEnterCallbacks(i, e, { prevent: a, redirect: h }, o[s]), o[s].element && (o[s].element.location = R(e, o[s].route)));
    return i.then((s) => {
      if (s) {
        if (s.cancel)
          return this.__previousContext.__renderId = e.__renderId, this.__previousContext;
        if (s.redirect)
          return this.__redirect(s.redirect, e.__redirectCount, e.__renderId);
      }
      return e;
    });
  }
  __runOnBeforeLeaveCallbacks(e, t, n, o) {
    const i = R(t);
    return e.then((a) => {
      if (this.__isLatestRender(t))
        return et("onBeforeLeave", [i, n, this], o.element)(a);
    }).then((a) => {
      if (!(a || {}).redirect)
        return a;
    });
  }
  __runOnBeforeEnterCallbacks(e, t, n, o) {
    const i = R(t, o.route);
    return e.then((a) => {
      if (this.__isLatestRender(t))
        return et("onBeforeEnter", [i, n, this], o.element)(a);
    });
  }
  __isReusableElement(e, t) {
    return e && t ? this.__createdByRouter.get(e) && this.__createdByRouter.get(t) ? e.localName === t.localName : e === t : !1;
  }
  __isLatestRender(e) {
    return e.__renderId === this.__lastStartedRenderId;
  }
  __redirect(e, t, n) {
    if (t > or)
      throw new Error(C(`Too many redirects when rendering ${e.from}`));
    return this.resolve({
      pathname: this.urlForPath(
        e.pathname,
        e.params
      ),
      redirectFrom: e.from,
      __redirectCount: (t || 0) + 1,
      __renderId: n
    });
  }
  __ensureOutlet(e = this.__outlet) {
    if (!(e instanceof Node))
      throw new TypeError(C(`Expected router outlet to be a valid DOM Node (but got ${e})`));
  }
  __updateBrowserHistory({ pathname: e, search: t = "", hash: n = "" }, o) {
    if (window.location.pathname !== e || window.location.search !== t || window.location.hash !== n) {
      const i = o ? "replaceState" : "pushState";
      window.history[i](null, document.title, e + t + n), window.dispatchEvent(new PopStateEvent("popstate", { state: "vaadin-router-ignore" }));
    }
  }
  __copyUnchangedElements(e, t) {
    let n = this.__outlet;
    for (let o = 0; o < e.__divergedChainIndex; o++) {
      const i = t && t.chain[o].element;
      if (i)
        if (i.parentNode === n)
          e.chain[o].element = i, n = i;
        else
          break;
    }
    return n;
  }
  __addAppearingContent(e, t) {
    this.__ensureOutlet(), this.__removeAppearingContent();
    const n = this.__copyUnchangedElements(e, t);
    this.__appearingContent = [], this.__disappearingContent = Array.from(n.children).filter(
      // Only remove layout content that was added by router
      (i) => this.__addedByRouter.get(i) && // Do not remove the result element to avoid flickering
      i !== e.result
    );
    let o = n;
    for (let i = e.__divergedChainIndex; i < e.chain.length; i++) {
      const a = e.chain[i].element;
      a && (o.appendChild(a), this.__addedByRouter.set(a, !0), o === n && this.__appearingContent.push(a), o = a);
    }
  }
  __removeDisappearingContent() {
    this.__disappearingContent && le(this.__disappearingContent), this.__disappearingContent = null, this.__appearingContent = null;
  }
  __removeAppearingContent() {
    this.__disappearingContent && this.__appearingContent && (le(this.__appearingContent), this.__disappearingContent = null, this.__appearingContent = null);
  }
  __runOnAfterLeaveCallbacks(e, t) {
    if (t)
      for (let n = t.chain.length - 1; n >= e.__divergedChainIndex && this.__isLatestRender(e); n--) {
        const o = t.chain[n].element;
        if (o)
          try {
            const i = R(e);
            ce(
              o.onAfterLeave,
              [i, {}, t.resolver],
              o
            );
          } finally {
            this.__disappearingContent.indexOf(o) > -1 && le(o.children);
          }
      }
  }
  __runOnAfterEnterCallbacks(e) {
    for (let t = e.__divergedChainIndex; t < e.chain.length && this.__isLatestRender(e); t++) {
      const n = e.chain[t].element || {}, o = R(e, e.chain[t].route);
      ce(
        n.onAfterEnter,
        [o, {}, e.resolver],
        n
      );
    }
  }
  __animateIfNeeded(e) {
    const t = (this.__disappearingContent || [])[0], n = (this.__appearingContent || [])[0], o = [], i = e.chain;
    let a;
    for (let h = i.length; h > 0; h--)
      if (i[h - 1].route.animate) {
        a = i[h - 1].route.animate;
        break;
      }
    if (t && n && a) {
      const h = ve(a) && a.leave || "leaving", s = ve(a) && a.enter || "entering";
      o.push(Ye(t, h)), o.push(Ye(n, s));
    }
    return Promise.all(o).then(() => e);
  }
  /**
   * Subscribes this instance to navigation events on the `window`.
   *
   * NOTE: beware of resource leaks. For as long as a router instance is
   * subscribed to navigation events, it won't be garbage collected.
   */
  subscribe() {
    window.addEventListener("vaadin-router-go", this.__navigationEventHandler);
  }
  /**
   * Removes the subscription to navigation events created in the `subscribe()`
   * method.
   */
  unsubscribe() {
    window.removeEventListener("vaadin-router-go", this.__navigationEventHandler);
  }
  __onNavigationEvent(e) {
    const { pathname: t, search: n, hash: o } = e ? e.detail : window.location;
    P(this.__normalizePathname(t)) && (e && e.preventDefault && e.preventDefault(), this.render({ pathname: t, search: n, hash: o }, !0));
  }
  /**
   * Configures what triggers Router navigation events:
   *  - `POPSTATE`: popstate events on the current `window`
   *  - `CLICK`: click events on `<a>` links leading to the current page
   *
   * This method is invoked with the pre-configured values when creating a new Router instance.
   * By default, both `POPSTATE` and `CLICK` are enabled. This setup is expected to cover most of the use cases.
   *
   * See the `router-config.js` for the default navigation triggers config. Based on it, you can
   * create the own one and only import the triggers you need, instead of pulling in all the code,
   * e.g. if you want to handle `click` differently.
   *
   * See also **Navigation Triggers** section in [Live Examples](#/classes/Router/demos/demo/index.html).
   *
   * @param {...NavigationTrigger} triggers
   */
  static setTriggers(...e) {
    rr(e);
  }
  /**
   * Generates a URL for the route with the given name, optionally performing
   * substitution of parameters.
   *
   * The route is searched in all the Router instances subscribed to
   * navigation events.
   *
   * **Note:** For child route names, only array children are considered.
   * It is not possible to generate URLs using a name for routes set with
   * a children function.
   *
   * @function urlForName
   * @param {!string} name the route name or the route’s `component` name.
   * @param {Params=} params Optional object with route path parameters.
   * Named parameters are passed by name (`params[name] = value`), unnamed
   * parameters are passed by index (`params[index] = value`).
   *
   * @return {string}
   */
  urlForName(e, t) {
    return this.__urlForName || (this.__urlForName = tr(this)), he(
      this.__urlForName(e, t),
      this
    );
  }
  /**
   * Generates a URL for the given route path, optionally performing
   * substitution of parameters.
   *
   * @param {!string} path string route path declared in [express.js syntax](https://expressjs.com/en/guide/routing.html#route-paths").
   * @param {Params=} params Optional object with route path parameters.
   * Named parameters are passed by name (`params[name] = value`), unnamed
   * parameters are passed by index (`params[index] = value`).
   *
   * @return {string}
   */
  urlForPath(e, t) {
    return he(
      S.pathToRegexp.compile(e)(t),
      this
    );
  }
  /**
   * Triggers navigation to a new path. Returns a boolean without waiting until
   * the navigation is complete. Returns `true` if at least one `Router`
   * has handled the navigation (was subscribed and had `baseUrl` matching
   * the `path` argument), otherwise returns `false`.
   *
   * @param {!string|!{pathname: !string, search: (string|undefined), hash: (string|undefined)}} path
   *   a new in-app path string, or an URL-like object with `pathname`
   *   string property, and optional `search` and `hash` string properties.
   * @return {boolean}
   */
  static go(e) {
    const { pathname: t, search: n, hash: o } = P(e) ? this.__createUrl(e, "http://a") : e;
    return Z("go", { pathname: t, search: n, hash: o });
  }
}
const cr = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i, ue = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;
function hr() {
  function r() {
    return !0;
  }
  return Lt(r);
}
function ur() {
  try {
    return dr() ? !0 : fr() ? ue ? !pr() : !hr() : !1;
  } catch {
    return !1;
  }
}
function dr() {
  return localStorage.getItem("vaadin.developmentmode.force");
}
function fr() {
  return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
}
function pr() {
  return !!(ue && Object.keys(ue).map((e) => ue[e]).filter((e) => e.productionMode).length > 0);
}
function Lt(r, e) {
  if (typeof r != "function")
    return;
  const t = cr.exec(r.toString());
  if (t)
    try {
      r = new Function(t[1]);
    } catch (n) {
      console.log("vaadin-development-mode-detector: uncommentAndRun() failed", n);
    }
  return r(e);
}
window.Vaadin = window.Vaadin || {};
const tt = function(r, e) {
  if (window.Vaadin.developmentMode)
    return Lt(r, e);
};
window.Vaadin.developmentMode === void 0 && (window.Vaadin.developmentMode = ur());
function _r() {
}
const vr = function() {
  if (typeof tt == "function")
    return tt(_r);
};
window.Vaadin = window.Vaadin || {};
window.Vaadin.registrations = window.Vaadin.registrations || [];
window.Vaadin.registrations.push({
  is: "@vaadin/router",
  version: "1.7.4"
});
vr();
S.NavigationTrigger = { POPSTATE: kt, CLICK: It };
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = window, ke = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, De = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== De)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ke && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = rt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && rt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const gr = (r) => new Rt(typeof r == "string" ? r : r + "", void 0, De), mr = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((n, o, i) => n + ((a) => {
    if (a._$cssResult$ === !0)
      return a.cssText;
    if (typeof a == "number")
      return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + r[i + 1], r[0]);
  return new Rt(t, r, De);
}, yr = (r, e) => {
  ke ? r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach((t) => {
    const n = document.createElement("style"), o = de.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = t.cssText, r.appendChild(n);
  });
}, nt = ke ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules)
    t += n.cssText;
  return gr(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Se;
const ge = window, it = ge.trustedTypes, $r = it ? it.emptyScript : "", ot = ge.reactiveElementPolyfillSupport, He = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? $r : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, Pt = (r, e) => e !== r && (e == e || r == r), Le = { attribute: !0, type: String, converter: He, reflect: !1, hasChanged: Pt };
let V = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(e) {
    var t;
    this.finalize(), ((t = this.h) !== null && t !== void 0 ? t : this.h = []).push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return this.elementProperties.forEach((t, n) => {
      const o = this._$Ep(n, t);
      o !== void 0 && (this._$Ev.set(o, n), e.push(o));
    }), e;
  }
  static createProperty(e, t = Le) {
    if (t.state && (t.attribute = !1), this.finalize(), this.elementProperties.set(e, t), !t.noAccessor && !this.prototype.hasOwnProperty(e)) {
      const n = typeof e == "symbol" ? Symbol() : "__" + e, o = this.getPropertyDescriptor(e, n, t);
      o !== void 0 && Object.defineProperty(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    return { get() {
      return this[t];
    }, set(o) {
      const i = this[e];
      this[t] = o, this.requestUpdate(e, i, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || Le;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (e.finalize(), e.h !== void 0 && (this.h = [...e.h]), this.elementProperties = new Map(e.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties, n = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const o of n)
        this.createProperty(o, t[o]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const o of n)
        t.unshift(nt(o));
    } else
      e !== void 0 && t.push(nt(e));
    return t;
  }
  static _$Ep(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  u() {
    var e;
    this._$E_ = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (e = this.constructor.h) === null || e === void 0 || e.forEach((t) => t(this));
  }
  addController(e) {
    var t, n;
    ((t = this._$ES) !== null && t !== void 0 ? t : this._$ES = []).push(e), this.renderRoot !== void 0 && this.isConnected && ((n = e.hostConnected) === null || n === void 0 || n.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.splice(this._$ES.indexOf(e) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this._$Ei.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t = (e = this.shadowRoot) !== null && e !== void 0 ? e : this.attachShadow(this.constructor.shadowRootOptions);
    return yr(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var n;
      return (n = t.hostConnected) === null || n === void 0 ? void 0 : n.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((t) => {
      var n;
      return (n = t.hostDisconnected) === null || n === void 0 ? void 0 : n.call(t);
    });
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$EO(e, t, n = Le) {
    var o;
    const i = this.constructor._$Ep(e, n);
    if (i !== void 0 && n.reflect === !0) {
      const a = (((o = n.converter) === null || o === void 0 ? void 0 : o.toAttribute) !== void 0 ? n.converter : He).toAttribute(t, n.type);
      this._$El = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$El = null;
    }
  }
  _$AK(e, t) {
    var n;
    const o = this.constructor, i = o._$Ev.get(e);
    if (i !== void 0 && this._$El !== i) {
      const a = o.getPropertyOptions(i), h = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) === null || n === void 0 ? void 0 : n.fromAttribute) !== void 0 ? a.converter : He;
      this._$El = i, this[i] = h.fromAttribute(t, a.type), this._$El = null;
    }
  }
  requestUpdate(e, t, n) {
    let o = !0;
    e !== void 0 && (((n = n || this.constructor.getPropertyOptions(e)).hasChanged || Pt)(this[e], t) ? (this._$AL.has(e) || this._$AL.set(e, t), n.reflect === !0 && this._$El !== e && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(e, n))) : o = !1), !this.isUpdatePending && o && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((o, i) => this[i] = o), this._$Ei = void 0);
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), (e = this._$ES) === null || e === void 0 || e.forEach((o) => {
        var i;
        return (i = o.hostUpdate) === null || i === void 0 ? void 0 : i.call(o);
      }), this.update(n)) : this._$Ek();
    } catch (o) {
      throw t = !1, this._$Ek(), o;
    }
    t && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((n) => {
      var o;
      return (o = n.hostUpdated) === null || o === void 0 ? void 0 : o.call(n);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$EC !== void 0 && (this._$EC.forEach((t, n) => this._$EO(n, this[n], t)), this._$EC = void 0), this._$Ek();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
V.finalized = !0, V.elementProperties = /* @__PURE__ */ new Map(), V.elementStyles = [], V.shadowRootOptions = { mode: "open" }, ot == null || ot({ ReactiveElement: V }), ((Se = ge.reactiveElementVersions) !== null && Se !== void 0 ? Se : ge.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Re;
const me = window, x = me.trustedTypes, st = x ? x.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ie = "$lit$", N = `lit$${(Math.random() + "").slice(9)}$`, Ct = "?" + N, wr = `<${Ct}>`, W = document, re = () => W.createComment(""), ne = (r) => r === null || typeof r != "object" && typeof r != "function", Ot = Array.isArray, Er = (r) => Ot(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Pe = `[ 	
\f\r]`, Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, at = /-->/g, lt = />/g, M = RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ht = /"/g, Tt = /^(?:script|style|textarea|title)$/i, br = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), Ar = br(1), K = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), G = W.createTreeWalker(W, 129, null, !1), Sr = (r, e) => {
  const t = r.length - 1, n = [];
  let o, i = e === 2 ? "<svg>" : "", a = Y;
  for (let s = 0; s < t; s++) {
    const l = r[s];
    let _, f, p = -1, g = 0;
    for (; g < l.length && (a.lastIndex = g, f = a.exec(l), f !== null); )
      g = a.lastIndex, a === Y ? f[1] === "!--" ? a = at : f[1] !== void 0 ? a = lt : f[2] !== void 0 ? (Tt.test(f[2]) && (o = RegExp("</" + f[2], "g")), a = M) : f[3] !== void 0 && (a = M) : a === M ? f[0] === ">" ? (a = o ?? Y, p = -1) : f[1] === void 0 ? p = -2 : (p = a.lastIndex - f[2].length, _ = f[1], a = f[3] === void 0 ? M : f[3] === '"' ? ht : ct) : a === ht || a === ct ? a = M : a === at || a === lt ? a = Y : (a = M, o = void 0);
    const E = a === M && r[s + 1].startsWith("/>") ? " " : "";
    i += a === Y ? l + wr : p >= 0 ? (n.push(_), l.slice(0, p) + Ie + l.slice(p) + N + E) : l + N + (p === -2 ? (n.push(void 0), s) : E);
  }
  const h = i + (r[t] || "<?>") + (e === 2 ? "</svg>" : "");
  if (!Array.isArray(r) || !r.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [st !== void 0 ? st.createHTML(h) : h, n];
};
class ie {
  constructor({ strings: e, _$litType$: t }, n) {
    let o;
    this.parts = [];
    let i = 0, a = 0;
    const h = e.length - 1, s = this.parts, [l, _] = Sr(e, t);
    if (this.el = ie.createElement(l, n), G.currentNode = this.el.content, t === 2) {
      const f = this.el.content, p = f.firstChild;
      p.remove(), f.append(...p.childNodes);
    }
    for (; (o = G.nextNode()) !== null && s.length < h; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) {
          const f = [];
          for (const p of o.getAttributeNames())
            if (p.endsWith(Ie) || p.startsWith(N)) {
              const g = _[a++];
              if (f.push(p), g !== void 0) {
                const E = o.getAttribute(g.toLowerCase() + Ie).split(N), O = /([.?@])?(.*)/.exec(g);
                s.push({ type: 1, index: i, name: O[2], strings: E, ctor: O[1] === "." ? Rr : O[1] === "?" ? Cr : O[1] === "@" ? Or : $e });
              } else
                s.push({ type: 6, index: i });
            }
          for (const p of f)
            o.removeAttribute(p);
        }
        if (Tt.test(o.tagName)) {
          const f = o.textContent.split(N), p = f.length - 1;
          if (p > 0) {
            o.textContent = x ? x.emptyScript : "";
            for (let g = 0; g < p; g++)
              o.append(f[g], re()), G.nextNode(), s.push({ type: 2, index: ++i });
            o.append(f[p], re());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === Ct)
          s.push({ type: 2, index: i });
        else {
          let f = -1;
          for (; (f = o.data.indexOf(N, f + 1)) !== -1; )
            s.push({ type: 7, index: i }), f += N.length - 1;
        }
      i++;
    }
  }
  static createElement(e, t) {
    const n = W.createElement("template");
    return n.innerHTML = e, n;
  }
}
function q(r, e, t = r, n) {
  var o, i, a, h;
  if (e === K)
    return e;
  let s = n !== void 0 ? (o = t._$Co) === null || o === void 0 ? void 0 : o[n] : t._$Cl;
  const l = ne(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== l && ((i = s == null ? void 0 : s._$AO) === null || i === void 0 || i.call(s, !1), l === void 0 ? s = void 0 : (s = new l(r), s._$AT(r, t, n)), n !== void 0 ? ((a = (h = t)._$Co) !== null && a !== void 0 ? a : h._$Co = [])[n] = s : t._$Cl = s), s !== void 0 && (e = q(r, s._$AS(r, e.values), s, n)), e;
}
class Lr {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    var t;
    const { el: { content: n }, parts: o } = this._$AD, i = ((t = e == null ? void 0 : e.creationScope) !== null && t !== void 0 ? t : W).importNode(n, !0);
    G.currentNode = i;
    let a = G.nextNode(), h = 0, s = 0, l = o[0];
    for (; l !== void 0; ) {
      if (h === l.index) {
        let _;
        l.type === 2 ? _ = new oe(a, a.nextSibling, this, e) : l.type === 1 ? _ = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (_ = new Tr(a, this, e)), this._$AV.push(_), l = o[++s];
      }
      h !== (l == null ? void 0 : l.index) && (a = G.nextNode(), h++);
    }
    return i;
  }
  v(e) {
    let t = 0;
    for (const n of this._$AV)
      n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class oe {
  constructor(e, t, n, o) {
    var i;
    this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = o, this._$Cp = (i = o == null ? void 0 : o.isConnected) === null || i === void 0 || i;
  }
  get _$AU() {
    var e, t;
    return (t = (e = this._$AM) === null || e === void 0 ? void 0 : e._$AU) !== null && t !== void 0 ? t : this._$Cp;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = q(this, e, t), ne(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== K && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : Er(e) ? this.T(e) : this._(e);
  }
  k(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  $(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
  }
  _(e) {
    this._$AH !== w && ne(this._$AH) ? this._$AA.nextSibling.data = e : this.$(W.createTextNode(e)), this._$AH = e;
  }
  g(e) {
    var t;
    const { values: n, _$litType$: o } = e, i = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = ie.createElement(o.h, this.options)), o);
    if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === i)
      this._$AH.v(n);
    else {
      const a = new Lr(i, this), h = a.u(this.options);
      a.v(n), this.$(h), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = ut.get(e.strings);
    return t === void 0 && ut.set(e.strings, t = new ie(e)), t;
  }
  T(e) {
    Ot(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, o = 0;
    for (const i of e)
      o === t.length ? t.push(n = new oe(this.k(re()), this.k(re()), this, this.options)) : n = t[o], n._$AI(i), o++;
    o < t.length && (this._$AR(n && n._$AB.nextSibling, o), t.length = o);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) === null || n === void 0 || n.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const o = e.nextSibling;
      e.remove(), e = o;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cp = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
  }
}
class $e {
  constructor(e, t, n, o, i) {
    this.type = 1, this._$AH = w, this._$AN = void 0, this.element = e, this.name = t, this._$AM = o, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = w;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, n, o) {
    const i = this.strings;
    let a = !1;
    if (i === void 0)
      e = q(this, e, t, 0), a = !ne(e) || e !== this._$AH && e !== K, a && (this._$AH = e);
    else {
      const h = e;
      let s, l;
      for (e = i[0], s = 0; s < i.length - 1; s++)
        l = q(this, h[n + s], t, s), l === K && (l = this._$AH[s]), a || (a = !ne(l) || l !== this._$AH[s]), l === w ? e = w : e !== w && (e += (l ?? "") + i[s + 1]), this._$AH[s] = l;
    }
    a && !o && this.j(e);
  }
  j(e) {
    e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Rr extends $e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === w ? void 0 : e;
  }
}
const Pr = x ? x.emptyScript : "";
class Cr extends $e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    e && e !== w ? this.element.setAttribute(this.name, Pr) : this.element.removeAttribute(this.name);
  }
}
class Or extends $e {
  constructor(e, t, n, o, i) {
    super(e, t, n, o, i), this.type = 5;
  }
  _$AI(e, t = this) {
    var n;
    if ((e = (n = q(this, e, t, 0)) !== null && n !== void 0 ? n : w) === K)
      return;
    const o = this._$AH, i = e === w && o !== w || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, a = e !== w && (o === w || i);
    i && this.element.removeEventListener(this.name, this, o), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t, n;
    typeof this._$AH == "function" ? this._$AH.call((n = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && n !== void 0 ? n : this.element, e) : this._$AH.handleEvent(e);
  }
}
class Tr {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    q(this, e);
  }
}
const dt = me.litHtmlPolyfillSupport;
dt == null || dt(ie, oe), ((Re = me.litHtmlVersions) !== null && Re !== void 0 ? Re : me.litHtmlVersions = []).push("2.7.2");
const Nr = (r, e, t) => {
  var n, o;
  const i = (n = t == null ? void 0 : t.renderBefore) !== null && n !== void 0 ? n : e;
  let a = i._$litPart$;
  if (a === void 0) {
    const h = (o = t == null ? void 0 : t.renderBefore) !== null && o !== void 0 ? o : null;
    i._$litPart$ = a = new oe(e.insertBefore(re(), h), h, void 0, t ?? {});
  }
  return a._$AI(r), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ce, Oe;
class ee extends V {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e, t;
    const n = super.createRenderRoot();
    return (e = (t = this.renderOptions).renderBefore) !== null && e !== void 0 || (t.renderBefore = n.firstChild), n;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Nr(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) === null || e === void 0 || e.setConnected(!1);
  }
  render() {
    return K;
  }
}
ee.finalized = !0, ee._$litElement$ = !0, (Ce = globalThis.litElementHydrateSupport) === null || Ce === void 0 || Ce.call(globalThis, { LitElement: ee });
const ft = globalThis.litElementPolyfillSupport;
ft == null || ft({ LitElement: ee });
((Oe = globalThis.litElementVersions) !== null && Oe !== void 0 ? Oe : globalThis.litElementVersions = []).push("3.3.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ur = (r) => (e) => typeof e == "function" ? ((t, n) => (customElements.define(t, n), n))(r, e) : ((t, n) => {
  const { kind: o, elements: i } = n;
  return { kind: o, elements: i, finisher(a) {
    customElements.define(t, a);
  } };
})(r, e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mr = (r, e) => e.kind === "method" && e.descriptor && !("value" in e.descriptor) ? { ...e, finisher(t) {
  t.createProperty(e.key, r);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e.key, initializer() {
  typeof e.initializer == "function" && (this[e.key] = e.initializer.call(this));
}, finisher(t) {
  t.createProperty(e.key, r);
} };
function Hr(r) {
  return (e, t) => t !== void 0 ? ((n, o, i) => {
    o.constructor.createProperty(i, n);
  })(r, e, t) : Mr(r, e);
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Te;
((Te = window.HTMLSlotElement) === null || Te === void 0 ? void 0 : Te.prototype.assignedElements) != null;
var Ir = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, Nt = (r, e, t, n) => {
  for (var o = n > 1 ? void 0 : n ? jr(e, t) : e, i = r.length - 1, a; i >= 0; i--)
    (a = r[i]) && (o = (n ? a(e, t, o) : a(o)) || o);
  return n && o && Ir(e, t, o), o;
};
let ye = class extends ee {
  constructor() {
    super(), this.isLogin = !1, fetch("http://localhost:5000/api/Users/VerifyLogin", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((r) => {
      r.status == 200 || r.status == 204 ? this.isLogin = !0 : this.isLogin = !1;
      const e = {
        detail: { isLogin: this.isLogin },
        bubbles: !0,
        composed: !0
      };
      this.dispatchEvent(new CustomEvent("isLogin", e));
    });
  }
  async connectedCallback() {
    super.connectedCallback(), document.addEventListener("isLogin", (r) => {
      this.isLogin = r.detail.isLogin;
    });
  }
  render() {
    return Ar`
      <div class="header">
        <a @click="${this._goHome}">home</a>
        <a @click="${this._goNotify}">notify</a>
        <span ?hidden="${this.isLogin}">
          <a id="login" @click="${this._goLogin}">登入</a>
        </span>
        <span ?hidden="${!this.isLogin}">
          <a id="logout" @click="${this._LineLogout}">登出</a>
        </span>
      </div>
      <slot></slot>
    `;
  }
  async _LineLogout() {
    fetch("http://localhost:5000/api/Users/RevokeLogin", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }), this.isLogin = !1, window.alert("登出成功!"), S.go("/login");
  }
  _goHome(r) {
    r.preventDefault(), S.go("/");
  }
  _goNotify(r) {
    r.preventDefault(), S.go("/notify");
  }
  _goLogin(r) {
    r.preventDefault(), S.go("/login");
  }
};
ye.styles = mr`
    :host {
      display: flex;
      justify-content: center;
    }

    .header {
      padding: 20px;
    }

    #logout {
      color: chocolate;
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    #login {
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    a {
      display: inline-block;
      padding: 10px;
      letter-spacing: 1px;
      text-decoration: none;
      transition: 500ms;
      cursor: pointer;
    }
    a:hover {
      transition: 1s;
      opacity: 0.5;
    }
  `;
Nt([
  Hr()
], ye.prototype, "isLogin", 2);
ye = Nt([
  Ur("my-header")
], ye);
function H() {
  H = function() {
    return r;
  };
  var r = {}, e = Object.prototype, t = e.hasOwnProperty, n = Object.defineProperty || function(u, c, d) {
    u[c] = d.value;
  }, o = typeof Symbol == "function" ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", h = o.toStringTag || "@@toStringTag";
  function s(u, c, d) {
    return Object.defineProperty(u, c, {
      value: d,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), u[c];
  }
  try {
    s({}, "");
  } catch {
    s = function(c, d, m) {
      return c[d] = m;
    };
  }
  function l(u, c, d, m) {
    var v = c && c.prototype instanceof p ? c : p, y = Object.create(v.prototype), $ = new Ee(m || []);
    return n(y, "_invoke", {
      value: we(u, d, $)
    }), y;
  }
  function _(u, c, d) {
    try {
      return {
        type: "normal",
        arg: u.call(c, d)
      };
    } catch (m) {
      return {
        type: "throw",
        arg: m
      };
    }
  }
  r.wrap = l;
  var f = {};
  function p() {
  }
  function g() {
  }
  function E() {
  }
  var O = {};
  s(O, i, function() {
    return this;
  });
  var X = Object.getPrototypeOf, j = X && X(X(be([])));
  j && j !== e && t.call(j, i) && (O = j);
  var L = E.prototype = p.prototype = Object.create(O);
  function k(u) {
    ["next", "throw", "return"].forEach(function(c) {
      s(u, c, function(d) {
        return this._invoke(c, d);
      });
    });
  }
  function D(u, c) {
    function d(v, y, $, b) {
      var A = _(u[v], u, y);
      if (A.type !== "throw") {
        var F = A.arg, Q = F.value;
        return Q && typeof Q == "object" && t.call(Q, "__await") ? c.resolve(Q.__await).then(function(U) {
          d("next", U, $, b);
        }, function(U) {
          d("throw", U, $, b);
        }) : c.resolve(Q).then(function(U) {
          F.value = U, $(F);
        }, function(U) {
          return d("throw", U, $, b);
        });
      }
      b(A.arg);
    }
    var m;
    n(this, "_invoke", {
      value: function(v, y) {
        function $() {
          return new c(function(b, A) {
            d(v, y, b, A);
          });
        }
        return m = m ? m.then($, $) : $();
      }
    });
  }
  function we(u, c, d) {
    var m = "suspendedStart";
    return function(v, y) {
      if (m === "executing")
        throw new Error("Generator is already running");
      if (m === "completed") {
        if (v === "throw")
          throw y;
        return Be();
      }
      for (d.method = v, d.arg = y; ; ) {
        var $ = d.delegate;
        if ($) {
          var b = se($, d);
          if (b) {
            if (b === f)
              continue;
            return b;
          }
        }
        if (d.method === "next")
          d.sent = d._sent = d.arg;
        else if (d.method === "throw") {
          if (m === "suspendedStart")
            throw m = "completed", d.arg;
          d.dispatchException(d.arg);
        } else
          d.method === "return" && d.abrupt("return", d.arg);
        m = "executing";
        var A = _(u, c, d);
        if (A.type === "normal") {
          if (m = d.done ? "completed" : "suspendedYield", A.arg === f)
            continue;
          return {
            value: A.arg,
            done: d.done
          };
        }
        A.type === "throw" && (m = "completed", d.method = "throw", d.arg = A.arg);
      }
    };
  }
  function se(u, c) {
    var d = c.method, m = u.iterator[d];
    if (m === void 0)
      return c.delegate = null, d === "throw" && u.iterator.return && (c.method = "return", c.arg = void 0, se(u, c), c.method === "throw") || d !== "return" && (c.method = "throw", c.arg = new TypeError("The iterator does not provide a '" + d + "' method")), f;
    var v = _(m, u.iterator, c.arg);
    if (v.type === "throw")
      return c.method = "throw", c.arg = v.arg, c.delegate = null, f;
    var y = v.arg;
    return y ? y.done ? (c[u.resultName] = y.value, c.next = u.nextLoc, c.method !== "return" && (c.method = "next", c.arg = void 0), c.delegate = null, f) : y : (c.method = "throw", c.arg = new TypeError("iterator result is not an object"), c.delegate = null, f);
  }
  function ae(u) {
    var c = {
      tryLoc: u[0]
    };
    1 in u && (c.catchLoc = u[1]), 2 in u && (c.finallyLoc = u[2], c.afterLoc = u[3]), this.tryEntries.push(c);
  }
  function B(u) {
    var c = u.completion || {};
    c.type = "normal", delete c.arg, u.completion = c;
  }
  function Ee(u) {
    this.tryEntries = [{
      tryLoc: "root"
    }], u.forEach(ae, this), this.reset(!0);
  }
  function be(u) {
    if (u) {
      var c = u[i];
      if (c)
        return c.call(u);
      if (typeof u.next == "function")
        return u;
      if (!isNaN(u.length)) {
        var d = -1, m = function v() {
          for (; ++d < u.length; )
            if (t.call(u, d))
              return v.value = u[d], v.done = !1, v;
          return v.value = void 0, v.done = !0, v;
        };
        return m.next = m;
      }
    }
    return {
      next: Be
    };
  }
  function Be() {
    return {
      value: void 0,
      done: !0
    };
  }
  return g.prototype = E, n(L, "constructor", {
    value: E,
    configurable: !0
  }), n(E, "constructor", {
    value: g,
    configurable: !0
  }), g.displayName = s(E, h, "GeneratorFunction"), r.isGeneratorFunction = function(u) {
    var c = typeof u == "function" && u.constructor;
    return !!c && (c === g || (c.displayName || c.name) === "GeneratorFunction");
  }, r.mark = function(u) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(u, E) : (u.__proto__ = E, s(u, h, "GeneratorFunction")), u.prototype = Object.create(L), u;
  }, r.awrap = function(u) {
    return {
      __await: u
    };
  }, k(D.prototype), s(D.prototype, a, function() {
    return this;
  }), r.AsyncIterator = D, r.async = function(u, c, d, m, v) {
    v === void 0 && (v = Promise);
    var y = new D(l(u, c, d, m), v);
    return r.isGeneratorFunction(c) ? y : y.next().then(function($) {
      return $.done ? $.value : y.next();
    });
  }, k(L), s(L, h, "Generator"), s(L, i, function() {
    return this;
  }), s(L, "toString", function() {
    return "[object Generator]";
  }), r.keys = function(u) {
    var c = Object(u), d = [];
    for (var m in c)
      d.push(m);
    return d.reverse(), function v() {
      for (; d.length; ) {
        var y = d.pop();
        if (y in c)
          return v.value = y, v.done = !1, v;
      }
      return v.done = !0, v;
    };
  }, r.values = be, Ee.prototype = {
    constructor: Ee,
    reset: function(u) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(B), !u)
        for (var c in this)
          c.charAt(0) === "t" && t.call(this, c) && !isNaN(+c.slice(1)) && (this[c] = void 0);
    },
    stop: function() {
      this.done = !0;
      var u = this.tryEntries[0].completion;
      if (u.type === "throw")
        throw u.arg;
      return this.rval;
    },
    dispatchException: function(u) {
      if (this.done)
        throw u;
      var c = this;
      function d(A, F) {
        return y.type = "throw", y.arg = u, c.next = A, F && (c.method = "next", c.arg = void 0), !!F;
      }
      for (var m = this.tryEntries.length - 1; m >= 0; --m) {
        var v = this.tryEntries[m], y = v.completion;
        if (v.tryLoc === "root")
          return d("end");
        if (v.tryLoc <= this.prev) {
          var $ = t.call(v, "catchLoc"), b = t.call(v, "finallyLoc");
          if ($ && b) {
            if (this.prev < v.catchLoc)
              return d(v.catchLoc, !0);
            if (this.prev < v.finallyLoc)
              return d(v.finallyLoc);
          } else if ($) {
            if (this.prev < v.catchLoc)
              return d(v.catchLoc, !0);
          } else {
            if (!b)
              throw new Error("try statement without catch or finally");
            if (this.prev < v.finallyLoc)
              return d(v.finallyLoc);
          }
        }
      }
    },
    abrupt: function(u, c) {
      for (var d = this.tryEntries.length - 1; d >= 0; --d) {
        var m = this.tryEntries[d];
        if (m.tryLoc <= this.prev && t.call(m, "finallyLoc") && this.prev < m.finallyLoc) {
          var v = m;
          break;
        }
      }
      v && (u === "break" || u === "continue") && v.tryLoc <= c && c <= v.finallyLoc && (v = null);
      var y = v ? v.completion : {};
      return y.type = u, y.arg = c, v ? (this.method = "next", this.next = v.finallyLoc, f) : this.complete(y);
    },
    complete: function(u, c) {
      if (u.type === "throw")
        throw u.arg;
      return u.type === "break" || u.type === "continue" ? this.next = u.arg : u.type === "return" ? (this.rval = this.arg = u.arg, this.method = "return", this.next = "end") : u.type === "normal" && c && (this.next = c), f;
    },
    finish: function(u) {
      for (var c = this.tryEntries.length - 1; c >= 0; --c) {
        var d = this.tryEntries[c];
        if (d.finallyLoc === u)
          return this.complete(d.completion, d.afterLoc), B(d), f;
      }
    },
    catch: function(u) {
      for (var c = this.tryEntries.length - 1; c >= 0; --c) {
        var d = this.tryEntries[c];
        if (d.tryLoc === u) {
          var m = d.completion;
          if (m.type === "throw") {
            var v = m.arg;
            B(d);
          }
          return v;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(u, c, d) {
      return this.delegate = {
        iterator: be(u),
        resultName: c,
        nextLoc: d
      }, this.method === "next" && (this.arg = void 0), f;
    }
  }, r;
}
function pt(r, e, t, n, o, i, a) {
  try {
    var h = r[i](a), s = h.value;
  } catch (l) {
    t(l);
    return;
  }
  h.done ? e(s) : Promise.resolve(s).then(n, o);
}
function Ne(r) {
  return function() {
    var e = this, t = arguments;
    return new Promise(function(n, o) {
      var i = r.apply(e, t);
      function a(s) {
        pt(i, n, o, a, h, "next", s);
      }
      function h(s) {
        pt(i, n, o, a, h, "throw", s);
      }
      a(void 0);
    });
  };
}
function kr() {
  var r = new S(document.querySelector("#app"));
  r.setRoutes([
    {
      path: "/",
      component: "my-home",
      action: function() {
        var e = Ne(/* @__PURE__ */ H().mark(function n() {
          return H().wrap(function(i) {
            for (; ; )
              switch (i.prev = i.next) {
                case 0:
                  return i.next = 2, import("./my-home-cb280be4.js");
                case 2:
                  return i.abrupt("return", i.sent);
                case 3:
                case "end":
                  return i.stop();
              }
          }, n);
        }));
        function t() {
          return e.apply(this, arguments);
        }
        return t;
      }()
    },
    {
      path: "/login",
      component: "my-login",
      action: function() {
        var e = Ne(/* @__PURE__ */ H().mark(function n() {
          return H().wrap(function(i) {
            for (; ; )
              switch (i.prev = i.next) {
                case 0:
                  return i.next = 2, import("./my-login-fc4e5a25.js");
                case 2:
                  return i.abrupt("return", i.sent);
                case 3:
                case "end":
                  return i.stop();
              }
          }, n);
        }));
        function t() {
          return e.apply(this, arguments);
        }
        return t;
      }()
    },
    {
      path: "/notify",
      component: "my-notify",
      action: function() {
        var e = Ne(/* @__PURE__ */ H().mark(function n() {
          return H().wrap(function(i) {
            for (; ; )
              switch (i.prev = i.next) {
                case 0:
                  return i.next = 2, import("./my-notify-fc7c0027.js");
                case 2:
                  return i.abrupt("return", i.sent);
                case 3:
                case "end":
                  return i.stop();
              }
          }, n);
        }));
        function t() {
          return e.apply(this, arguments);
        }
        return t;
      }()
    },
    {
      path: "(.*)",
      redirect: "/"
    }
    // 萬用路由
  ]);
}
window.addEventListener("DOMContentLoaded", function() {
  kr();
});
export {
  S as R,
  Ur as a,
  Hr as e,
  mr as i,
  ee as s,
  Ar as x
};
