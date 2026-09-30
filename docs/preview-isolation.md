# Preview Sandbox Isolation & Security Specification

## Overview

The preview sandbox (`apps/preview-sandbox`) is hosted on an isolated host/port (`http://localhost:3002` in local dev or a separate origin on Vercel) and rendered inside an HTML `<iframe>` with strict sandbox restrictions.

---

## Security Model & Iframe Restrictions

```html
<iframe
  src="http://localhost:3002/sandbox"
  sandbox="allow-scripts"
  csp="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: https:;"
></iframe>
```

### Key Controls Implemented:

1. **`sandbox="allow-scripts"` (WITHOUT `allow-same-origin`)**:
   - The sandbox origin is treated as a unique opaque origin (`null`).
   - The sandbox CANNOT access cookies, `localStorage`, `sessionStorage`, or IndexedDB of the parent catalogue or admin app.
   - The sandbox CANNOT execute `window.parent.document` or manipulate parent DOM.
   - The sandbox CANNOT send authenticated credentials/cookies with fetch or XMLHttpRequest.

2. **Strict Content Security Policy (CSP)**:
   - `default-src 'none'`: Prevents arbitrary network outbound calls, object embedding, or frame loading.
   - Restricts API fetch access so component code cannot perform malicious background telemetry or steal tokens.

3. **Controlled `postMessage` Communication**:
   - Preview code is passed from the parent catalogue/admin frame to the sandbox via `window.postMessage`.
   - The sandbox listens for `{ type: 'RENDER_COMPONENT', code: string, props?: Record<string, any> }`.
   - The code is transpiled safely in browser memory using **Sucrase** (`JSX` + `TypeScript` transform to `ESNext`).

---

## What Is Protected vs What Is Not Protected

### Protected:

- Parent user session cookies (`httpOnly` session tokens).
- Admin dashboard credentials and APIs.
- Main catalogue application DOM and state.
- Customer secret CLI tokens.

### Not Protected / Limitations:

- The browser tab's CPU/memory can still be degraded if uploaded preview code contains infinite loops (`while(true)`).
- Visual UI spoofing inside the bounds of the iframe (contained entirely within the iframe viewport).

---

## Technical Architecture

```
+------------------------------------+        postMessage         +----------------------------------+
| Catalogue / Admin App (Port 3000)  |  ----------------------->  | Preview Sandbox App (Port 3002)  |
| - Authenticated Session Cookie     |  { type: 'RENDER', code } | - Unique opaque origin           |
| - Full DOM access                  |                            | - sandbox="allow-scripts"        |
+------------------------------------+                            | - Transpiles TSX with Sucrase    |
                                                                  | - Renders isolated React DOM     |
                                                                  +----------------------------------+
```
