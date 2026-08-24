# 02 - Dependency Audit & Package Modernization

**Audited By:** `project-auditor` & `dependency-security`  
**Date:** 2026-08-20  
**Target Package Manager:** `pnpm`

---

## 1. Current Dependency Inventory & Classification

| Package Name | Installed Version | Current Usage in Code | Recommendation | Category |
| :--- | :--- | :--- | :--- | :--- |
| `react` | `^18.3.1` | Core Framework | Retain | Essential |
| `react-dom` | `^18.3.1` | Core DOM Renderer | Retain | Essential |
| `react-router-dom` | `6` | Client-side Routing | Retain | Essential |
| `axios` | `^1.7.7` | API Requests | Retain & centralize client | Essential |
| `@tanstack/react-query` | `^5.101.4` | Server State Management | Activate & integrate across all features | Essential |
| `face-api.js` | `^0.22.2` | Face Detection & Recognition | Retain strictly; do NOT replace | Essential |
| `lucide-react` | `^0.441.0` | UI Icons | Retain as standard icon library | Essential |
| `chart.js` | `^4.4.4` | Admin Reporting Visualizations | Retain | Feature |
| `react-chartjs-2` | `^5.2.0` | React wrapper for Chart.js | Retain | Feature |
| `react-spinners` | `^0.14.1` | Loading indicators | Retain | UI |
| `react-tabs` | `^6.0.2` | Tabs in Staff view | Retain (or replace with Tailwind tabs) | UI |
| `react-webcam` | `^7.2.0` | Browser Webcam Capture | Retain | Feature |
| `tailwindcss` | `^4.3.3` | Modern Styling | Retain & configure with Vite | CSS |
| `@tailwindcss/vite` | `^4.3.3` | Vite Tailwind plugin | Move to `devDependencies` | Dev / Build |
| `react-scripts` | `5.0.1` | Legacy CRA Build Tool | **REMOVE** (Replaced by Vite) | Obsolete |
| `react-cookies` | `^0.1.1` | Cookie management | **REPLACE** with standard `js-cookie` | Deprecated / Duplicate |
| `react-cookie` | `^7.2.0` | Redundant cookie library | **REMOVE** | Unused / Duplicate |
| `js-cookie` | `^3.0.5` | Lightweight Cookie library | **RETAIN** as single standard cookie util | Utility |
| `lucide` | `^0.441.0` | Redundant with `lucide-react` | **REMOVE** | Duplicate |
| `localforage` | `^1.10.0` | IndexedDB wrapper | **REMOVE** (Unused in codebase) | Unused |
| `web-vitals` | `^2.1.0` | CRA boilerplate telemetry | **REMOVE** | Obsolete |
| `@testing-library/*` | various | CRA testing boilerplate | Move to dev or test suite | Testing |

---

## 2. DevDependencies Required for Vite & Modern Tooling

To complete the modern React + Vite + Tailwind setup:
1. `vite` (`^6.x` or `^5.x`)
2. `@vitejs/plugin-react` (`^4.x`)
3. `@types/react`, `@types/react-dom` (optional / helpful for tooling)
4. `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

---

## 3. Lockfile Normalization

- Current state contains `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`.
- Action: Remove `package-lock.json` and `yarn.lock`. Consolidate exclusively onto `pnpm-lock.yaml` using `pnpm install`.
