import { css as Ee, LitElement as Re, html as Le } from "lit";
import { property as Pe, customElement as Ae } from "lit/decorators.js";
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]'))
    i(o);
  new MutationObserver((o) => {
    for (const r of o)
      if (r.type === "childList")
        for (const s of r.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && i(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(o) {
    const r = {};
    return o.integrity && (r.integrity = o.integrity), o.referrerPolicy && (r.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? r.credentials = "include" : o.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
  }
  function i(o) {
    if (o.ep)
      return;
    o.ep = !0;
    const r = t(o);
    fetch(o.href, r);
  }
})();
function C(n) {
  return n = n || [], Array.isArray(n) ? n : [n];
}
function m(n) {
  return `[Vaadin.Router] ${n}`;
}
function Oe(n) {
  if (typeof n != "object")
    return String(n);
  const e = Object.prototype.toString.call(n).match(/ (.*)\]$/)[1];
  return e === "Object" || e === "Array" ? `${e} ${JSON.stringify(n)}` : e;
}
const T = "module", I = "nomodule", F = [T, I];
function K(n) {
  if (!n.match(/.+\.[m]?js$/))
    throw new Error(
      m(`Unsupported type for bundle "${n}": .js or .mjs expected.`)
    );
}
function re(n) {
  if (!n || !g(n.path))
    throw new Error(
      m('Expected route config to be an object with a "path" string property, or an array of such objects')
    );
  const e = n.bundle, t = ["component", "redirect", "bundle"];
  if (!y(n.action) && !Array.isArray(n.children) && !y(n.children) && !M(e) && !t.some((i) => g(n[i])))
    throw new Error(
      m(
        `Expected route config "${n.path}" to include either "${t.join('", "')}" or "action" function but none found.`
      )
    );
  if (e)
    if (g(e))
      K(e);
    else if (F.some((i) => i in e))
      F.forEach((i) => i in e && K(e[i]));
    else
      throw new Error(
        m('Expected route bundle to include either "' + I + '" or "' + T + '" keys, or both')
      );
  n.redirect && ["bundle", "component"].forEach((i) => {
    i in n && console.warn(
      m(
        `Route config "${n.path}" has both "redirect" and "${i}" properties, and "redirect" will always override the latter. Did you mean to only use "${i}"?`
      )
    );
  });
}
function G(n) {
  C(n).forEach((e) => re(e));
}
function q(n, e) {
  let t = document.head.querySelector('script[src="' + n + '"][async]');
  return t || (t = document.createElement("script"), t.setAttribute("src", n), e === T ? t.setAttribute("type", T) : e === I && t.setAttribute(I, ""), t.async = !0), new Promise((i, o) => {
    t.onreadystatechange = t.onload = (r) => {
      t.__dynamicImportLoaded = !0, i(r);
    }, t.onerror = (r) => {
      t.parentNode && t.parentNode.removeChild(t), o(r);
    }, t.parentNode === null ? document.head.appendChild(t) : t.__dynamicImportLoaded && i();
  });
}
function $e(n) {
  return g(n) ? q(n) : Promise.race(
    F.filter((e) => e in n).map((e) => q(n[e], e))
  );
}
function E(n, e) {
  return !window.dispatchEvent(new CustomEvent(
    `vaadin-router-${n}`,
    { cancelable: n === "go", detail: e }
  ));
}
function M(n) {
  return typeof n == "object" && !!n;
}
function y(n) {
  return typeof n == "function";
}
function g(n) {
  return typeof n == "string";
}
function ie(n) {
  const e = new Error(m(`Page not found (${n.pathname})`));
  return e.context = n, e.code = 404, e;
}
const w = new class {
}();
function Ce(n) {
  const e = n.port, t = n.protocol, r = t === "http:" && e === "80" || t === "https:" && e === "443" ? n.hostname : n.host;
  return `${t}//${r}`;
}
function k(n) {
  if (n.defaultPrevented || n.button !== 0 || n.shiftKey || n.ctrlKey || n.altKey || n.metaKey)
    return;
  let e = n.target;
  const t = n.composedPath ? n.composedPath() : n.path || [];
  for (let l = 0; l < t.length; l++) {
    const a = t[l];
    if (a.nodeName && a.nodeName.toLowerCase() === "a") {
      e = a;
      break;
    }
  }
  for (; e && e.nodeName.toLowerCase() !== "a"; )
    e = e.parentNode;
  if (!e || e.nodeName.toLowerCase() !== "a" || e.target && e.target.toLowerCase() !== "_self" || e.hasAttribute("download") || e.hasAttribute("router-ignore") || e.pathname === window.location.pathname && e.hash !== "" || (e.origin || Ce(e)) !== window.location.origin)
    return;
  const { pathname: o, search: r, hash: s } = e;
  E("go", { pathname: o, search: r, hash: s }) && (n.preventDefault(), n && n.type === "click" && window.scrollTo(0, 0));
}
const Te = {
  activate() {
    window.document.addEventListener("click", k);
  },
  inactivate() {
    window.document.removeEventListener("click", k);
  }
}, Ie = /Trident/.test(navigator.userAgent);
Ie && !y(window.PopStateEvent) && (window.PopStateEvent = function(n, e) {
  e = e || {};
  var t = document.createEvent("Event");
  return t.initEvent(n, !!e.bubbles, !!e.cancelable), t.state = e.state || null, t;
}, window.PopStateEvent.prototype = window.Event.prototype);
function W(n) {
  if (n.state === "vaadin-router-ignore")
    return;
  const { pathname: e, search: t, hash: i } = window.location;
  E("go", { pathname: e, search: t, hash: i });
}
const Me = {
  activate() {
    window.addEventListener("popstate", W);
  },
  inactivate() {
    window.removeEventListener("popstate", W);
  }
};
var b = ue, Ue = B, Ne = Be, je = se, Fe = le, oe = "/", ae = "./", De = new RegExp([
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
function B(n, e) {
  for (var t = [], i = 0, o = 0, r = "", s = e && e.delimiter || oe, l = e && e.delimiters || ae, a = !1, c; (c = De.exec(n)) !== null; ) {
    var h = c[0], d = c[1], u = c.index;
    if (r += n.slice(o, u), o = u + h.length, d) {
      r += d[1], a = !0;
      continue;
    }
    var f = "", S = n[o], ge = c[2], me = c[3], ve = c[4], L = c[5];
    if (!a && r.length) {
      var N = r.length - 1;
      l.indexOf(r[N]) > -1 && (f = r[N], r = r.slice(0, N));
    }
    r && (t.push(r), r = "", a = !1);
    var ye = f !== "" && S !== void 0 && S !== f, we = L === "+" || L === "*", be = L === "?" || L === "*", H = f || s, V = me || ve;
    t.push({
      name: ge || i++,
      prefix: f,
      delimiter: H,
      optional: be,
      repeat: we,
      partial: ye,
      pattern: V ? Se(V) : "[^" + v(H) + "]+?"
    });
  }
  return (r || o < n.length) && t.push(r + n.substr(o)), t;
}
function Be(n, e) {
  return se(B(n, e));
}
function se(n) {
  for (var e = new Array(n.length), t = 0; t < n.length; t++)
    typeof n[t] == "object" && (e[t] = new RegExp("^(?:" + n[t].pattern + ")$"));
  return function(i, o) {
    for (var r = "", s = o && o.encode || encodeURIComponent, l = 0; l < n.length; l++) {
      var a = n[l];
      if (typeof a == "string") {
        r += a;
        continue;
      }
      var c = i ? i[a.name] : void 0, h;
      if (Array.isArray(c)) {
        if (!a.repeat)
          throw new TypeError('Expected "' + a.name + '" to not repeat, but got array');
        if (c.length === 0) {
          if (a.optional)
            continue;
          throw new TypeError('Expected "' + a.name + '" to not be empty');
        }
        for (var d = 0; d < c.length; d++) {
          if (h = s(c[d], a), !e[l].test(h))
            throw new TypeError('Expected all "' + a.name + '" to match "' + a.pattern + '"');
          r += (d === 0 ? a.prefix : a.delimiter) + h;
        }
        continue;
      }
      if (typeof c == "string" || typeof c == "number" || typeof c == "boolean") {
        if (h = s(String(c), a), !e[l].test(h))
          throw new TypeError('Expected "' + a.name + '" to match "' + a.pattern + '", but got "' + h + '"');
        r += a.prefix + h;
        continue;
      }
      if (a.optional) {
        a.partial && (r += a.prefix);
        continue;
      }
      throw new TypeError('Expected "' + a.name + '" to be ' + (a.repeat ? "an array" : "a string"));
    }
    return r;
  };
}
function v(n) {
  return n.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function Se(n) {
  return n.replace(/([=!:$/()])/g, "\\$1");
}
function ce(n) {
  return n && n.sensitive ? "" : "i";
}
function He(n, e) {
  if (!e)
    return n;
  var t = n.source.match(/\((?!\?)/g);
  if (t)
    for (var i = 0; i < t.length; i++)
      e.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: !1,
        repeat: !1,
        partial: !1,
        pattern: null
      });
  return n;
}
function Ve(n, e, t) {
  for (var i = [], o = 0; o < n.length; o++)
    i.push(ue(n[o], e, t).source);
  return new RegExp("(?:" + i.join("|") + ")", ce(t));
}
function Ke(n, e, t) {
  return le(B(n, t), e, t);
}
function le(n, e, t) {
  t = t || {};
  for (var i = t.strict, o = t.start !== !1, r = t.end !== !1, s = v(t.delimiter || oe), l = t.delimiters || ae, a = [].concat(t.endsWith || []).map(v).concat("$").join("|"), c = o ? "^" : "", h = n.length === 0, d = 0; d < n.length; d++) {
    var u = n[d];
    if (typeof u == "string")
      c += v(u), h = d === n.length - 1 && l.indexOf(u[u.length - 1]) > -1;
    else {
      var f = u.repeat ? "(?:" + u.pattern + ")(?:" + v(u.delimiter) + "(?:" + u.pattern + "))*" : u.pattern;
      e && e.push(u), u.optional ? u.partial ? c += v(u.prefix) + "(" + f + ")?" : c += "(?:" + v(u.prefix) + "(" + f + "))?" : c += v(u.prefix) + "(" + f + ")";
    }
  }
  return r ? (i || (c += "(?:" + s + ")?"), c += a === "$" ? "$" : "(?=" + a + ")") : (i || (c += "(?:" + s + "(?=" + a + "))?"), h || (c += "(?=" + s + "|" + a + ")")), new RegExp(c, ce(t));
}
function ue(n, e, t) {
  return n instanceof RegExp ? He(n, e) : Array.isArray(n) ? Ve(
    /** @type {!Array} */
    n,
    e,
    t
  ) : Ke(
    /** @type {string} */
    n,
    e,
    t
  );
}
b.parse = Ue;
b.compile = Ne;
b.tokensToFunction = je;
b.tokensToRegExp = Fe;
const { hasOwnProperty: Ge } = Object.prototype, D = /* @__PURE__ */ new Map();
D.set("|false", {
  keys: [],
  pattern: /(?:)/
});
function z(n) {
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}
function qe(n, e, t, i, o) {
  t = !!t;
  const r = `${n}|${t}`;
  let s = D.get(r);
  if (!s) {
    const c = [];
    s = {
      keys: c,
      pattern: b(n, c, {
        end: t,
        strict: n === ""
      })
    }, D.set(r, s);
  }
  const l = s.pattern.exec(e);
  if (!l)
    return null;
  const a = Object.assign({}, o);
  for (let c = 1; c < l.length; c++) {
    const h = s.keys[c - 1], d = h.name, u = l[c];
    (u !== void 0 || !Ge.call(a, d)) && (h.repeat ? a[d] = u ? u.split(h.delimiter).map(z) : [] : a[d] = u && z(u));
  }
  return {
    path: l[0],
    keys: (i || []).concat(s.keys),
    params: a
  };
}
function he(n, e, t, i, o) {
  let r, s, l = 0, a = n.path || "";
  return a.charAt(0) === "/" && (t && (a = a.substr(1)), t = !0), {
    next(c) {
      if (n === c)
        return { done: !0 };
      const h = n.__children = n.__children || n.children;
      if (!r && (r = qe(a, e, !h, i, o), r))
        return {
          done: !1,
          value: {
            route: n,
            keys: r.keys,
            params: r.params,
            path: r.path
          }
        };
      if (r && h)
        for (; l < h.length; ) {
          if (!s) {
            const u = h[l];
            u.parent = n;
            let f = r.path.length;
            f > 0 && e.charAt(f) === "/" && (f += 1), s = he(
              u,
              e.substr(f),
              t,
              r.keys,
              r.params
            );
          }
          const d = s.next(c);
          if (!d.done)
            return {
              done: !1,
              value: d.value
            };
          s = null, l++;
        }
      return { done: !0 };
    }
  };
}
function ke(n) {
  if (y(n.route.action))
    return n.route.action(n);
}
function We(n, e) {
  let t = e;
  for (; t; )
    if (t = t.parent, t === n)
      return !0;
  return !1;
}
function ze(n) {
  let e = `Path '${n.pathname}' is not properly resolved due to an error.`;
  const t = (n.route || {}).path;
  return t && (e += ` Resolution had failed on route: '${t}'`), e;
}
function Xe(n, e) {
  const { route: t, path: i } = e;
  if (t && !t.__synthetic) {
    const o = { path: i, route: t };
    if (!n.chain)
      n.chain = [];
    else if (t.parent) {
      let r = n.chain.length;
      for (; r-- && n.chain[r].route && n.chain[r].route !== t.parent; )
        n.chain.pop();
    }
    n.chain.push(o);
  }
}
class R {
  constructor(e, t = {}) {
    if (Object(e) !== e)
      throw new TypeError("Invalid routes");
    this.baseUrl = t.baseUrl || "", this.errorHandler = t.errorHandler, this.resolveRoute = t.resolveRoute || ke, this.context = Object.assign({ resolver: this }, t.context), this.root = Array.isArray(e) ? { path: "", __children: e, parent: null, __synthetic: !0 } : e, this.root.parent = null;
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
    G(e);
    const t = [...C(e)];
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
    return G(e), this.root.__children.push(...C(e)), this.getRoutes();
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
      g(e) ? { pathname: e } : e
    ), i = he(
      this.root,
      this.__normalizePathname(t.pathname),
      this.baseUrl
    ), o = this.resolveRoute;
    let r = null, s = null, l = t;
    function a(c, h = r.value.route, d) {
      const u = d === null && r.value.route;
      return r = s || i.next(u), s = null, !c && (r.done || !We(h, r.value.route)) ? (s = r, Promise.resolve(w)) : r.done ? Promise.reject(ie(t)) : (l = Object.assign(
        l ? { chain: l.chain ? l.chain.slice(0) : [] } : {},
        t,
        r.value
      ), Xe(l, r.value), Promise.resolve(o(l)).then((f) => f != null && f !== w ? (l.result = f.result || f, l) : a(c, h, f)));
    }
    return t.next = a, Promise.resolve().then(() => a(!0, this.root)).catch((c) => {
      const h = ze(l);
      if (c ? console.warn(h) : c = new Error(h), c.context = c.context || l, c instanceof DOMException || (c.code = c.code || 500), this.errorHandler)
        return l.result = this.errorHandler(c), l;
      throw c;
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
    const t = this.__effectiveBaseUrl, i = this.constructor.__createUrl(e, t).href;
    if (i.slice(0, t.length) === t)
      return i.slice(t.length);
  }
}
R.pathToRegexp = b;
const { pathToRegexp: X } = R, Q = /* @__PURE__ */ new Map();
function de(n, e, t) {
  const i = e.name || e.component;
  if (i && (n.has(i) ? n.get(i).push(e) : n.set(i, [e])), Array.isArray(t))
    for (let o = 0; o < t.length; o++) {
      const r = t[o];
      r.parent = e, de(n, r, r.__children || r.children);
    }
}
function J(n, e) {
  const t = n.get(e);
  if (t && t.length > 1)
    throw new Error(
      `Duplicate route with name "${e}". Try seting unique 'name' route properties.`
    );
  return t && t[0];
}
function Y(n) {
  let e = n.path;
  return e = Array.isArray(e) ? e[0] : e, e !== void 0 ? e : "";
}
function Qe(n, e = {}) {
  if (!(n instanceof R))
    throw new TypeError("An instance of Resolver is expected");
  const t = /* @__PURE__ */ new Map();
  return (i, o) => {
    let r = J(t, i);
    if (!r && (t.clear(), de(t, n.root, n.root.__children), r = J(t, i), !r))
      throw new Error(`Route "${i}" not found`);
    let s = Q.get(r.fullPath);
    if (!s) {
      let a = Y(r), c = r.parent;
      for (; c; ) {
        const f = Y(c);
        f && (a = f.replace(/\/$/, "") + "/" + a.replace(/^\//, "")), c = c.parent;
      }
      const h = X.parse(a), d = X.tokensToFunction(h), u = /* @__PURE__ */ Object.create(null);
      for (let f = 0; f < h.length; f++)
        g(h[f]) || (u[h[f].name] = !0);
      s = { toPath: d, keys: u }, Q.set(a, s), r.fullPath = a;
    }
    let l = s.toPath(o, e) || "/";
    if (e.stringifyQueryParams && o) {
      const a = {}, c = Object.keys(o);
      for (let d = 0; d < c.length; d++) {
        const u = c[d];
        s.keys[u] || (a[u] = o[u]);
      }
      const h = e.stringifyQueryParams(a);
      h && (l += h.charAt(0) === "?" ? h : `?${h}`);
    }
    return l;
  };
}
let Z = [];
function Je(n) {
  Z.forEach((e) => e.inactivate()), n.forEach((e) => e.activate()), Z = n;
}
const Ye = (n) => {
  const e = getComputedStyle(n).getPropertyValue("animation-name");
  return e && e !== "none";
}, Ze = (n, e) => {
  const t = () => {
    n.removeEventListener("animationend", t), e();
  };
  n.addEventListener("animationend", t);
};
function x(n, e) {
  return n.classList.add(e), new Promise((t) => {
    if (Ye(n)) {
      const i = n.getBoundingClientRect(), o = `height: ${i.bottom - i.top}px; width: ${i.right - i.left}px`;
      n.setAttribute("style", `position: absolute; ${o}`), Ze(n, () => {
        n.classList.remove(e), n.removeAttribute("style"), t();
      });
    } else
      n.classList.remove(e), t();
  });
}
const xe = 256;
function j(n) {
  return n != null;
}
function et(n) {
  const e = Object.assign({}, n);
  return delete e.next, e;
}
function _({ pathname: n = "", search: e = "", hash: t = "", chain: i = [], params: o = {}, redirectFrom: r, resolver: s }, l) {
  const a = i.map((c) => c.route);
  return {
    baseUrl: s && s.baseUrl || "",
    pathname: n,
    search: e,
    hash: t,
    routes: a,
    route: l || a.length && a[a.length - 1] || null,
    params: o,
    redirectFrom: r,
    getUrl: (c = {}) => O(
      p.pathToRegexp.compile(
        fe(a)
      )(Object.assign({}, o, c)),
      s
    )
  };
}
function ee(n, e) {
  const t = Object.assign({}, n.params);
  return {
    redirect: {
      pathname: e,
      from: n.pathname,
      params: t
    }
  };
}
function tt(n, e) {
  e.location = _(n);
  const t = n.chain.map((i) => i.route).indexOf(n.route);
  return n.chain[t].element = e, e;
}
function A(n, e, t) {
  if (y(n))
    return n.apply(t, e);
}
function te(n, e, t) {
  return (i) => {
    if (i && (i.cancel || i.redirect))
      return i;
    if (t)
      return A(t[n], e, t);
  };
}
function nt(n, e) {
  if (!Array.isArray(n) && !M(n))
    throw new Error(
      m(
        `Incorrect "children" value for the route ${e.path}: expected array or object, but got ${n}`
      )
    );
  e.__children = [];
  const t = C(n);
  for (let i = 0; i < t.length; i++)
    re(t[i]), e.__children.push(t[i]);
}
function P(n) {
  if (n && n.length) {
    const e = n[0].parentNode;
    for (let t = 0; t < n.length; t++)
      e.removeChild(n[t]);
  }
}
function O(n, e) {
  const t = e.__effectiveBaseUrl;
  return t ? e.constructor.__createUrl(n.replace(/^\//, ""), t).pathname : n;
}
function fe(n) {
  return n.map((e) => e.path).reduce((e, t) => t.length ? e.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : e, "");
}
class p extends R {
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
    const i = document.head.querySelector("base"), o = i && i.getAttribute("href");
    super([], Object.assign({
      // Default options
      baseUrl: o && R.__createUrl(o, document.URL).pathname.replace(/[^\/]*$/, "")
    }, t)), this.resolveRoute = (s) => this.__resolveRoute(s);
    const r = p.NavigationTrigger;
    p.setTriggers.apply(p, Object.keys(r).map((s) => r[s])), this.baseUrl, this.ready, this.ready = Promise.resolve(e), this.location, this.location = _({ resolver: this }), this.__lastStartedRenderId = 0, this.__navigationEventHandler = this.__onNavigationEvent.bind(this), this.setOutlet(e), this.subscribe(), this.__createdByRouter = /* @__PURE__ */ new WeakMap(), this.__addedByRouter = /* @__PURE__ */ new WeakMap();
  }
  __resolveRoute(e) {
    const t = e.route;
    let i = Promise.resolve();
    y(t.children) && (i = i.then(() => t.children(et(e))).then((r) => {
      !j(r) && !y(t.children) && (r = t.children), nt(r, t);
    }));
    const o = {
      redirect: (r) => ee(e, r),
      component: (r) => {
        const s = document.createElement(r);
        return this.__createdByRouter.set(s, !0), s;
      }
    };
    return i.then(() => {
      if (this.__isLatestRender(e))
        return A(t.action, [e, o], t);
    }).then((r) => {
      if (j(r) && (r instanceof HTMLElement || r.redirect || r === w))
        return r;
      if (g(t.redirect))
        return o.redirect(t.redirect);
      if (t.bundle)
        return $e(t.bundle).then(() => {
        }, () => {
          throw new Error(m(`Bundle not found: ${t.bundle}. Check if the file name is correct`));
        });
    }).then((r) => {
      if (j(r))
        return r;
      if (g(t.component))
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
    const i = ++this.__lastStartedRenderId, o = Object.assign(
      {
        search: "",
        hash: ""
      },
      g(e) ? { pathname: e } : e,
      {
        __renderId: i
      }
    );
    return this.ready = this.resolve(o).then((r) => this.__fullyResolveChain(r)).then((r) => {
      if (this.__isLatestRender(r)) {
        const s = this.__previousContext;
        if (r === s)
          return this.__updateBrowserHistory(s, !0), this.location;
        if (this.location = _(r), t && this.__updateBrowserHistory(r, i === 1), E("location-changed", { router: this, location: this.location }), r.__skipAttach)
          return this.__copyUnchangedElements(r, s), this.__previousContext = r, this.location;
        this.__addAppearingContent(r, s);
        const l = this.__animateIfNeeded(r);
        return this.__runOnAfterEnterCallbacks(r), this.__runOnAfterLeaveCallbacks(r, s), l.then(() => {
          if (this.__isLatestRender(r))
            return this.__removeDisappearingContent(), this.__previousContext = r, this.location;
        });
      }
    }).catch((r) => {
      if (i === this.__lastStartedRenderId)
        throw t && this.__updateBrowserHistory(o), P(this.__outlet && this.__outlet.children), this.location = _(Object.assign(o, { resolver: this })), E("error", Object.assign({ router: this, error: r }, o)), r;
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
    return this.__findComponentContextAfterAllRedirects(t).then((i) => {
      const r = i !== t ? i : e, l = O(
        fe(i.chain),
        i.resolver
      ) === i.pathname, a = (c, h = c.route, d) => c.next(void 0, h, d).then((u) => u === null || u === w ? l ? c : h.parent !== null ? a(c, h.parent, u) : u : u);
      return a(i).then((c) => {
        if (c === null || c === w)
          throw ie(r);
        return c && c !== w && c !== i ? this.__fullyResolveChain(r, c) : this.__amendWithOnBeforeCallbacks(i);
      });
    });
  }
  __findComponentContextAfterAllRedirects(e) {
    const t = e.result;
    return t instanceof HTMLElement ? (tt(e, t), Promise.resolve(e)) : t.redirect ? this.__redirect(t.redirect, e.__redirectCount, e.__renderId).then((i) => this.__findComponentContextAfterAllRedirects(i)) : t instanceof Error ? Promise.reject(t) : Promise.reject(
      new Error(
        m(
          `Invalid route resolution result for path "${e.pathname}". Expected redirect object or HTML element, but got: "${Oe(t)}". Double check the action return value for the route.`
        )
      )
    );
  }
  __amendWithOnBeforeCallbacks(e) {
    return this.__runOnBeforeCallbacks(e).then((t) => t === this.__previousContext || t === e ? t : this.__fullyResolveChain(t));
  }
  __runOnBeforeCallbacks(e) {
    const t = this.__previousContext || {}, i = t.chain || [], o = e.chain;
    let r = Promise.resolve();
    const s = () => ({ cancel: !0 }), l = (a) => ee(e, a);
    if (e.__divergedChainIndex = 0, e.__skipAttach = !1, i.length) {
      for (let a = 0; a < Math.min(i.length, o.length) && !(i[a].route !== o[a].route || i[a].path !== o[a].path && i[a].element !== o[a].element || !this.__isReusableElement(i[a].element, o[a].element)); a = ++e.__divergedChainIndex)
        ;
      if (e.__skipAttach = // Same route chain
      o.length === i.length && e.__divergedChainIndex == o.length && // Same element
      this.__isReusableElement(e.result, t.result), e.__skipAttach) {
        for (let a = o.length - 1; a >= 0; a--)
          r = this.__runOnBeforeLeaveCallbacks(r, e, { prevent: s }, i[a]);
        for (let a = 0; a < o.length; a++)
          r = this.__runOnBeforeEnterCallbacks(r, e, { prevent: s, redirect: l }, o[a]), i[a].element.location = _(e, i[a].route);
      } else
        for (let a = i.length - 1; a >= e.__divergedChainIndex; a--)
          r = this.__runOnBeforeLeaveCallbacks(r, e, { prevent: s }, i[a]);
    }
    if (!e.__skipAttach)
      for (let a = 0; a < o.length; a++)
        a < e.__divergedChainIndex ? a < i.length && i[a].element && (i[a].element.location = _(e, i[a].route)) : (r = this.__runOnBeforeEnterCallbacks(r, e, { prevent: s, redirect: l }, o[a]), o[a].element && (o[a].element.location = _(e, o[a].route)));
    return r.then((a) => {
      if (a) {
        if (a.cancel)
          return this.__previousContext.__renderId = e.__renderId, this.__previousContext;
        if (a.redirect)
          return this.__redirect(a.redirect, e.__redirectCount, e.__renderId);
      }
      return e;
    });
  }
  __runOnBeforeLeaveCallbacks(e, t, i, o) {
    const r = _(t);
    return e.then((s) => {
      if (this.__isLatestRender(t))
        return te("onBeforeLeave", [r, i, this], o.element)(s);
    }).then((s) => {
      if (!(s || {}).redirect)
        return s;
    });
  }
  __runOnBeforeEnterCallbacks(e, t, i, o) {
    const r = _(t, o.route);
    return e.then((s) => {
      if (this.__isLatestRender(t))
        return te("onBeforeEnter", [r, i, this], o.element)(s);
    });
  }
  __isReusableElement(e, t) {
    return e && t ? this.__createdByRouter.get(e) && this.__createdByRouter.get(t) ? e.localName === t.localName : e === t : !1;
  }
  __isLatestRender(e) {
    return e.__renderId === this.__lastStartedRenderId;
  }
  __redirect(e, t, i) {
    if (t > xe)
      throw new Error(m(`Too many redirects when rendering ${e.from}`));
    return this.resolve({
      pathname: this.urlForPath(
        e.pathname,
        e.params
      ),
      redirectFrom: e.from,
      __redirectCount: (t || 0) + 1,
      __renderId: i
    });
  }
  __ensureOutlet(e = this.__outlet) {
    if (!(e instanceof Node))
      throw new TypeError(m(`Expected router outlet to be a valid DOM Node (but got ${e})`));
  }
  __updateBrowserHistory({ pathname: e, search: t = "", hash: i = "" }, o) {
    if (window.location.pathname !== e || window.location.search !== t || window.location.hash !== i) {
      const r = o ? "replaceState" : "pushState";
      window.history[r](null, document.title, e + t + i), window.dispatchEvent(new PopStateEvent("popstate", { state: "vaadin-router-ignore" }));
    }
  }
  __copyUnchangedElements(e, t) {
    let i = this.__outlet;
    for (let o = 0; o < e.__divergedChainIndex; o++) {
      const r = t && t.chain[o].element;
      if (r)
        if (r.parentNode === i)
          e.chain[o].element = r, i = r;
        else
          break;
    }
    return i;
  }
  __addAppearingContent(e, t) {
    this.__ensureOutlet(), this.__removeAppearingContent();
    const i = this.__copyUnchangedElements(e, t);
    this.__appearingContent = [], this.__disappearingContent = Array.from(i.children).filter(
      // Only remove layout content that was added by router
      (r) => this.__addedByRouter.get(r) && // Do not remove the result element to avoid flickering
      r !== e.result
    );
    let o = i;
    for (let r = e.__divergedChainIndex; r < e.chain.length; r++) {
      const s = e.chain[r].element;
      s && (o.appendChild(s), this.__addedByRouter.set(s, !0), o === i && this.__appearingContent.push(s), o = s);
    }
  }
  __removeDisappearingContent() {
    this.__disappearingContent && P(this.__disappearingContent), this.__disappearingContent = null, this.__appearingContent = null;
  }
  __removeAppearingContent() {
    this.__disappearingContent && this.__appearingContent && (P(this.__appearingContent), this.__disappearingContent = null, this.__appearingContent = null);
  }
  __runOnAfterLeaveCallbacks(e, t) {
    if (t)
      for (let i = t.chain.length - 1; i >= e.__divergedChainIndex && this.__isLatestRender(e); i--) {
        const o = t.chain[i].element;
        if (o)
          try {
            const r = _(e);
            A(
              o.onAfterLeave,
              [r, {}, t.resolver],
              o
            );
          } finally {
            this.__disappearingContent.indexOf(o) > -1 && P(o.children);
          }
      }
  }
  __runOnAfterEnterCallbacks(e) {
    for (let t = e.__divergedChainIndex; t < e.chain.length && this.__isLatestRender(e); t++) {
      const i = e.chain[t].element || {}, o = _(e, e.chain[t].route);
      A(
        i.onAfterEnter,
        [o, {}, e.resolver],
        i
      );
    }
  }
  __animateIfNeeded(e) {
    const t = (this.__disappearingContent || [])[0], i = (this.__appearingContent || [])[0], o = [], r = e.chain;
    let s;
    for (let l = r.length; l > 0; l--)
      if (r[l - 1].route.animate) {
        s = r[l - 1].route.animate;
        break;
      }
    if (t && i && s) {
      const l = M(s) && s.leave || "leaving", a = M(s) && s.enter || "entering";
      o.push(x(t, l)), o.push(x(i, a));
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
    const { pathname: t, search: i, hash: o } = e ? e.detail : window.location;
    g(this.__normalizePathname(t)) && (e && e.preventDefault && e.preventDefault(), this.render({ pathname: t, search: i, hash: o }, !0));
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
    Je(e);
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
    return this.__urlForName || (this.__urlForName = Qe(this)), O(
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
    return O(
      p.pathToRegexp.compile(e)(t),
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
    const { pathname: t, search: i, hash: o } = g(e) ? this.__createUrl(e, "http://a") : e;
    return E("go", { pathname: t, search: i, hash: o });
  }
}
const rt = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i, $ = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;
function it() {
  function n() {
    return !0;
  }
  return pe(n);
}
function ot() {
  try {
    return at() ? !0 : st() ? $ ? !ct() : !it() : !1;
  } catch {
    return !1;
  }
}
function at() {
  return localStorage.getItem("vaadin.developmentmode.force");
}
function st() {
  return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
}
function ct() {
  return !!($ && Object.keys($).map((e) => $[e]).filter((e) => e.productionMode).length > 0);
}
function pe(n, e) {
  if (typeof n != "function")
    return;
  const t = rt.exec(n.toString());
  if (t)
    try {
      n = new Function(t[1]);
    } catch (i) {
      console.log("vaadin-development-mode-detector: uncommentAndRun() failed", i);
    }
  return n(e);
}
window.Vaadin = window.Vaadin || {};
const ne = function(n, e) {
  if (window.Vaadin.developmentMode)
    return pe(n, e);
};
window.Vaadin.developmentMode === void 0 && (window.Vaadin.developmentMode = ot());
function lt() {
}
const ut = function() {
  if (typeof ne == "function")
    return ne(lt);
};
window.Vaadin = window.Vaadin || {};
window.Vaadin.registrations = window.Vaadin.registrations || [];
window.Vaadin.registrations.push({
  is: "@vaadin/router",
  version: "1.7.4"
});
ut();
p.NavigationTrigger = { POPSTATE: Me, CLICK: Te };
var ht = Object.defineProperty, dt = Object.getOwnPropertyDescriptor, _e = (n, e, t, i) => {
  for (var o = i > 1 ? void 0 : i ? dt(e, t) : e, r = n.length - 1, s; r >= 0; r--)
    (s = n[r]) && (o = (i ? s(e, t, o) : s(o)) || o);
  return i && o && ht(e, t, o), o;
};
let U = class extends Re {
  constructor() {
    super(), this.isLogin = !1, fetch("http://localhost:5000/api/Users/VerifyLogin", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((n) => {
      n.status == 200 || n.status == 204 ? this.isLogin = !0 : this.isLogin = !1;
      const e = {
        detail: { isLogin: this.isLogin },
        bubbles: !0,
        composed: !0
      };
      this.dispatchEvent(new CustomEvent("isLogin", e));
    });
  }
  async connectedCallback() {
    super.connectedCallback(), document.addEventListener("isLogin", (n) => {
      this.isLogin = n.detail.isLogin;
    });
  }
  render() {
    return Le`
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
    }), this.isLogin = !1, window.alert("登出成功!"), p.go("/login");
  }
  _goHome(n) {
    n.preventDefault(), p.go("/");
  }
  _goNotify(n) {
    n.preventDefault(), p.go("/notify");
  }
  _goLogin(n) {
    n.preventDefault(), p.go("/login");
  }
};
U.styles = Ee`
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
_e([
  Pe()
], U.prototype, "isLogin", 2);
U = _e([
  Ae("my-header")
], U);
function ft() {
  new p(document.querySelector("#app")).setRoutes([
    {
      path: "/",
      component: "my-home",
      action: async () => await import("./my-home-c5131640.js")
    },
    {
      path: "/login",
      component: "my-login",
      action: async () => await import("./my-login-633a8fc6.js")
    },
    {
      path: "/notify",
      component: "my-notify",
      action: async () => await import("./my-notify-91a78366.js")
    },
    { path: "(.*)", redirect: "/" }
    // 萬用路由
  ]);
}
window.addEventListener("DOMContentLoaded", () => {
  ft();
});
export {
  p as R
};
