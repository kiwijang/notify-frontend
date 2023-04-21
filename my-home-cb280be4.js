import { s as u, R as d, x as h, i as f, e as l, a as m } from "./index-df9efada.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const g = ({ finisher: t, descriptor: e }) => (s, n) => {
  var o;
  if (n === void 0) {
    const i = (o = s.originalKey) !== null && o !== void 0 ? o : s.key, r = e != null ? { kind: "method", placement: "prototype", key: i, descriptor: e(s.key) } : { ...s, key: i };
    return t != null && (r.finisher = function(p) {
      t(p, i);
    }), r;
  }
  {
    const i = s.constructor;
    e !== void 0 && Object.defineProperty(s, n, e(n)), t == null || t(i, n);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t, e) {
  return g({ descriptor: (s) => {
    const n = { get() {
      var o, i;
      return (i = (o = this.renderRoot) === null || o === void 0 ? void 0 : o.querySelector(t)) !== null && i !== void 0 ? i : null;
    }, enumerable: !0, configurable: !0 };
    if (e) {
      const o = typeof s == "symbol" ? Symbol() : "__" + s;
      n.get = function() {
        var i, r;
        return this[o] === void 0 && (this[o] = (r = (i = this.renderRoot) === null || i === void 0 ? void 0 : i.querySelector(t)) !== null && r !== void 0 ? r : null), this[o];
      };
    }
    return n;
  } });
}
var b = Object.defineProperty, y = Object.getOwnPropertyDescriptor, c = (t, e, s, n) => {
  for (var o = n > 1 ? void 0 : n ? y(e, s) : e, i = t.length - 1, r; i >= 0; i--)
    (r = t[i]) && (o = (n ? r(e, s, o) : r(o)) || o);
  return n && o && b(e, s, o), o;
};
let a = class extends u {
  constructor() {
    super(), this._listItems = [], this.isNotifyAccessTokenValid = !1, this.isLoginAccessTokenValid = !1, fetch("http://localhost:5000/api/Users/VerifyLogin", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((t) => {
      if (t.status == 200 || t.status == 204) {
        this.isLoginAccessTokenValid = !0;
        return;
      }
      this.isLoginAccessTokenValid = !1;
      const e = {
        detail: { isLogin: this.isLoginAccessTokenValid },
        bubbles: !0,
        composed: !0
      };
      this.dispatchEvent(new CustomEvent("isLogin", e)), d.go("/login");
    }), fetch("http://localhost:5000/api/Users/GetNotifyStatus", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((t) => {
      if (t.status == 200 || t.status == 204) {
        this.isNotifyAccessTokenValid = !0;
        return;
      }
      this.isNotifyAccessTokenValid = !1, d.go("/notify");
    });
  }
  connectedCallback() {
    super.connectedCallback(), this._updHist();
  }
  async _updHist() {
    const t = await fetch("http://localhost:5000/api/Users/GetNotifyHist", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
    this._listItems = await t.json();
  }
  render() {
    var t, e;
    if (!(!this.isLoginAccessTokenValid || !this.isNotifyAccessTokenValid))
      return h`
      <div class="home-wrap">
        <h1>發送推播訊息</h1>
        <div class="card">
          可發送訊息給所有訂閱的使用者，顯示每次推播訊息的發送記錄。
        </div>
        <div class="box">
          <textarea id="textarea"></textarea>
          <button id="subscribe" @click=${this._onClick} part="button">
            送出 Notify
          </button>
        </div>
        <div class="box box2">
          <h2>你的推播紀錄👻</h2>
          <ul>
            ${((t = this._listItems) == null ? void 0 : t.length) > 0 ? (e = this._listItems) == null ? void 0 : e.map(
        (s) => h` <li>
                    <div class="time">${s.createTime}</div>
                    <div class="content">${s.content}</div>
                  </li>`
      ) : "目前沒有任何 notify \\(U_U)>"}
          </ul>
        </div>
      </div>
    `;
  }
  async _onClick() {
    var t;
    (t = this.textarea) != null && t.value.trim() && fetch("http://localhost:5000/api/Users/GetNotifyStatus", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((e) => {
      if (e.status == 200 || e.status == 204)
        this.isNotifyAccessTokenValid = !0, this._notify();
      else {
        this.isNotifyAccessTokenValid = !1;
        return;
      }
    });
  }
  async _notify() {
    await fetch("http://localhost:5000/api/Users/NotifyMsg", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `message=${this.textarea.value}`
    }) && (this.textarea.value = "", await this._updHist(), window.alert("發送成功!"));
  }
};
a.styles = f`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .home-wrap {
      padding: 20px;
    }

    .box {
      margin: auto;
      max-width: 600px;
      display: flex;
      flex-direction: column;
    }

    .box2 {
      margin-top: 40px;
    }

    ul {
      margin-top: 0;
      padding: 0;
    }

    h2 {
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    li {
      list-style-type: none;
      margin-top: 20px;
      border-bottom: 1px solid gray;
      padding-bottom: 20px;
    }

    .time {
      display: inline-block;
      background-color: black;
      padding: 4px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .content {
      letter-spacing: 1px;
    }

    .bottom {
      margin-top: 150px;
    }

    .logo {
      height: 24px;
      padding: 10px;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 5px #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 5px #325cffaa);
    }

    .card {
      display: flex;
      flex-direction: column;
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    textarea {
      min-height: 200px;
      padding: 20px;
      font-size: 16px;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
      margin-top: 24px;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    #subscribe {
      background-color: #646cffaa;
      margin-bottom: 16px;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
c([
  x("#textarea")
], a.prototype, "textarea", 2);
c([
  l()
], a.prototype, "_listItems", 2);
c([
  l()
], a.prototype, "isNotifyAccessTokenValid", 2);
c([
  l()
], a.prototype, "isLoginAccessTokenValid", 2);
a = c([
  m("my-home")
], a);
export {
  a as MyHome
};
