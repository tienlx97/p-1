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

export const categories = [
  { id: "coffee", name: "Quán quen", slug: "coffee", icon: "Cafe", color: "#2f7d6f" },
  { id: "food", name: "Bữa ăn", slug: "food", icon: "Meal", color: "#d9654f" },
  { id: "home", name: "Nhà", slug: "home", icon: "Home", color: "#e83f72" },
  { id: "travel", name: "Chuyến đi", slug: "travel", icon: "Trip", color: "#6e63b6" },
  { id: "beach", name: "Biển", slug: "beach", icon: "Sea", color: "#2b8fb8" },
  { id: "mountain", name: "Cột mốc", slug: "mountain", icon: "Milestone", color: "#5e8f4f" },
  { id: "culture", name: "Dạo phố", slug: "culture", icon: "Street", color: "#c28b25" }
];

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

export const checkins = [
  {
    id: "ck-home-me",
    title: "Nhà của tôi",
    caption:
      "Điểm bắt đầu quen thuộc cho những cuộc hẹn, những lần chuẩn bị thật lâu và cả những tối chỉ muốn ở yên trong nhà.",
    locationName: "Nhà của tôi",
    address: "Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7769,106.7009",
    city: "Hồ Chí Minh",
    latitude: 10.7769,
    longitude: 106.7009,
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
    title: "Sáng cuối tuần ở Đà Lạt",
    caption:
      "Trời se lạnh, quán nằm trên dốc nhỏ và có mùi thông ướt sau cơn mưa. Hai đứa ngồi rất lâu chỉ để nghe tiếng máy pha cà phê.",
    locationName: "Kokoro Cafe",
    address: "45 Đặng Thái Thân, Phường 3, Đà Lạt",
    googleMapsUrl: "https://maps.google.com/?q=11.9365,108.4419",
    city: "Đà Lạt",
    latitude: 11.9365,
    longitude: 108.4419,
    categoryId: "coffee",
    moodId: "peaceful",
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
    title: "Quay lại Kokoro sau cơn mưa",
    caption:
      "Lần này tụi mình ngồi ở bàn cạnh cửa sổ. Mưa vừa tạnh, kính còn đọng nước và món bánh chanh hôm đó ngon hơn mọi lần.",
    locationName: "Kokoro Cafe",
    address: "45 Đặng Thái Thân, Phường 3, Đà Lạt",
    googleMapsUrl: "https://maps.google.com/?q=11.9368,108.4422",
    city: "Đà Lạt",
    latitude: 11.9368,
    longitude: 108.4422,
    categoryId: "coffee",
    moodId: "chill",
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
    title: "Một tối đèn vàng ở Kokoro",
    caption:
      "Buổi tối quán bật nhạc rất nhỏ. Hai đứa chỉ gọi một bình trà nóng, đọc lại vài tấm ảnh cũ và nhận ra nơi này đã thành điểm hẹn quen.",
    locationName: "Kokoro Cafe",
    address: "45 Đặng Thái Thân, Phường 3, Đà Lạt",
    googleMapsUrl: "https://maps.google.com/?q=11.9363,108.4416",
    city: "Đà Lạt",
    latitude: 11.9363,
    longitude: 108.4416,
    categoryId: "coffee",
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
    title: "Hoàng hôn trên Bãi Sau",
    caption:
      "Biển động nhẹ, trời vàng rất chậm. Hai đứa đi bộ dọc bờ kè và chụp được tấm ảnh vẫn còn thích đến giờ.",
    locationName: "Bãi Sau",
    address: "Thùy Vân, Thành phố Vũng Tàu",
    googleMapsUrl: "https://maps.google.com/?q=10.3347,107.0886",
    city: "Vũng Tàu",
    latitude: 10.3347,
    longitude: 107.0886,
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
    title: "Cơm tối trong hẻm nhỏ",
    caption:
      "Một bữa tối rất đời thường nhưng đáng nhớ vì món nào cũng vừa miệng. Quán đông, tụi mình ngồi sát cửa và nói chuyện rất lâu.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.7829,
    longitude: 106.6865,
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
    title: "Quay lại ăn món quen",
    caption:
      "Lần này tụi mình gọi lại mấy món cũ, thêm một đĩa rau xào và ngồi đúng chiếc bàn sát cửa như lần trước.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.7827,
    longitude: 106.6867,
    categoryId: "food",
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
    title: "Bữa trưa ghé vội",
    caption:
      "Một buổi trưa ghé nhanh nhưng vẫn kịp chụp vài tấm ảnh. Trời nóng, ly trà đá hôm đó ngon bất ngờ.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.7831,
    longitude: 106.6864,
    categoryId: "food",
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
    title: "Tối mưa gọi thêm canh nóng",
    caption:
      "Mưa rơi đúng lúc vừa bước vào hẻm. Tụi mình gọi thêm một tô canh nóng, ngồi nép bên trong và nghe tiếng xe chạy qua ngoài cửa.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.7828,
    longitude: 106.6866,
    categoryId: "food",
    moodId: "peaceful",
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
    title: "Sinh nhật muộn ở bàn sát cửa",
    caption:
      "Không đặt trước gì cả, chỉ có một phần cơm, một đĩa đồ xào và lời chúc sinh nhật muộn. Vậy mà tối đó lại vui hơn dự tính.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.783,
    longitude: 106.6865,
    categoryId: "food",
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
    title: "Lần đầu dẫn bạn ghé quán",
    caption:
      "Tụi mình dẫn thêm bạn tới ăn thử món quen. Bàn hơi chật, ai cũng phải chuyền đũa và chén qua tay nhau nhưng không khí rất vui.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7829,106.6865",
    city: "Hồ Chí Minh",
    latitude: 10.7826,
    longitude: 106.6863,
    categoryId: "food",
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
    title: "Cà phê sáng ở Nguyễn Huệ",
    caption:
      "Sáng hôm đó phố đi bộ còn khá vắng. Tụi mình ngồi nhìn nắng rơi xuống hàng cây, uống cà phê chậm hơn mọi ngày.",
    locationName: "Phố đi bộ Nguyễn Huệ",
    address: "Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7753,106.7039",
    city: "Hồ Chí Minh",
    latitude: 10.7753,
    longitude: 106.7039,
    categoryId: "coffee",
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
    title: "Dạo quanh Nhà thờ Đức Bà",
    caption:
      "Một vòng đi bộ ngắn qua bưu điện, nhà thờ và mấy con đường rợp cây. Hai đứa không vội, chỉ dừng lại chụp vài tấm ảnh.",
    locationName: "Nhà thờ Đức Bà Sài Gòn",
    address: "Công xã Paris, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7798,106.6990",
    city: "Hồ Chí Minh",
    latitude: 10.7798,
    longitude: 106.699,
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
    title: "Chiều gió ở Thảo Điền",
    caption:
      "Quán nằm trong con hẻm yên, có cây xanh và gió từ sông thổi qua. Tụi mình gọi bánh ngọt rồi ngồi đọc sách một lúc.",
    locationName: "Thảo Điền",
    address: "Thảo Điền, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.8044,106.7356",
    city: "Hồ Chí Minh",
    latitude: 10.8044,
    longitude: 106.7356,
    categoryId: "coffee",
    moodId: "peaceful",
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
    title: "Xem hoàng hôn ở cầu Mống",
    caption:
      "Trời chuyển màu rất nhanh. Hai đứa đứng trên cầu nhìn xe chạy bên dưới, rồi đi bộ thêm một đoạn về phía bờ sông.",
    locationName: "Cầu Mống",
    address: "Cầu Mống, Quận 1, Thành phố Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=10.7682,106.7001",
    city: "Hồ Chí Minh",
    latitude: 10.7682,
    longitude: 106.7001,
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
    title: "Kem tối ở Hồ Con Rùa",
    caption:
      "Một tối không có kế hoạch trước. Tụi mình mua kem, ngồi quanh hồ một lúc rồi nói chuyện linh tinh đến khuya.",
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
    title: "Ngày đầu tiên ở Hội An",
    caption:
      "Phố cổ lên đèn sớm, mọi thứ chuyển sang màu ấm. Tụi mình thích nhất lúc đi qua cầu và nghe tiếng guốc trên nền gạch.",
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
    title: "Leo núi nhẹ ở Bà Đen",
    caption:
      "Chuyến đi bắt đầu khá sớm. Lên đến điểm ngắm cảnh thì mây tan dần, nhìn xuống đồng bằng thấy mọi mệt mỏi đều đáng.",
    locationName: "Núi Bà Đen",
    address: "Thạnh Tân, Tây Ninh",
    googleMapsUrl: "https://maps.google.com/?q=11.3701,106.1668",
    city: "Tây Ninh",
    latitude: 11.3701,
    longitude: 106.1668,
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
    title: "Cuối ngày trên tàu",
    caption:
      "Một chuyến đi ngắn nhưng có cảm giác như đổi gió thật sự. Ảnh chụp qua cửa sổ tàu bị nhiều hạt mưa bám vào.",
    locationName: "Ga Nha Trang",
    address: "17 Thái Nguyên, Nha Trang, Khánh Hòa",
    googleMapsUrl: "https://maps.google.com/?q=12.2451,109.1943",
    city: "Nha Trang",
    latitude: 12.2451,
    longitude: 109.1943,
    categoryId: "travel",
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

export function getCategory(id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

export function getMood(id) {
  return moods.find((mood) => mood.id === id) ?? moods[0];
}

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

export function getCoverMedia(checkin) {
  const media = getMemoryMedia(checkin);
  return media.find((item) => item.type === "image") ?? media[0];
}

export function getCoverImage(checkin) {
  const cover = getCoverMedia(checkin);
  return cover?.type === "video" ? cover.poster : cover?.url;
}

export function getMediaSummary(checkin) {
  const media = getMemoryMedia(checkin);
  const photos = media.filter((item) => item.type === "image").length;
  const videos = media.filter((item) => item.type === "video").length;

  return { total: media.length, photos, videos };
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
