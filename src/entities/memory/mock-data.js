/**
 * @typedef {object} MemoryPerson
 * @property {string} id
 * @property {string} displayName
 * @property {string} avatar
 */

/**
 * @typedef {object} CoupleSpace
 * @property {string} name
 * @property {string} spaceName
 * @property {string} coverImage
 * @property {string} startDate
 * @property {MemoryPerson[]} people
 * @property {string} bio
 * @property {{ memories: number, places: number, photos: number, daysTogether: number }} stats
 */

/**
 * @typedef {object} MemoryCategory
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 * @property {string} color
 */

/**
 * @typedef {object} MemoryMood
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 */

/**
 * @typedef {object} MemoryMediaItem
 * @property {string} id
 * @property {"image" | "video"} type
 * @property {string} url
 * @property {string} [poster]
 * @property {string} [alt]
 */

/**
 * @typedef {object} MemoryCheckin
 * @property {string} id
 * @property {string} title
 * @property {string} caption
 * @property {string} locationName
 * @property {string} address
 * @property {string} googleMapsUrl
 * @property {string} city
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} categoryId
 * @property {string} moodId
 * @property {string} visibility
 * @property {string} checkinTime
 * @property {string} createdBy
 * @property {string[]} images
 * @property {MemoryMediaItem[]} [media]
 * @property {number} [rating]
 * @property {{ x: number, y: number }} [mapPosition]
 */

/**
 * @typedef {object} MediaSummary
 * @property {number} total
 * @property {number} photos
 * @property {number} videos
 */

/** @type {CoupleSpace} */
export const coupleSpace = {
  name: "Minh & An",
  spaceName: "Kỷ niệm của chúng mình",
  coverImage:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
  startDate: "2024-02-14",
  people: [
    {
      id: "u-minh",
      displayName: "Minh",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: "u-an",
      displayName: "An",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
    }
  ],
  bio: "Một nơi riêng để lưu ảnh, ngày, ghi chú và những địa điểm hai đứa đã đi qua.",
  stats: {
    memories: 48,
    places: 36,
    photos: 126,
    daysTogether: 821
  }
};

export const profile = {
  fullName: coupleSpace.spaceName,
  username: "minh-an",
  avatar: coupleSpace.coverImage,
  bio: coupleSpace.bio,
  stats: {
    checkins: coupleSpace.stats.memories,
    places: coupleSpace.stats.places,
    cities: 8,
    photos: coupleSpace.stats.photos
  }
};

/** @type {MemoryCategory[]} */
export const categories = [
  { id: "coffee", name: "Quán quen", slug: "coffee", icon: "Cafe", color: "#2f7d6f" },
  { id: "food", name: "Bữa ăn", slug: "food", icon: "Meal", color: "#d9654f" },
  { id: "home", name: "Nhà", slug: "home", icon: "Home", color: "#e83f72" },
  { id: "travel", name: "Chuyến đi", slug: "travel", icon: "Trip", color: "#6e63b6" },
  { id: "beach", name: "Biển", slug: "beach", icon: "Sea", color: "#2b8fb8" },
  { id: "mountain", name: "Cột mốc", slug: "mountain", icon: "Milestone", color: "#5e8f4f" },
  { id: "culture", name: "Dạo phố", slug: "culture", icon: "Street", color: "#c28b25" }
];

/** @type {MemoryMood[]} */
export const moods = [
  { id: "happy", name: "Vui", slug: "happy", icon: "Smile" },
  { id: "chill", name: "Nhẹ nhàng", slug: "chill", icon: "Calm" },
  { id: "peaceful", name: "Bình yên", slug: "peaceful", icon: "Moon" },
  { id: "memorable", name: "Đáng nhớ", slug: "memorable", icon: "Star" },
  { id: "romantic", name: "Lãng mạn", slug: "romantic", icon: "Heart" },
  { id: "explore", name: "Mới mẻ", slug: "explore", icon: "Compass" }
];

export const journalPrompts = [
  "Điều gì làm nơi này đáng nhớ?",
  "Khoảnh khắc nào muốn giữ lại?",
  "Hai đứa đã nói gì lúc đó?",
  "Có muốn quay lại nơi này không?",
  "Mùi vị, ánh sáng hay âm thanh nào còn nhớ?",
  "Nếu đặt tên cho ngày đó thì là gì?"
];

