# Thiết Kế Kỹ Thuật - Memory Map Website MVP

## 1. Mục tiêu kỹ thuật

Memory Map MVP tạm thời tập trung vào website trước; mobile app sẽ được tính ở giai đoạn sau. Thiết kế kỹ thuật cần đảm bảo:

- Đăng ký, đăng nhập và quản lý hồ sơ cơ bản.
- Tạo bài check-in gồm ảnh, vị trí, caption, cảm xúc, danh mục và quyền riêng tư.
- Hiển thị marker trên bản đồ cá nhân, có thể lọc theo thời gian, danh mục và cảm xúc.
- Xem danh sách và chi tiết bài check-in.
- Lưu trữ ảnh tối ưu, tải nhanh và dễ mở rộng sang CDN/object storage.
- API có thể tái sử dụng cho mobile app sau này.

## 2. Đề xuất stack

### Frontend: Next.js + JavaScript

Nên dùng Next.js App Router với JavaScript/JSX cho website MVP.

Ưu điểm:

- Phù hợp với website có mức tương tác cao: upload ảnh, form tạo check-in, bản đồ, bộ lọc, modal.
- Có sẵn routing, layout, metadata, image optimization và server rendering.
- Hệ sinh thái React mạnh: TanStack Query, React Hook Form, Zod, Leaflet/Mapbox GL/Google Maps wrapper.
- JavaScript giúp MVP nhẹ hơn, ít cấu hình hơn và phù hợp với giai đoạn đang mock UI trước backend.
- Dễ chia sẻ logic với mobile sau này nếu chọn React Native, đặc biệt là validation schema, API client và state pattern.
- SEO tốt hơn React SPA, hữu ích nếu sau này có trang public check-in, profile public hoặc discovery.
- Có thể tách rõ phần server-rendered pages và client-only components như bản đồ, upload ảnh, location picker.

Nhược điểm:

- Next.js phức tạp hơn React SPA vì có thêm Server Components, Client Components, caching và rendering strategy.
- Một số thư viện bản đồ phụ thuộc `window`, cần dynamic import với `ssr: false`.
- Nếu không kiểm soát caching và auth boundary rõ, dữ liệu private có thể bị cache sai.
- Deploy Next.js cần môi trường hỗ trợ server runtime nếu dùng SSR/dynamic route nhiều; static hosting thuần không đủ cho toàn bộ tính năng.
- Không dùng TypeScript ở MVP nên cần giữ naming/data shape nhất quán và bổ sung validation bằng Zod tại request/API boundary.

Khuyến nghị cho MVP:

- Next.js App Router.
- Code frontend dùng JavaScript/JSX, không dùng TypeScript trong MVP hiện tại.
- Tạm thời bỏ đăng nhập theo yêu cầu hiện tại; vào thẳng trải nghiệm bản đồ, danh sách, tạo check-in mock và hồ sơ.
- Dữ liệu UI tạm thời lấy từ `lib/mock-data.js`; khi backend sẵn sàng sẽ thay bằng API client.
- Dùng Server Components cho trang ít tương tác và cần fetch dữ liệu ban đầu.
- Dùng Client Components cho bản đồ, form upload, location picker, image preview và các UI tương tác cao.
- TanStack Query cho API cache, pagination và optimistic update nhẹ.
- React Hook Form + Zod cho form/validation.
- Leaflet + OpenStreetMap cho MVP để tiết kiệm chi phí, không cần API key và đủ tốt cho bản đồ check-in riêng tư. Có thể thêm provider geocoding riêng nếu cần tìm kiếm địa điểm tốt hơn.
- Dùng `next/image` cho ảnh public/CDN; với ảnh private signed URL cần cấu hình loader/remote patterns cẩn thận.

### Backend: Node.js + Express

Nên dùng Node.js + Express.

Ưu điểm:

- Phù hợp với API CRUD, upload ảnh, authentication và map/list filtering.
- Cùng ngôn ngữ với frontend, dễ chia sẻ schema, validation rule và API contract.
- Express nhẹ, linh hoạt, phù hợp để làm MVP nhanh.
- Hệ sinh thái tốt: multer/busboy, sharp, jsonwebtoken, bcrypt/argon2, Prisma/Knex/Drizzle.

Nhược điểm:

