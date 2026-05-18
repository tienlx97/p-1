# AGENTS.md

Hướng dẫn này dành cho AI coding agents khi tạo, sửa hoặc refactor code trong repo này.

Repo dùng Next.js App Router với JavaScript/JSX. Source folder nằm ở root, không dùng `src/`.

Trước khi code, đọc thêm quy chuẩn chi tiết trong:

```txt
feature-based-structure.md
```

## Nguyên Tắc Chính

Code phải đi theo feature-based structure:

```txt
app/       Next.js routes, layout, global framework files
features/  UI và logic theo từng business feature
entities/  domain data/model/helper dùng chung giữa features
shared/    UI/helper/style generic, không mang business meaning
public/    static assets
DOCS/      tài liệu
```

Giữ route trong `app/` thật mỏng. Page chỉ nên import và compose component từ `features/`.

Ví dụ đúng:

```jsx
import { MemoryLibraryPage } from '@/features/memory'

export default function Page() {
  return <MemoryLibraryPage />
}
```

Không đặt business logic, form workflow, drawer state, map behavior, filter logic hoặc data transformation lớn trực tiếp trong `app/page.jsx`.

## Import Boundary

Được phép:

```txt
app -> features
app -> entities
app -> shared
features -> entities
features -> shared
entities -> shared
```

Không được:

```txt
shared -> features
shared -> app
entities -> features
entities -> app
features/a/components -> features/b/components
```

Khi cần dùng code từ feature khác, import qua public API:

```javascript
import { MemoryHoverPreview } from '@/features/memory'
```

Tránh import sâu từ internal folder của feature khác:

```javascript
import { MemoryHoverPreview } from '@/features/memory/components/memory-hover-preview'
```

## Khi Tạo Feature Mới

Tạo feature tối thiểu như sau:

```txt
features/[feature-name]/
├── components/
│   └── [feature-page].jsx
└── index.js
```

Chỉ thêm các folder sau khi có file thật cần dùng:

```txt
hooks/
api/
services/
schemas/
utils/
constants/
tests/
```

Không tạo folder rỗng theo template.

Sau khi tạo component public, export trong `features/[feature-name]/index.js`:

```javascript
export { ExamplePage } from './components/example-page'
```

## Khi Thêm Code Vào Feature Có Sẵn

Chọn đúng owner:

- Map, marker, Leaflet, map controls: `features/map`
- Memory/checkin library, detail, drawer, media viewer: `features/memory`
- Profile UI: `features/profile`
- Mock memory/checkin data hoặc domain helper dùng chung: `entities/memory`
- UI/helper generic không business-specific: `shared`

Nếu code chỉ phục vụ một feature, giữ trong feature đó.

Nếu code được nhiều feature dùng và có business meaning, cân nhắc đưa vào `entities/`.

Nếu code generic và không phụ thuộc business domain, đưa vào `shared/`.

## Naming

Repo hiện dùng:

```txt
.js / .jsx
kebab-case file names
PascalCase React components
camelCase functions/hooks
UPPER_SNAKE_CASE constants
```

Ví dụ:

```txt
memory-detail-page.jsx
map-section.jsx
map.utils.js
map.constants.js
```

Không thêm `.tsx` hoặc TypeScript syntax nếu chưa có yêu cầu migrate TypeScript.

## Styling

Styling hiện nằm ở:

```txt
app/globals.css
shared/styles/styles.module.css
shared/styles/partials/*.css
shared/styles/*.stylex.js
```

Giữ style generic trong `shared/styles`.

Style có business meaning hoặc chỉ dùng cho một feature thì đặt tên class rõ theo feature/UI area, không biến `shared` thành nơi chứa mọi thứ.

## Checklist Trước Khi Trả Lời

Trước final response, agent nên:

- Đọc file liên quan và `index.js` của feature.
- Giữ thay đổi nhỏ, đúng owner.
- Không revert thay đổi người dùng đã có trong working tree.
- Không tạo folder rỗng.
- Cập nhật public export nếu thêm component/hook public.
- Chạy check nếu phù hợp:

```txt
pnpm lint
pnpm type-check
```

Với thay đổi lớn liên quan route/build/runtime Next.js, chạy thêm:

```txt
pnpm build
```

## Quy Tắc Cuối

Feature-based structure là để dễ tìm code và rõ ownership, không phải để tạo nhiều folder.

Khi chưa chắc code nên đặt ở đâu, hãy giữ trong feature đang sở hữu hành vi đó trước. Chỉ move sang `entities/` hoặc `shared/` khi reuse thật sự rõ ràng.