/** @type {MemoryCheckin[]} */
export const checkins = [
  {
    id: "ck-home-me",
    title: "Nhà của tôi",
    caption:
      "Điểm bắt đầu quen thuộc cho những cuộc hẹn, những lần chuẩn bị thật lâu và cả những tối chỉ muốn ở yên trong nhà.",
    locationName: "Nhà của tôi",
    address: "Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://www.google.com/maps/place/Anh+T%C3%BA+Coffee/@10.8058992,106.5937661,15z/data=!4m6!3m5!1s0x31752b000e728eed:0x6b57ed12db6141cc!8m2!3d10.8052243!4d106.589173!16s%2Fg%2F11vtbpmzhf!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
    city: "Hồ Chí Minh",
    latitude: 10.805_224_3,
    longitude: 106.589_173,
    categoryId: "home",
    moodId: "peaceful",
    visibility: "private",
    checkinTime: "2026-05-01T20:00:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-home-crush",
    title: "Nhà của crush",
    caption:
      "Một địa điểm riêng tư và đáng nhớ, nơi mỗi lần đi ngang qua đều tự nhiên chậm lại thêm một chút.",
    locationName: "Nhà của crush",
    address: "Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.8012,106.7121",
    city: "Hồ Chí Minh",
    latitude: 10.8012,
    longitude: 106.7121,
    categoryId: "home",
    moodId: "romantic",
    visibility: "private",
    checkinTime: "2026-05-02T19:30:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 55, y: 57 }
  },
  {
    id: "ck-001",
    title: "Du thuyền giữa Vịnh Hạ Long",
    caption:
      "Mặt nước xanh ngọc, những dãy núi đá vôi nổi lên rất gần. Đây là điểm demo lớn để kiểm tra pin, label và mật độ địa điểm trên bản đồ.",
    locationName: "Vịnh Hạ Long",
    address: "Thành phố Hạ Long, Quảng Ninh",
    googleMapsUrl: "https://maps.google.com/?q=20.9101,107.1839",
    city: "Quảng Ninh",
    latitude: 20.9101,
    longitude: 107.1839,
    categoryId: "travel",
    moodId: "explore",
    visibility: "private",
    checkinTime: "2026-04-27T08:30:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-001-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        alt: "Tách cà phê buổi sáng"
      },
      {
        id: "ck-001-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80",
        alt: "Góc quán yên tĩnh"
      },
      {
        id: "ck-001-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/6602331/",
        alt: "Cận cảnh tách cà phê trong quán"
      }
    ],
    mapPosition: { x: 45, y: 34 }
  },
  {
    id: "ck-002",
    title: "Ngồi thuyền qua Tràng An",
    caption:
      "Các hang nước và núi đá nối nhau thành một tuyến dài, rất hợp để kiểm tra nhiều pin trải rộng ngoài Thành phố Hồ Chí Minh.",
    locationName: "Quần thể danh thắng Tràng An",
    address: "Tràng An, Ninh Bình",
    googleMapsUrl: "https://maps.google.com/?q=20.2503,105.9186",
    city: "Ninh Bình",
    latitude: 20.2503,
    longitude: 105.9186,
    categoryId: "travel",
    moodId: "peaceful",
    visibility: "private",
    checkinTime: "2026-05-09T15:20:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-002-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn cà phê cạnh cửa sổ sau mưa"
      },
      {
        id: "ck-002-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        alt: "Ly cà phê và bánh ngọt"
      },
      {
        id: "ck-002-img-3",
        type: "image",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        alt: "Cà phê nóng trên bàn gỗ"
      },
      {
        id: "ck-002-img-4",
        type: "image",
        url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80",
        alt: "Góc ngồi yên tĩnh trong quán"
      },
      {
        id: "ck-002-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/6602331/",
        alt: "Cà phê đang được pha"
      },
      {
        id: "ck-002-img-5",
        type: "image",
        url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian quán cà phê buổi chiều"
      },
      {
        id: "ck-002-img-6",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn nhỏ cạnh cửa sổ"
      },
      {
        id: "ck-002-img-7",
        type: "image",
        url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
        alt: "Quầy cà phê với ánh sáng ấm"
      },
      {
        id: "ck-002-img-8",
        type: "image",
        url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
        alt: "Ly cà phê trên nền gỗ"
      },
      {
        id: "ck-002-video-2",
        type: "video",
        url: "https://www.pexels.com/download/video/856973/",
        alt: "Ánh đèn trong quán cà phê"
      },
      {
        id: "ck-002-img-9",
        type: "image",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
        alt: "Cận cảnh latte art"
      },
      {
        id: "ck-002-img-10",
        type: "image",
        url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        alt: "Bên trong quán cà phê"
      },
      {
        id: "ck-002-img-11",
        type: "image",
        url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80",
        alt: "Cà phê và sổ tay"
      },
      {
        id: "ck-002-img-12",
        type: "image",
        url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
        alt: "Hạt cà phê rang"
      },
      {
        id: "ck-002-video-3",
        type: "video",
        url: "https://www.pexels.com/download/video/4828605/",
        alt: "Rót cà phê vào ly"
      },
      {
        id: "ck-002-img-13",
        type: "image",
        url: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=1200&q=80",
        alt: "Góc bàn có hoa nhỏ"
      },
      {
        id: "ck-002-img-14",
        type: "image",
        url: "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1200&q=80",
        alt: "Ly cà phê bên cửa kính"
      },
      {
        id: "ck-002-img-15",
        type: "image",
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán cà phê xanh mát"
      },
      {
        id: "ck-002-img-16",
        type: "image",
        url: "https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?auto=format&fit=crop&w=1200&q=80",
        alt: "Bánh ngọt và cà phê"
      },
      {
        id: "ck-002-img-17",
        type: "image",
        url: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80",
        alt: "Cốc cà phê buổi chiều"
      }
    ],
    mapPosition: { x: 45, y: 34 }
  },
  {
    id: "ck-003",
    title: "Đi bộ trong Đại Nội Huế",
    caption:
      "Tường thành, cổng Ngọ Môn và các trục sân rộng giúp mockup có một điểm văn hóa lớn ở miền Trung để kiểm tra nhãn địa điểm.",
    locationName: "Đại Nội Huế",
    address: "Phú Hậu, Thành phố Huế, Thừa Thiên Huế",
    googleMapsUrl: "https://maps.google.com/?q=16.4691,107.5774",
    city: "Huế",
    latitude: 16.4691,
    longitude: 107.5774,
    categoryId: "culture",
    moodId: "romantic",
    visibility: "private",
    checkinTime: "2026-03-02T19:05:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-003-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán cà phê ánh đèn vàng"
      },
      {
        id: "ck-003-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn nhỏ trong quán buổi tối"
      },
      {
        id: "ck-003-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/856973/",
        alt: "Ánh đèn trong quán cà phê"
      }
    ],
    mapPosition: { x: 45, y: 34 }
  },
  {
    id: "ck-004",
    title: "Hoàng hôn trên biển Mỹ Khê",
    caption:
      "Một bãi biển lớn ở Đà Nẵng, dễ nhận diện trên bản đồ và hữu ích để kiểm tra pin gần đường bờ biển.",
    locationName: "Bãi biển Mỹ Khê",
    address: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    googleMapsUrl: "https://maps.google.com/?q=16.0613,108.247",
    city: "Đà Nẵng",
    latitude: 16.0613,
    longitude: 108.247,
    categoryId: "beach",
    moodId: "happy",
    visibility: "private",
    checkinTime: "2026-04-12T17:45:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-004-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        alt: "Bãi biển lúc hoàng hôn"
      },
      {
        id: "ck-004-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        alt: "Sóng biển gần bờ"
      },
      {
        id: "ck-004-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/8094133/",
        alt: "Sóng biển gần bờ"
      }
    ],
    mapPosition: { x: 63, y: 66 }
  },
  {
    id: "ck-005",
    title: "Ăn vặt quanh Chợ Bến Thành",
    caption:
      "Một điểm du lịch trung tâm, nhiều đường bao quanh nên rất hợp để kiểm tra pin và label ở khu vực dày chi tiết.",
    locationName: "Chợ Bến Thành",
    address: "Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7725,106.698",
    city: "Hồ Chí Minh",
    latitude: 10.7725,
    longitude: 106.698,
    categoryId: "food",
    moodId: "memorable",
    visibility: "private",
    checkinTime: "2026-03-30T19:10:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn ăn trong quán nhỏ"
      },
      {
        id: "ck-005-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian quán ăn đông khách"
      },
      {
        id: "ck-005-img-3",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn nhỏ cạnh cửa trong quán"
      },
      {
        id: "ck-005-img-4",
        type: "image",
        url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
        alt: "Mọi người ăn tối trong nhà hàng"
      },
      {
        id: "ck-005-img-5",
        type: "image",
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        alt: "Bữa ăn tối cùng nhau"
      },
      {
        id: "ck-005-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/854135/",
        alt: "Không khí quán ăn buổi tối"
      },
      {
        id: "ck-005-video-2",
        type: "video",
        url: "https://www.pexels.com/download/video/3195650/",
        alt: "Món ăn được dọn lên bàn"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-005b",
    title: "Xem lại lịch sử ở Bảo tàng Chứng tích Chiến tranh",
    caption:
      "Một điểm tham quan nổi bật trong trung tâm thành phố, đủ gần các pin khác để kiểm tra label khi zoom in/out.",
    locationName: "Bảo tàng Chứng tích Chiến tranh",
    address: "28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7795,106.692",
    city: "Hồ Chí Minh",
    latitude: 10.7795,
    longitude: 106.692,
    categoryId: "culture",
    moodId: "chill",
    visibility: "private",
    checkinTime: "2026-03-12T18:45:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005b-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
        alt: "Bữa tối đông vui trong quán"
      },
      {
        id: "ck-005b-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn ăn có nhiều món"
      },
      {
        id: "ck-005b-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/854135/",
        alt: "Quán ăn lúc lên đèn"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-005c",
    title: "Ghé Dinh Độc Lập buổi trưa",
    caption:
      "Khoảng sân và các trục đường quanh dinh giúp vị trí rất dễ kiểm tra trên nền bản đồ chi tiết.",
    locationName: "Dinh Độc Lập",
    address: "135 Nam Kỳ Khởi Nghĩa, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7771,106.6954",
    city: "Hồ Chí Minh",
    latitude: 10.7771,
    longitude: 106.6954,
    categoryId: "culture",
    moodId: "happy",
    visibility: "private",
    checkinTime: "2026-02-21T12:20:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005c-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán ăn buổi trưa"
      },
      {
        id: "ck-005c-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian nhà hàng ấm cúng"
      },
      {
        id: "ck-005c-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/3195650/",
        alt: "Món ăn trên bàn"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-005d",
    title: "Một buổi sáng ở Địa đạo Củ Chi",
    caption:
      "Điểm nằm xa trung tâm thành phố, giúp kiểm tra fit bounds và hành vi pin khi bản đồ kéo ra vùng rộng hơn.",
    locationName: "Địa đạo Củ Chi",
    address: "Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=11.1426,106.4624",
    city: "Hồ Chí Minh",
    latitude: 11.1426,
    longitude: 106.4624,
    categoryId: "culture",
    moodId: "explore",
    visibility: "private",
    checkinTime: "2026-01-18T19:25:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005d-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn ăn tối trong quán nhỏ"
      },
      {
        id: "ck-005d-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian quán ăn ấm cúng"
      },
      {
        id: "ck-005d-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/3195650/",
        alt: "Món ăn nóng được dọn lên bàn"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-005e",
    title: "Dạo quanh Nhà thờ Đức Bà Sài Gòn",
    caption:
      "Một mốc rất quen ở trung tâm Quận 1, gần Bưu điện và Dinh Độc Lập để test các label sát nhau.",
    locationName: "Nhà thờ Đức Bà Sài Gòn",
    address: "Công xã Paris, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7798,106.699",
    city: "Hồ Chí Minh",
    latitude: 10.7798,
    longitude: 106.699,
    categoryId: "culture",
    moodId: "happy",
    visibility: "private",
    checkinTime: "2025-12-04T20:05:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005e-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        alt: "Bữa tối cùng nhau"
      },
      {
        id: "ck-005e-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán ăn đông khách buổi tối"
      },
      {
        id: "ck-005e-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/854135/",
        alt: "Không khí quán ăn lúc tối"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-005f",
    title: "Chụp ảnh trước Bưu điện Trung tâm Sài Gòn",
    caption:
      "Một điểm kiến trúc nổi bật nằm ngay cạnh Nhà thờ Đức Bà, hữu ích để kiểm tra label khi pin gần nhau.",
    locationName: "Bưu điện Trung tâm Sài Gòn",
    address: "2 Công xã Paris, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7799,106.7001",
    city: "Hồ Chí Minh",
    latitude: 10.7799,
    longitude: 106.7001,
    categoryId: "culture",
    moodId: "memorable",
    visibility: "private",
    checkinTime: "2025-10-26T18:50:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-005f-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
        alt: "Nhóm bạn ăn tối trong quán"
      },
      {
        id: "ck-005f-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        alt: "Bàn ăn cạnh cửa trong quán"
      },
      {
        id: "ck-005f-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/3195650/",
        alt: "Các món ăn trên bàn"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-009",
    title: "Đi bộ quanh Hồ Hoàn Kiếm",
    caption:
      "Hồ ở trung tâm Hà Nội, dễ nhận biết và là điểm tốt để kiểm tra label địa danh ở miền Bắc.",
    locationName: "Hồ Hoàn Kiếm",
    address: "Hoàn Kiếm, Hà Nội",
    googleMapsUrl: "https://maps.google.com/?q=21.0287,105.8523",
    city: "Hà Nội",
    latitude: 21.0287,
    longitude: 105.8523,
    categoryId: "culture",
    moodId: "peaceful",
    visibility: "private",
    checkinTime: "2026-05-11T08:15:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-009-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
        alt: "Ly cà phê buổi sáng"
      },
      {
        id: "ck-009-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian cà phê ở trung tâm"
      },
      {
        id: "ck-009-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/4828605/",
        alt: "Rót cà phê vào ly"
      }
    ],
    mapPosition: { x: 55, y: 58 }
  },
  {
    id: "ck-010",
    title: "Chiều ở Văn Miếu Quốc Tử Giám",
    caption:
      "Một điểm di tích lớn của Hà Nội, đặt gần Hồ Hoàn Kiếm để test cụm pin trong cùng thành phố.",
    locationName: "Văn Miếu Quốc Tử Giám",
    address: "58 Quốc Tử Giám, Đống Đa, Hà Nội",
    googleMapsUrl: "https://maps.google.com/?q=21.028,105.8355",
    city: "Hà Nội",
    latitude: 21.028,
    longitude: 105.8355,
    categoryId: "culture",
    moodId: "chill",
    visibility: "private",
    checkinTime: "2026-05-04T16:30:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-010-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
        alt: "Góc phố trung tâm thành phố"
      },
      {
        id: "ck-010-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
        alt: "Ánh đèn thành phố buổi chiều"
      }
    ],
    mapPosition: { x: 55, y: 57 }
  },
  {
    id: "ck-011",
    title: "Đi qua Cầu Vàng Bà Nà Hills",
    caption:
      "Điểm du lịch nổi tiếng trên núi ở Đà Nẵng, tạo khoảng cách tốt với các pin trung tâm thành phố.",
    locationName: "Cầu Vàng Bà Nà Hills",
    address: "Bà Nà Hills, Hòa Vang, Đà Nẵng",
    googleMapsUrl: "https://maps.google.com/?q=15.995,107.996",
    city: "Đà Nẵng",
    latitude: 15.995,
    longitude: 107.996,
    categoryId: "travel",
    moodId: "explore",
    visibility: "private",
    checkinTime: "2026-04-25T15:45:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-011-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán cà phê xanh mát"
      },
      {
        id: "ck-011-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?auto=format&fit=crop&w=1200&q=80",
        alt: "Bánh ngọt và cà phê"
      },
      {
        id: "ck-011-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/856973/",
        alt: "Ánh đèn trong quán cà phê"
      }
    ],
    mapPosition: { x: 57, y: 57 }
  },
  {
    id: "ck-012",
    title: "Xem cầu Rồng lên đèn",
    caption:
      "Cầu nằm giữa trung tâm Đà Nẵng, rất hợp để kiểm tra marker trên các tuyến đường và sông.",
    locationName: "Cầu Rồng Đà Nẵng",
    address: "Cầu Rồng, Hải Châu, Đà Nẵng",
    googleMapsUrl: "https://maps.google.com/?q=16.061,108.227",
    city: "Đà Nẵng",
    latitude: 16.061,
    longitude: 108.227,
    categoryId: "culture",
    moodId: "romantic",
    visibility: "private",
    checkinTime: "2026-04-18T17:50:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-012-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        alt: "Hoàng hôn trên phố"
      },
      {
        id: "ck-012-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&w=1200&q=80",
        alt: "Khung cảnh nhìn qua cửa sổ"
      }
    ],
    mapPosition: { x: 55, y: 59 }
  },
  {
    id: "ck-013",
    title: "Ăn kem ở Hồ Con Rùa",
    caption:
      "Một điểm vòng xoay quen thuộc trong trung tâm Sài Gòn, giữ lại để kiểm tra label ngắn hai dòng.",
    locationName: "Hồ Con Rùa",
    address: "Công trường Quốc tế, Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7827,106.6953",
    city: "Hồ Chí Minh",
    latitude: 10.7827,
    longitude: 106.6953,
    categoryId: "food",
    moodId: "happy",
    visibility: "private",
    checkinTime: "2026-04-06T20:25:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-013-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
        alt: "Món tráng miệng buổi tối"
      },
      {
        id: "ck-013-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        alt: "Quán ăn ánh đèn ấm"
      },
      {
        id: "ck-013-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/3195650/",
        alt: "Món ăn được dọn lên"
      }
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-006",
    title: "Phố cổ Hội An lên đèn",
    caption:
      "Một điểm du lịch lớn và dễ nhận diện, tốt để kiểm tra pin ở miền Trung khi zoom toàn quốc.",
    locationName: "Phố cổ Hội An",
    address: "Phường Minh An, Hội An, Quảng Nam",
    googleMapsUrl: "https://maps.google.com/?q=15.8801,108.338",
    city: "Hội An",
    latitude: 15.8801,
    longitude: 108.338,
    categoryId: "culture",
    moodId: "romantic",
    visibility: "private",
    checkinTime: "2026-02-18T18:20:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 58, y: 42 }
  },
  {
    id: "ck-007",
    title: "Lên đỉnh Núi Bà Đen",
    caption:
      "Một điểm du lịch lớn ở Tây Ninh, cách xa trung tâm để kiểm tra hành vi fit bounds của bản đồ.",
    locationName: "Núi Bà Đen",
    address: "Thạnh Tân, Tây Ninh",
    googleMapsUrl: "https://maps.google.com/?q=11.38238,106.17022",
    city: "Tây Ninh",
    latitude: 11.382_38,
    longitude: 106.170_22,
    categoryId: "mountain",
    moodId: "explore",
    visibility: "private",
    checkinTime: "2026-01-09T06:15:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 38, y: 55 }
  },
  {
    id: "ck-008",
    title: "Thăm Tháp Bà Ponagar",
    caption:
      "Một điểm văn hóa lớn ở Nha Trang, bổ sung pin ven biển Nam Trung Bộ để bản đồ demo cân hơn.",
    locationName: "Tháp Bà Ponagar",
    address: "2 Tháng 4, Vĩnh Phước, Nha Trang, Khánh Hòa",
    googleMapsUrl: "https://maps.google.com/?q=12.2654,109.195",
    city: "Nha Trang",
    latitude: 12.2654,
    longitude: 109.195,
    categoryId: "culture",
    moodId: "chill",
    visibility: "private",
    checkinTime: "2025-12-22T16:40:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 68, y: 47 }
  }
];

