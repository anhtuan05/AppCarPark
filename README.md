# Green Car Park Frontend

Giao diện web cho hệ thống bãi đỗ xe thông minh: theo dõi chỗ trống, đặt chỗ theo giờ, quản lý vé tháng, phương tiện, phản hồi và xác thực khuôn mặt.

## Công nghệ

- React 18 + React Router 6
- Vite 8
- Tailwind CSS 4
- TanStack React Query 5 + Axios
- face-api.js + react-webcam
- Chart.js
- ESLint 10

## Chạy dự án

Yêu cầu: Node.js 22+ và pnpm.

```bash
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Ứng dụng mặc định chạy tại `http://localhost:3000`.

Để làm việc không cần backend, đặt biến sau trong `.env`:

```env
VITE_USE_MOCK_API=true
```

## Biến môi trường

| Biến | Mục đích |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL của Django API |
| `VITE_OAUTH_CLIENT_ID` | OAuth public client ID |
| `VITE_OAUTH_CLIENT_SECRET` | Chỉ hỗ trợ backend cũ; không nên dùng trong production |
| `VITE_PLATE_RECOGNIZER_TOKEN` | Token Plate Recognizer, nếu bật tích hợp thật |
| `VITE_USE_MOCK_API` | Bật dữ liệu mẫu khi phát triển |

> Mọi biến bắt đầu bằng `VITE_` đều được đưa vào bundle phía trình duyệt. Không lưu bí mật production trong các biến này.

## Lệnh thường dùng

```bash
pnpm dev      # chạy development server
pnpm lint     # kiểm tra JavaScript/React Hooks
pnpm build    # tạo production bundle trong dist/
pnpm check    # chạy lint rồi build
pnpm preview  # xem production bundle cục bộ
```

## Cấu trúc chính

```text
src/
├── Component/              # màn hình và layout theo route
├── features/               # API, query hooks và logic theo domain
│   ├── auth/
│   ├── booking/
│   ├── face-recognition/
│   ├── parking/
│   ├── reviews/
│   ├── staff/
│   ├── subscription/
│   └── vehicles/
├── shared/
│   ├── api/                # Axios client, endpoint, token và mock data
│   └── providers/          # React Query provider
├── App.jsx                 # app shell + lazy routes
└── main.jsx                # điểm khởi tạo React
```

Các màn hình được lazy-load theo route. `face-api.js` và `Chart.js` nằm trong bundle riêng nên không chặn lần tải trang chủ đầu tiên.

## Responsive & accessibility

- Mobile: nội dung một cột, CTA toàn chiều rộng, lịch sử đặt chỗ dạng card.
- Tablet: menu drawer thay cho thanh điều hướng dài; form và grid tự co giãn.
- Desktop: navigation đầy đủ, layout nhiều cột và bảng dữ liệu.
- Có skip link, focus-visible, touch target tối thiểu, `prefers-reduced-motion`, nhãn form và trạng thái `aria-live`.

Xem [CODEBASE_REVIEW.md](./docs/CODEBASE_REVIEW.md) để biết các cải tiến đã thực hiện và backlog kỹ thuật đề xuất.
