import { s as l, x as c, i as p, a as d } from "./index-06b6baab.js";
import { v as h, l as f } from "./vite-d1e6f353.js";
var g = Object.defineProperty, m = Object.getOwnPropertyDescriptor, b = (o, t, a, r) => {
  for (var e = r > 1 ? void 0 : r ? m(t, a) : t, i = o.length - 1, n; i >= 0; i--)
    (n = o[i]) && (e = (r ? n(t, a, e) : n(e)) || e);
  return r && e && g(t, a, e), e;
};
let s = class extends l {
  // <button id="logout-btn" @click=${this._LineLogout} part="button">
  //   登出
  // </button>
  render() {
    return c`
      <div class="login-wrap">
        <h1>登入</h1>

        <h3>免註冊，用 Line 登入</h3>

        <div class="card">
          <button id="login-btn" @click=${this._LineLogin} part="button">
            前往 Line Login
          </button>
        </div>

        <h4 class="gray-text">
          使用 Line Notify 發送通知，<br />
          並記錄你發送過的訊息。
        </h4>

        <div class="bottom">
          <p class="read-the-docs">使用 Vite 和 Lit 製作前端</p>

          <a href="https://vitejs.dev" target="_blank">
            <img src=${h} class="logo" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${f} class="logo lit" alt="Lit logo" />
          </a>
        </div>
      </div>
    `;
  }
  async _LineLogin() {
    let o = new URL("https://access.line.me/oauth2/v2.1/authorize");
    o.searchParams.append("response_type", "code"), o.searchParams.append("response_mode", "form_post"), o.searchParams.append("client_id", "1660895465"), o.searchParams.append("state", "peko123123"), o.searchParams.append("nonce", "abcd5678peko"), o.searchParams.append(
      "redirect_uri",
      "http://localhost:5000/api/Users/GetToken"
    ), o.searchParams.append("scope", "profile openid"), window.open(o.href, "_self");
  }
};
s.styles = p`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    h3 {
      letter-spacing: 1px;
    }

    .gray-text {
      color: #aaa;
      font-weight: 400;
      letter-spacing: 1px;
    }

    #login-btn {
      background-color: #646cffaa;
      margin-bottom: 16px;
    }

    .login-wrap {
      margin: auto;
      max-width: 300px;
      padding: 20px;
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
s = b([
  d("my-login")
], s);
export {
  s as MyLogin
};
