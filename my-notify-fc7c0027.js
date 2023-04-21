import { s as h, R as c, x as p, i as f, e as d, a as u } from "./index-df9efada.js";
import { v as g, l as m } from "./vite-d1e6f353.js";
var b = Object.defineProperty, y = Object.getOwnPropertyDescriptor, l = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? y(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (o = (s ? r(e, i, o) : r(o)) || o);
  return s && o && b(e, i, o), o;
};
let a = class extends h {
  constructor() {
    super(), this.docsHint = "使用 Vite 和 Lit 製作前端", this.isLoginAccessTokenValid = !1, fetch("http://localhost:5000/api/Users/VerifyLogin", {
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
      this.dispatchEvent(new CustomEvent("isLogin", e)), c.go("/login");
    });
  }
  connectedCallback() {
    super.connectedCallback();
    const t = new URLSearchParams(window.location.search), e = t.get("code"), i = t.get("state");
    e && i && fetch("http://localhost:5000/api/Users/GetNotifyToken", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `code=${e}&state=${i}`
    }).then((s) => {
      s.status === 200 && c.go("/");
    });
  }
  render() {
    if (this.isLoginAccessTokenValid)
      return p`
      <div class="notify-wrap">
        <h1>Line Notify</h1>

        <div class="card">
          <button id="subscribe" @click=${this._GetNotifyCode} part="button">
            訂閱 LINE Notify 通知
          </button>
          <button @click=${this._RevokeNotify} part="button">
            取消 LINE Notify 通知
          </button>
        </div>

        <div class="bottom">
          <p class="read-the-docs">${this.docsHint}</p>

          <a href="https://vitejs.dev" target="_blank">
            <img src=${g} class="logo" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${m} class="logo lit" alt="Lit logo" />
          </a>
        </div>
      </div>
    `;
  }
  async _GetNotifyCode() {
    fetch("http://localhost:5000/api/Users/GetNotifyStatus", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then(async (t) => {
      if (t.status == 200 || t.status == 204) {
        window.alert("已訂閱成功!");
        return;
      } else if (await t.text() === "notLogin") {
        this.isLoginAccessTokenValid = !1;
        const e = {
          detail: { isLogin: this.isLoginAccessTokenValid },
          bubbles: !0,
          composed: !0
        };
        this.dispatchEvent(new CustomEvent("isLogin", e)), c.go("/login");
        return;
      }
      this._getCode();
    });
  }
  _getCode() {
    let t = new URL("https://notify-bot.line.me/oauth/authorize");
    t.searchParams.append("response_type", "code"), t.searchParams.append("client_id", "DfXzLnaKcOdrCOWpa8FLbU"), t.searchParams.append("state", "123123"), t.searchParams.append("scope", "notify"), t.searchParams.append("redirect_uri", "http://localhost:3030/notify"), window.open(t, "_self");
  }
  _RevokeNotify() {
    fetch("http://localhost:5000/api/Users/RevokeNotify", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include"
    }).then((t) => {
      t.status === 200 && window.alert("取消訂閱成功!");
    });
  }
};
a.styles = f`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .notify-wrap {
      margin: auto;
      max-width: 300px;
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
l([
  d()
], a.prototype, "docsHint", 2);
l([
  d()
], a.prototype, "isLoginAccessTokenValid", 2);
a = l([
  u("my-notify")
], a);
export {
  a as MyNotify
};