- Express không ép sẵn cấu trúc dự án, codebase dễ rối nếu không chia layer rõ.
- Cần tự xử lý validation, error handling, auth middleware, rate limit và logging.
- Xử lý ảnh trực tiếp trong request có thể làm chậm API nếu upload nhiều ảnh hoặc ảnh dung lượng lớn.

Khuyến nghị cho MVP:

- Express.
- Prisma ORM hoặc Knex. Prisma nhanh cho MVP và migration tốt. Knex linh hoạt hơn nếu cần viết SQL nhiều.
- Zod validation tại request boundary.
- Auth dùng access token JWT ngắn hạn + refresh token lưu DB/httpOnly cookie.
- Xử lý ảnh qua background job khi cần scale; MVP có thể resize sync với giới hạn kích thước file rõ ràng.

### Database: MySQL

Nên dùng MySQL 8.x.

Ưu điểm:

- Ổn định, phổ biến, dễ deploy, hosting rẻ.
- Tốt cho relational data: users, checkins, images, categories, moods, privacy.
- Có spatial data type và spatial index, phù hợp query theo tọa độ/khu vực.
- Transaction và unique constraint tốt cho dữ liệu sản phẩm.

Nhược điểm:

- Query địa lý nâng cao kém PostGIS của PostgreSQL.
- Full-text search tiếng Việt và search địa điểm cần giải pháp riêng nếu yêu cầu cao.
- Nếu feed/social discovery lớn, sau này có thể cần thêm cache/search engine.

Khuyến nghị:

- MVP dùng MySQL là hợp lý.
- Lưu latitude/longitude dạng `DECIMAL(10,7)` để dễ đọc và thêm cột generated/spatial `POINT` nếu cần query gần vị trí.
- Tạo index theo `user_id`, `visibility`, `checkin_time`, `category_id`, `mood_id` và spatial index cho `location_point`.

## 3. Kiến trúc tổng quan

```text
Browser
  |
  | HTTPS
  v
Next.js Website
  |
  | REST API / JSON
  v
Express API
  |        |
  |        +--> Object Storage/CDN: check-in images, avatar
  |
  +--> MySQL: metadata, users, checkins, image records
```

Thành phần chính:

- Next.js frontend: UI, routing, SSR/metadata khi cần, tương tác bản đồ, chọn file, client-side preview, gọi API.
- Backend API: auth, authorization, CRUD check-in, signed upload/presigned URL, image metadata, profile stats.
- MySQL: lưu metadata và quan hệ dữ liệu.
- Object storage: lưu file ảnh thực tế.
- CDN: phân phối ảnh nhanh.

## 4. Module backend đề xuất

```text
src/
  app.js
  server.js
  config/
  modules/
    auth/
    users/
    checkins/
    images/
    categories/
    moods/
    map/
  middleware/
    authRequired.js
    errorHandler.js
    validate.js
    rateLimit.js
  lib/
    db.js
    storage.js
    imageProcessor.js
```

Quy tắc:

- Controller chỉ nhận request/response.
- Service xử lý business logic và permission.
- Repository/ORM xử lý database.
- Middleware auth kiểm tra token và gắn `req.user`.
- Mọi API ghi dữ liệu phải validate input bằng schema.

## 5. Thiết kế cơ sở dữ liệu

### 5.1. `users`

