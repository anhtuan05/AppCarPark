# 01 - API Audit & Contract Mapping

**Audited By:** `project-auditor` & `data-architect`  
**Date:** 2026-08-20  
**Backend Host (Default):** `https://anhtuan05.pythonanywhere.com`

---

## 1. Inventory & Classification

| # | Endpoint Key | HTTP Method | Path | Current Caller(s) | Payload / Params | Expected Response | Status Classification |
|---|---|---|---|---|---|---|---|
| 1 | `login` | `POST` | `/o/token/` | `Login/index.js` | `FormData` (`client_id`, `client_secret`, `username`, `password`, `grant_type="password"`) | `{ access_token, expires_in, token_type, scope, refresh_token }` | **ACTIVE** |
| 2 | `current_user` | `GET` | `/user/current-user/` | `Login/index.js`, `PersonalInfo/index.js` | None (Bearer Token) | `{ id, username, first_name, last_name, email, date_of_birth, phone_number, is_staff, is_superuser }` | **ACTIVE** |
| 3 | `register` | `POST` | `/user/` | `Register/index.js` | `FormData` / JSON user object + `face_description` | `{ id, username, first_name, ... }` | **ACTIVE** |
| 4 | `put_user` | `PUT` | `/user/` | `PersonalInfo/index.js` | User profile update JSON / FormData | `{ id, username, ... }` | **ACTIVE** |
| 5 | `faceRecognition` / `login_with_face` | `POST` | `/user/login-with-face/` | `Register/index.js`, `Staff/index.js` | `FormData` (`face_description`: stringified 128D float array) | `{ access_token: "..." }` or 404/400 | **ACTIVE** |
| 6 | `parkinglot` | `GET` | `/parkinglot/` | `Parking/index.js`, `Reviews/index.js` | None | `Array<{ id, name, address, price_per_hour }>` | **ACTIVE** |
| 7 | `parkingspot` | `GET` | `/parkingspot/` | `Parking/index.js` | None | `Array<{ id, parkinglot, status }>` (`status`: "available", "occupied", "maintenance") | **ACTIVE** |
| 8 | `booking` | `GET` | `/booking/` | `Booking/index.js`, `PersonalInfo/index.js` | Bearer Token | `Array<{ id, spot, vehicle_license_plate, start_time, end_time, total_hours, status }>` | **ACTIVE** |
| 9 | `booking` | `POST` | `/booking/` | `Booking/index.js` | `{ spot, vehicle, start_time, end_time }` | `{ id, spot, vehicle, start_time, end_time, short_link? }` | **ACTIVE** |
| 10 | `subscription_type` | `GET` | `/subscription-type/` | `Subscription/index.js`, `ReNewSub/index.js` | None | `Array<{ id, type, total_amount, duration_days }>` | **ACTIVE** |
| 11 | `subscription` | `GET` | `/subscription/` | `Subscription/index.js`, `ReNewSub/index.js`, `PersonalInfo/index.js` | Bearer Token | `Array<{ id, subscription_type_name, spot, start_date, end_date, status }>` | **ACTIVE** |
| 12 | `subscription` | `POST` | `/subscription/` | `Subscription/index.js` | `{ subscription_type, spot }` | `{ id, subscription_type, spot, short_link? }` | **ACTIVE** |
| 13 | `renew-subscription` | `POST` | `/subscription/{sub_Id}/renew-subscription/` | `ReNewSub/index.js` | `{ subscription_type }` | `{ id, ... , short_link? }` | **ACTIVE** |
| 14 | `vehicle_management` | `GET` | `/vehicle/` | `VehicleManagement/index.js`, `Booking/index.js` | Bearer Token | `Array<{ id, license_plate, color, brand, car_model }>` | **ACTIVE** |
| 15 | `vehicle_management` | `POST` | `/vehicle/` | `VehicleManagement/index.js` | `{ license_plate, color, brand, car_model }` | `{ id, license_plate, color, brand, car_model }` | **ACTIVE** |
| 16 | `vehicle_management` | `PUT` | `/vehicle/{id}/` | `VehicleManagement/index.js` | `{ id, license_plate, color, brand, car_model }` | `{ id, ... }` | **ACTIVE** |
| 17 | `vehicle_management` | `DELETE` | `/vehicle/{id}/` | `VehicleManagement/index.js` | None (Bearer Token) | 204 No Content | **ACTIVE** |
| 18 | `entry_exit` | `GET` | `/parking-history/` | `PersonalInfo/index.js` | Bearer Token | `Array<{ id, spot, vehicle_license_plate, entry_time, exit_time, entry_image_url, exit_image_url }>` | **ACTIVE** |
| 19 | `entry_exit` | `POST` | `/parking-history/` | `Staff/index.js` | `FormData` (`entry_image`, `license_plate`) | `{ id, spot, subscription, booking, entry_time }` | **ACTIVE** |
| 20 | `entry_exit` | `PATCH` | `/parking-history/` | `Staff/index.js` | `FormData` (`exit_image`, `license_plate`) | `{ id, spot, exit_time }` | **ACTIVE** |
| 21 | `payment` | `GET` | `/payment/` | `PersonalInfo/index.js` | Bearer Token | `Array<{ id, amount, payment_method, payment_note }>` | **ACTIVE** |
| 22 | `revenuedata` | `GET` | `/payment/revenue_statistics/` | `Admin/Report/index.js` | Bearer Token | Record<string, number> (e.g. `{"2024-01": 1500000, ...}`) | **ACTIVE** |
| 23 | `ratings` | `GET` | `/parkinglot/ratings/` | `Admin/Report/index.js` | Bearer Token | `Array<{ id, name, rates_1, rates_2, rates_3, rates_4, rates_5, average_rate, total_reviews }>` | **ACTIVE** |
| 24 | `reviews` | `GET` | `/reviews/` | `Reviews/index.js` | Bearer Token | `Array<{ id, parkinglot: { name }, parkinglot_name, rate, comment, user }>` | **ACTIVE** |
| 25 | `reviews` | `POST` | `/reviews/` | `Reviews/index.js` | `{ parkinglot, rate, comment }` | `{ id, ... }` | **ACTIVE** |
| 26 | `reviews` | `PUT` | `/reviews/{id}/` | `Reviews/index.js` | `{ parkinglot, rate, comment }` | `{ id, ... }` | **ACTIVE** |
| 27 | `reviews` | `DELETE` | `/reviews/{id}/` | `Reviews/index.js` | None (Bearer Token) | 204 No Content | **ACTIVE** |
| 28 | Third-party License Plate Reader | `POST` | `https://api.platerecognizer.com/v1/plate-reader/` | `Staff/index.js` | `FormData` (`upload`: File, `regions`: "vn") | `{ results: Array<{ plate: string, confidence: number }> }` | **MOCK_CANDIDATE** (External service with hardcoded key; needs mock fallback for offline/test mode) |

---

## 2. Mock API & Resilience Strategy

1. **HTTP / Service Layer Mocking:**
   - Provide fallback mock data generators for each domain (parking lots, spots, subscriptions, vehicles, revenue statistics, plate recognizer).
   - Driven by `VITE_API_MODE=real | mock` or automatic fallback on network failure in development.
   - Preserves exact DTO contracts so React component/hook layers never contain inline `if (isMock) return fakeData` conditionals.

2. **Environment Variables Configuration:**
   - `VITE_API_BASE_URL`: Base URL for PythonAnywhere backend (defaults to `https://anhtuan05.pythonanywhere.com`).
   - `VITE_OAUTH_CLIENT_ID`: Client ID for OAuth2 password grant.
   - `VITE_OAUTH_CLIENT_SECRET`: Client Secret for OAuth2 password grant.
   - `VITE_PLATE_RECOGNIZER_TOKEN`: Token for Plate Recognizer API.
   - `VITE_USE_MOCK_API`: Boolean flag (`true` / `false`) to enable offline mock handlers.