/**
 * @param {string} id
 * @returns {MemoryCategory}
 */
export function getCategory(id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

/**
 * @param {string} id
 * @returns {MemoryMood}
 */
export function getMood(id) {
  return moods.find((mood) => mood.id === id) ?? moods[0];
}

/**
 * @param {MemoryCheckin} checkin
 * @returns {MemoryMediaItem[]}
 */
export function getMemoryMedia(checkin) {
  if (Array.isArray(checkin.media) && checkin.media.length > 0) {
    return checkin.media;
  }

  return checkin.images.map((image, index) => ({
    id: `${checkin.id}-image-${index + 1}`,
    type: "image",
    url: image,
    alt: checkin.title
  }));
}

/**
 * @param {MemoryCheckin} checkin
 * @returns {MemoryMediaItem | undefined}
 */
export function getCoverMedia(checkin) {
  const media = getMemoryMedia(checkin);
  return media.find((item) => item.type === "image") ?? media[0];
}

/**
 * @param {MemoryCheckin} checkin
 * @returns {string | undefined}
 */
export function getCoverImage(checkin) {
  const cover = getCoverMedia(checkin);
  return cover?.type === "video" ? cover.poster : cover?.url;
}

/**
 * @param {MemoryCheckin} checkin
 * @returns {MediaSummary}
 */
export function getMediaSummary(checkin) {
  const media = getMemoryMedia(checkin);
  const photos = media.filter((item) => item.type === "image").length;
  const videos = media.filter((item) => item.type === "video").length;

  return { total: media.length, photos, videos };
}

/**
 * @param {MemoryCheckin} checkin
 * @returns {number}
 */
export function getMemoryRating(checkin) {
  if (Number.isInteger(checkin.rating)) {
    return Math.min(5, Math.max(1, checkin.rating));
  }

  const daySeed = new Date(checkin.checkinTime).getDate() + checkin.id.length;
  return (daySeed % 5) + 1;
}

/**
 * @param {string | number | Date} value
 * @returns {string}
 */
export function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