Lưu thông tin tài khoản.

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_image_id BIGINT UNSIGNED NULL,
  bio VARCHAR(500) NULL,
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_phone (phone)
);
```

### 5.2. `refresh_tokens`

Lưu refresh token đã hash để đăng xuất và revoke.

```sql
CREATE TABLE refresh_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uk_refresh_tokens_hash (token_hash),
  KEY idx_refresh_tokens_user (user_id)
);
```

### 5.3. `location_categories`

Lưu danh mục địa điểm.

```sql
CREATE TABLE location_categories (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL,
  icon VARCHAR(80) NULL,
  color CHAR(7) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uk_location_categories_slug (slug)
);
```

### 5.4. `moods`

Lưu danh sách cảm xúc.

```sql
CREATE TABLE moods (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL,
  icon VARCHAR(80) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uk_moods_slug (slug)
);
```

### 5.5. `checkins`

Bảng trung tâm của sản phẩm.

```sql
CREATE TABLE checkins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  caption TEXT NULL,
  location_name VARCHAR(160) NOT NULL,
  address VARCHAR(500) NULL,
  city VARCHAR(120) NULL,
  region VARCHAR(120) NULL,
  country_code CHAR(2) NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  location_point POINT NOT NULL SRID 4326,
  category_id SMALLINT UNSIGNED NULL,
  mood_id SMALLINT UNSIGNED NULL,
  visibility ENUM('private', 'public') NOT NULL DEFAULT 'private',
  checkin_time DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES location_categories(id),
  FOREIGN KEY (mood_id) REFERENCES moods(id),
  KEY idx_checkins_user_time (user_id, checkin_time DESC),
  KEY idx_checkins_visibility_time (visibility, checkin_time DESC),
  KEY idx_checkins_filters (user_id, category_id, mood_id, checkin_time),
  SPATIAL INDEX spx_checkins_location (location_point)
);
```

Ghi chú:

- `latitude` và `longitude` để hiển thị và debug.
- `location_point` để query bản đồ theo viewport/bounding box.
- `deleted_at` cho soft delete, tránh mất dữ liệu ngay lập tức.
- MVP chỉ cần `private/public`; `friends` có thể thêm sau khi có follow graph.

### 5.6. `images`

Lưu metadata ảnh, không lưu binary trong MySQL.

```sql
CREATE TABLE images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  storage_provider ENUM('local', 's3', 'r2', 'gcs') NOT NULL,
  bucket VARCHAR(120) NULL,
  object_key VARCHAR(500) NOT NULL,
  original_filename VARCHAR(255) NULL,
  mime_type VARCHAR(80) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  blurhash VARCHAR(120) NULL,
  dominant_color CHAR(7) NULL,
  status ENUM('pending', 'ready', 'failed', 'deleted') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id),
  KEY idx_images_owner (owner_user_id),
  KEY idx_images_status (status)
);
```

### 5.7. `image_variants`

Lưu các phiên bản ảnh đã resize.

```sql
CREATE TABLE image_variants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_id BIGINT UNSIGNED NOT NULL,
  variant ENUM('original', 'large', 'medium', 'thumbnail') NOT NULL,
  object_key VARCHAR(500) NOT NULL,
  width INT UNSIGNED NOT NULL,
  height INT UNSIGNED NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images(id),
  UNIQUE KEY uk_image_variants_image_variant (image_id, variant)
);
```

### 5.8. `checkin_images`

Bảng nối bài check-in với nhiều ảnh.

```sql
CREATE TABLE checkin_images (
  checkin_id BIGINT UNSIGNED NOT NULL,
  image_id BIGINT UNSIGNED NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (checkin_id, image_id),
  FOREIGN KEY (checkin_id) REFERENCES checkins(id),
  FOREIGN KEY (image_id) REFERENCES images(id),
  KEY idx_checkin_images_order (checkin_id, sort_order)
);
```

### 5.9. `journal_prompts`

Lưu các gợi ý viết nhật ký.

```sql
CREATE TABLE journal_prompts (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prompt_text VARCHAR(255) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```

### 5.10. `checkin_stats_daily` optional

MVP có thể tính realtime. Khi dữ liệu tăng, có thể thêm bảng aggregate.

```sql
CREATE TABLE checkin_stats_daily (
  user_id BIGINT UNSIGNED NOT NULL,
  stat_date DATE NOT NULL,
  checkin_count INT UNSIGNED NOT NULL DEFAULT 0,
  image_count INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, stat_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 6. Lưu trữ hình ảnh

### Nguyên tắc

- Không lưu file ảnh trong MySQL. MySQL chỉ lưu metadata và object key.
- Ảnh lưu ở object storage: S3, Cloudflare R2, Google Cloud Storage hoặc local filesystem cho môi trường dev.
- Public URL nên đi qua CDN.
- Ảnh private không nên có URL public vĩnh viễn nếu cần bảo mật vị trí/kỷ niệm cá nhân.

### Cấu trúc object key

```text
users/{userId}/checkins/{checkinId}/images/{imageId}/original.webp
users/{userId}/checkins/{checkinId}/images/{imageId}/large.webp
users/{userId}/checkins/{checkinId}/images/{imageId}/medium.webp
users/{userId}/checkins/{checkinId}/images/{imageId}/thumb.webp
users/{userId}/avatar/{imageId}/avatar.webp
```

Nếu upload ảnh trước khi tạo check-in, dùng key tạm:

```text
users/{userId}/uploads/tmp/{uploadId}/original
```

Sau khi submit bài, gắn ảnh vào check-in bằng metadata trong DB. Không nhất thiết phải move object ngay; có thể thiết kế `object_key` từ đầu theo `imageId`.

### Biến thể ảnh nên tạo

- `original`: file gốc đã sanitize, có thể giữ HEIC/JPEG/WebP tùy chính sách.
- `large`: max width 1600px, dùng cho màn hình detail.
- `medium`: max width 800px, dùng cho card/list.
- `thumbnail`: 320x320 crop/cover, dùng cho marker/list.

Khuyến nghị:

- Convert sang WebP/AVIF cho variant hiển thị.
- Giữ metadata EXIF ở mức tối thiểu; nên strip GPS EXIF để tránh lộ vị trí ngoài ý muốn.
- Giới hạn mỗi ảnh 10MB, mỗi bài 10 ảnh trong MVP.
- Validate MIME thực tế bằng file signature, không chỉ tin `Content-Type`.
- Dùng `blurhash` hoặc dominant color để hiển thị placeholder.

### Luồng upload đề xuất

MVP đơn giản:

1. Frontend upload ảnh lên `POST /api/images`.
2. Backend validate, resize bằng `sharp`, upload variants lên storage.
3. Backend tạo records `images` và `image_variants`.
4. Frontend tạo check-in với danh sách `imageIds`.

Khi scale:

1. Frontend xin presigned URL.
2. Frontend upload trực tiếp lên object storage.
3. Backend nhận callback/job để process variants.
4. Check-in chỉ publish khi ảnh `ready`.

## 7. API chính

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Users:

- `GET /api/me`
- `PATCH /api/me`
- `GET /api/users/:username`

Images:

- `POST /api/images`
- `DELETE /api/images/:id`

Check-ins:

- `POST /api/checkins`
- `GET /api/checkins/my`
- `GET /api/checkins/public`
- `GET /api/checkins/:id`
- `PATCH /api/checkins/:id`
- `DELETE /api/checkins/:id`

Map:

- `GET /api/map/my-checkins?bbox=minLng,minLat,maxLng,maxLat&from=&to=&categoryId=&moodId=`
- `GET /api/map/public-checkins?bbox=...`

Metadata:

- `GET /api/location-categories`
- `GET /api/moods`
- `GET /api/journal-prompts`

## 8. Query tối ưu cho bản đồ

Frontend bản đồ nên gửi viewport bounding box thay vì lấy tất cả marker nếu dữ liệu lớn.

Ví dụ:

```sql
SELECT
  c.id,
  c.title,
  c.location_name,
  c.latitude,
  c.longitude,
  c.checkin_time,
  c.category_id,
  c.mood_id,
  iv.object_key AS thumbnail_key
FROM checkins c
LEFT JOIN checkin_images ci
  ON ci.checkin_id = c.id AND ci.is_cover = TRUE
LEFT JOIN image_variants iv
  ON iv.image_id = ci.image_id AND iv.variant = 'thumbnail'
WHERE c.user_id = ?
  AND c.deleted_at IS NULL
  AND MBRContains(
    ST_SRID(ST_GeomFromText(?), 4326),
    c.location_point
  )
ORDER BY c.checkin_time DESC
LIMIT 500;
```

Nếu marker quá nhiều:

- Cluster ở frontend bằng Leaflet.markercluster hoặc `supercluster` khi số lượng marker tăng.
- Sau này có thể cluster server-side theo zoom level.
- Giới hạn số marker mỗi request và yêu cầu filter/zoom khi vượt ngưỡng.

## 9. Quyền riêng tư và bảo mật

- Mặc định `visibility = private`.
- Mỗi API check-in phải kiểm tra:
  - Chủ bài được xem/sửa/xóa.
  - Người khác chỉ xem được bài `public`.
- Không expose `object_key` private trực tiếp nếu storage public. Nên trả URL đã ký hoặc CDN URL ngắn hạn cho ảnh private.
- Hash password bằng Argon2id hoặc bcrypt với cost phù hợp.
- Refresh token lưu DB dưới dạng hash.
- Bật rate limit cho login, upload và forgot password.
- Strip EXIF GPS từ ảnh upload.
- Kiểm tra content type, kích thước, dimensions và file signature.
- Dùng CSRF protection nếu refresh token nằm trong cookie.

## 10. Cấu trúc frontend Next.js

```text
app/
  layout.jsx
  page.jsx
  checkins/
    page.jsx
    new/page.jsx
    [id]/page.jsx
  profile/
    page.jsx
components/
  app-shell.jsx
  checkin-card.jsx
  checkin-filters.jsx
  checkin-form-mock.jsx
  checkin-map.jsx
  map-section.jsx
  ui.jsx
lib/
  mock-data.js
  api/
  validation/
```

Component chính:

- `CheckinMap`: bản đồ Leaflet/OpenStreetMap, zoom/pan, marker ảnh, preview check-in.
- `CheckinForm`: upload ảnh, title, caption, location picker, category, mood, visibility.
- `LocationPicker`: GPS, search, drag marker.
- `ImageUploader`: preview, reorder, cover image.
- `CheckinList`: filter, sort, pagination/infinite scroll.
- `CheckinDetail`: gallery, mini map, metadata, actions.

Quy tắc rendering:

- Khi bật lại đăng nhập, các trang private như `/my-map`, `/checkins`, `/settings` cần kiểm tra session trước khi render.
- `CheckinMap` là Client Component và được dynamic import qua `map-section.jsx` vì Leaflet phụ thuộc `window`.
- Các trang public như `/profile/[username]` hoặc `/checkins/[id]` có thể SSR để tối ưu SEO nếu bài check-in public.
- Với dữ liệu private, tránh cache mặc định; dùng `cache: 'no-store'` hoặc request qua client sau khi xác thực.

### Ghi chú UI hiện tại

- Giao diện đang ưu tiên đơn giản, sáng và tươi: nền xanh mint nhạt, accent xanh lá, xanh trời, coral và vàng.
- Không dùng landing page; màn hình đầu tiên là bản đồ cá nhân.
- Bản đồ dùng Leaflet + OpenStreetMap, marker dùng ảnh thumbnail dạng `background-image` để tránh vỡ layout khi zoom.
- Form tạo check-in, danh sách, chi tiết và hồ sơ hiện là mock UI, chưa submit dữ liệu lên server.

## 11. Deployment đề xuất

MVP nhỏ:

- Frontend Next.js: Vercel là lựa chọn đơn giản nhất. Có thể dùng Netlify/Cloudflare Pages nếu kiểm tra kỹ tính năng SSR/runtime cần dùng.
- Backend: Render/Fly.io/Railway/VPS Docker.
- Database: Managed MySQL.
- Storage: Cloudflare R2 hoặc S3.
- CDN: Cloudflare.

Production tốt hơn:

- Dockerized Express API.
- MySQL managed with automated backup.
- Object storage private bucket.
- CDN public variants nếu visibility public; signed URL cho private.
- Logging: pino + centralized logs.
- Monitoring: uptime check, error tracking.

## 12. Những điểm nên quyết định sớm

1. Bản đồ: OpenStreetMap/Leaflet rẻ và đủ cho MVP, nhưng geocoding cần provider riêng. Google Maps/Mapbox tốt hơn về search địa điểm nhưng có chi phí.
2. Ảnh private: Nếu sản phẩm nhấn mạnh nhật ký cá nhân, nên thiết kế signed URL từ đầu.
3. SEO: Next.js giúp chuẩn bị tốt hơn cho profile public, check-in public và trang khám phá sau này. MVP vẫn nên giữ phạm vi app-first, không cần làm SEO phức tạp ngay.
4. Search địa điểm: MVP có thể dùng provider geocoding bên thứ ba, DB chỉ lưu kết quả đã chọn.
5. Social sau này: Nên để `visibility` đơn giản hiện tại, thêm `friendships/follows` và `visibility = friends` sau.

## 13. Lộ trình implementation MVP

1. Khởi tạo repo Next.js + Express + MySQL migration.
2. Làm auth và user profile.
3. Làm upload ảnh local dev + object storage abstraction.
4. Làm CRUD check-in với images, category, mood, privacy.
5. Làm map endpoint theo bbox và frontend marker clustering.
6. Làm list/detail/filter.
7. Thêm security hardening: rate limit, file validation, permission tests.
8. Thêm deployment config và backup DB.
