# 00 - Current Architecture Audit

**Audited By:** `project-auditor` (Senior Frontend Architect)  
**Date:** 2026-08-20  
**Project:** Carpark (Green Car Parking Service)  
**Repository Root:** `D:\StudyProjects\ReactJsProject\carpark`

---

## 1. Executive Summary

The application is a brownfield React 18 single-page application for a smart parking management system named "Green Car Parking Service". It provides features for parking lot search, spot reservation (booking), subscription management, vehicle management, user reviews, revenue and rating reports (admin), parking entry/exit verification (staff), and facial recognition-based authentication and user verification.

The current codebase is built on top of **Create React App (`react-scripts` 5.0.1)** with significant architectural, performance, and maintenance issues, including infinite re-render loops, unmanaged memory leaks, hardcoded backend URLs, redundant dependencies, and tightly coupled UI and business logic.

---

## 2. Infrastructure & Build System

| Dimension | Current State | Target State | Notes |
| :--- | :--- | :--- | :--- |
| **Bundler** | Create React App (`react-scripts` 5.0.1 / Webpack 5) | Vite 6 / React Plugin | Slow startup, legacy CRA deprecation |
| **Package Manager** | Mixed (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) | `pnpm` exclusively | Remove stale lockfiles |
| **React Version** | React 18.3.1 / React DOM 18.3.1 | React 18.3.1 (Modernized) | Compatible with modern hooks & Vite |
| **Styling** | Per-component legacy CSS (`style.css` + `App.css`) | Tailwind CSS v4 + Design Tokens | Inconsistent design, responsive breakages |
| **Environment** | Hardcoded constants in code | Vite `import.meta.env` (`.env.example`) | Hardcoded API hosts & third-party keys |

---

## 3. Directory & Component Architecture

```
src/
├── API.js                    # Monolithic Axios client & hardcoded endpoint dictionary
├── App.css                   # Global CSS custom properties & base element styles
├── App.js                    # Root routing, Context Provider, user reducer
├── App.test.js               # Obsolete CRA test looking for non-existent text
├── CarParkContext.js         # React Context for global auth state
├── CarParkUserReducer.js     # Reducer for login/logout actions (interacts with cookies)
├── index.css                 # Base resets
├── index.js                  # Entry point with BrowserRouter & React.StrictMode
├── Component/
│   ├── AboutMe/              # EMPTY component
│   ├── Admin/
│   │   ├── Report/           # Admin chart reports (Chart.js / react-chartjs-2)
│   │   └── SpotNotification/# EMPTY component
│   ├── Booking/              # Spot booking & booking history table
│   ├── Feedback/             # Stub component (returns only <h2>)
│   ├── Footer/               # Static footer with contact info
│   ├── Header/               # Navigation bar with role-based links
│   ├── Home/                 # Landing page with hero background
│   ├── Login/                # OAuth2 password login form + image banner
│   ├── Parking/              # Parking lot & spot picker with modal dialog
│   ├── PersonalInfo/         # Monolithic profile & 4 history tables (waterfall fetching)
│   ├── Register/             # Giant form + face registration via WebcamCapture
│   ├── ReNewSub/             # Subscription renewal form
│   ├── Reviews/              # User ratings & comments list
│   ├── Staff/                # Staff vehicle entry/exit with webcam + plate reader
│   ├── Subscription/         # Monthly subscription registration
│   ├── VehicleManagement/    # Vehicle CRUD with infinite re-render bug
│   └── WebcamCapture/        # Face-api.js webcam snapshot & descriptor extractor
└── Img/                      # Static image assets (.webp, .jpg)
```

---

## 4. State Management & Data Flow

1. **Global Auth State:**
   - Handled via `CarParkContext` + `CarParkUserReducer`.
   - Stores `user` object in state and persists to `react-cookies` (`cookie.load("user")`).
   - Token is stored separately in `react-cookies` (`cookie.save("token", res.data)`).
   - *Issues:* Multiple cookie libraries (`js-cookie`, `react-cookie`, `react-cookies`) are installed. Token loading is done ad-hoc across 8+ components via `cookie.load('token')`.

2. **Server State:**
   - Currently fetched directly inside `useEffect` in individual components and stored in local `useState`.
   - No caching, no deduplication, no background refetching, no centralized error/loading states.
   - `@tanstack/react-query` is installed in `package.json` but 0% utilized.

---

## 5. Critical Code Smells & Bugs Found

### 🔴 Critical Bug 1: Infinite Re-render in `VehicleManagement/index.js`
Lines 23-25:
```javascript
useEffect(() => {
  getVehicle()
}, [vehicles]); // Dependency triggers getVehicle -> setVehicles -> triggers useEffect infinitely!
```

### 🔴 Critical Bug 2: Syntax / JSX error in `App.js`
Line 44:
```jsx
<Route path='/reviews' element={<Reviews />} />PersonalInfo
```
Stray text `PersonalInfo` rendered outside route tags.

### 🔴 Critical Bug 3: Hardcoded Third-Party API Key in `Staff/index.js`
Line 56:
```javascript
'Authorization': 'Token 3fc443b0688e2b27960d9af3c82a14e27c52302b'
```
Exposes raw PlateRecognizer API token in frontend source code.

### 🟡 High Severity: Derived State Misuse in `Header/index.js`
Derived flags `isUser`, `isStaff`, `isAdmin` are synchronized inside a `useEffect` causing unnecessary secondary re-renders. Must be derived synchronously during render per Vercel Best Practices (`rerender-derived-state-no-effect`).

### 🟡 High Severity: Memory Leak in `Staff/index.js`
`URL.createObjectURL(selectedCarImage)` is called on every render pass without calling `URL.revokeObjectURL()`.

### 🟡 High Severity: DOM Inspection in `WebcamCapture/index.js`
`document.getElementById('captured-image')` is used instead of a React Ref or canvas image data buffer.

---

## 6. Recommendations & Migration Sequence

1. **Phase 1: Platform Migration (Vite + Tailwind v4 + Clean scripts)**
   - Replace CRA with Vite (`@vitejs/plugin-react`).
   - Clean up lockfiles, setup `.env` and `.env.example`.
   - Setup aliases (`@/` -> `src/`).
2. **Phase 2: Data Architecture (Axios Client + TanStack Query + Mocks)**
   - Centralize Axios instance with interceptors for token attachment.
   - Migrate server state to TanStack Query (`useQuery`, `useMutation`).
   - Provide safe HTTP mock fallback for offline development & tests.
3. **Phase 2B: Face Recognition Pipeline**
   - Centralize face-api model loading into a singleton service.
   - Implement proper camera lifecycle management and stream cleanup.
4. **Phase 3: React Architecture Modernization**
   - Modularize feature directories (`src/features/*`, `src/shared/*`).
   - Fix infinite loops, eliminate derived state effects, apply Vercel React Best Practices.
5. **Phase 4: Responsive UI Migration**
   - Convert legacy CSS to modern responsive Tailwind CSS tokens and utility classes.
   - Ensure pixel-perfect layout across mobile (360px - 390px), tablet (768px - 834px), and desktop (1024px - 1920px).
6. **Phase 5: Dependency Cleanup & Security Audit**
   - Remove unused and redundant packages (`react-cookies`, `js-cookie`, `localforage`, `lucide`).
