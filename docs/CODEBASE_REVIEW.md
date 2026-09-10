# Codebase Review — Green Car Park FE

Cập nhật: 10/09/2026

## Tổng quan

Codebase đã có nền tảng domain tốt hơn một dự án React nhỏ thông thường: API được tách theo `features`, endpoint tập trung, React Query quản lý server state và face model có singleton loader. Đợt cải tiến này tập trung hoàn thiện app shell, responsive, accessibility, hiệu năng tải đầu và công cụ kiểm tra chất lượng.

Luồng dữ liệu hiện tại:

```text
Route screen → feature query/mutation → shared Axios client → Django API
                                     ↘ mock response khi VITE_USE_MOCK_API=true
```

## Đã cải tiến

### Giao diện & responsive

- Thiết kế lại trang chủ theo ngôn ngữ và nhận diện thương hiệu thống nhất.
- Header dùng desktop navigation từ breakpoint `xl`; mobile và tablet dùng drawer cuộn độc lập.
- Bản đồ bãi xe hỗ trợ nhiều trạng thái, empty/error/loading state và grid co giãn.
- Trang đặt chỗ hiển thị lịch sử dạng card trên mobile, dạng table từ tablet/desktop.
- Footer được tổ chức lại với liên kết dịch vụ, địa chỉ, liên hệ và trạng thái hệ thống.
- Ảnh trang chủ và đăng nhập được resize, strip metadata và chuyển WebP tối ưu.

### Accessibility & UX

- Thêm skip link tới nội dung chính và trang 404.
- Bổ sung nhãn form, `name`, `autocomplete`, `aria-label`, `aria-live` và focus-visible.
- Chuyển ô đỗ xe từ `div onClick` sang `button` hỗ trợ bàn phím.
- Modal chọn dịch vụ hỗ trợ Escape, focus ban đầu, khóa cuộn nền và safe bottom-sheet trên mobile.
- Animation tôn trọng `prefers-reduced-motion`; touch target chính đạt tối thiểu 44px.

### Hiệu năng & maintainability

- Lazy-load toàn bộ route; Face API và Chart.js không nằm trong entry chunk.
- Khởi tạo reducer bằng lazy initializer để chỉ đọc cookie một lần.
- Thay định dạng ngày/tiền thủ công bằng `Intl.DateTimeFormat` và `Intl.NumberFormat` ở các luồng đã chỉnh.
- Loại bỏ CRA entry/test cũ và các file CSS legacy không còn được import.
- Thêm ESLint flat config cho JavaScript, React Hooks và Vite Fast Refresh.
- Cập nhật README theo Vite/pnpm thay cho tài liệu Create React App cũ.

## Backlog đề xuất

### P0 — Bảo mật đăng nhập

Frontend không thể giữ bí mật OAuth bằng biến `VITE_*`; giá trị luôn xuất hiện trong bundle. Hardcoded fallback đã được xóa và client secret trở thành tùy chọn để giữ tương thích, nhưng giải pháp production nên là OAuth public client + PKCE hoặc Backend-for-Frontend. Access token hiện vẫn nằm trong cookie đọc được bằng JavaScript; nên chuyển sang cookie `HttpOnly`, `Secure`, `SameSite` do backend phát hành.

### P1 — Route guard & lỗi toàn cục

Các màn hình tự kiểm tra role bên trong component. Nên tạo `ProtectedRoute`/`RoleRoute` dùng chung và Error Boundary ở cấp app để tránh lặp logic và có trang phục hồi khi render lỗi.

### P1 — Kiểm thử

CRA/Jest test cũ không còn tương thích và đã được gỡ. Nên bổ sung Vitest + Testing Library cho reducer, API adapter và form; dùng Playwright cho các luồng đăng nhập, chọn bãi, đặt chỗ và responsive viewport.

### P2 — UI primitives & i18n

Các màn hình cũ vẫn lặp class cho button, input, alert và empty state; nên trích `Button`, `Field`, `Alert`, `PageHeader`, `DataCard`. Nội dung Việt/Anh còn trộn ở một số màn hình staff/report/review; nên gom copy vào resource tiếng Việt trước khi thêm i18n.

### P2 — API contract

Nên thêm schema validation cho response (Zod hoặc Valibot), chuẩn hóa tên route URL và mapping trạng thái từ backend. Việc này giảm lỗi khi DTO thay đổi và giúp mock data bám sát API thật.

## Tiêu chí hoàn tất cho vòng tiếp theo

1. `pnpm check` chạy xanh trong CI.
2. Có test cho 4 luồng chính và 3 viewport: 390px, 768px, 1280px.
3. Không còn client secret hoặc access token đọc được bằng JavaScript ở production.
4. Toàn bộ nội dung người dùng hiển thị thống nhất bằng tiếng Việt.
