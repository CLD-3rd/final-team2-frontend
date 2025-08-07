// src/features/user/constants/travelTags.js
export const TravelTag = {
  // 성향
  IS_FRIENDLY: {
    key: "isFriendly",
    label: "🤝 새로운 사람과도 금방 친해져요",
    category: "personality",
  },
  IS_QUIET: {
    key: "isQuiet",
    label: "🤫 조용한 분위기를 좋아해요",
    category: "personality",
  },
  IS_LEAD: {
    key: "isLead",
    label: "🧭 앞장서서 리드하는 편이에요",
    category: "personality",
  },
  IS_PARTY: {
    key: "isParty",
    label: "😎 분위기를 띄우는 걸 좋아해요",
    category: "personality",
  },
  IS_SEARCH: {
    key: "isSearch",
    label: "🤓 여행 중에도 정보를 꼼꼼히 찾는 편이에요",
    category: "personality",
  },
  IS_LISTEN: {
    key: "isListen",
    label: "👂 다른 사람 의견을 잘 들어주는 편이에요",
    category: "personality",
  },

  // 활동
  IS_SEE: { key: "isSee", label: "🏞 자연 경관 감상", category: "activity" },
  IS_CAFE: { key: "isCafe", label: "🧘 카페/휴식", category: "activity" },
  IS_TASTE: { key: "isTaste", label: "🍽 맛집 탐방", category: "activity" },
  IS_PICTURE: { key: "isPicture", label: "📸 사진 촬영", category: "activity" },
  IS_SHOPPING: { key: "isShopping", label: "🛍 쇼핑", category: "activity" },
  IS_OUTDOOR: {
    key: "isOutdoor",
    label: "🏃 액티비티(서핑 등산 등)",
    category: "activity",
  },

  // 스타일
  IS_CHILL: {
    key: "isChill",
    label: "💤 느긋하게 여유롭게",
    category: "style",
  },
  IS_BUSY: { key: "isBusy", label: "🕘 빡빡하고 알차게", category: "style" },
  IS_FLEX: {
    key: "isFlex",
    label: "❔ 상황에 따라 유동적으로",
    category: "style",
  },

  // 음주
  IS_ALCHOL3: {
    key: "isAlchol3",
    label: "🍶 술 좋아해요",
    category: "drinking",
  },
  IS_ALCHOL2: {
    key: "isAlchol2",
    label: "🍻 분위기상 한두 잔 정도",
    category: "drinking",
  },
  IS_ALCHOL1: {
    key: "isAlchol1",
    label: "🚫 술은 즐기지 않아요",
    category: "drinking",
  },

  // 흡연
  IS_SMOKER2: { key: "isSmoker2", label: "🚬 흡연 해요", category: "smoking" },
  IS_SMOKER1: {
    key: "isSmoker1",
    label: "🚭 흡연하지 않아요",
    category: "smoking",
  },

  // 취향
  IS_CITY: {
    key: "isCity",
    label: "🌆 도시/핫플 위주",
    category: "destination",
  },
  IS_HEAL: {
    key: "isHeal",
    label: "🏞 자연/힐링 위주",
    category: "destination",
  },
  IS_BEACH: { key: "isBeach", label: "🏖 바다/해변", category: "destination" },
  IS_MOUNTAIN: {
    key: "isMountain",
    label: "🗻 산/등산",
    category: "destination",
  },
};

// 카테고리별 그룹핑
export const TRAVEL_TAG_GROUPS = {
  personality: Object.values(TravelTag).filter(
    (tag) => tag.category === "personality"
  ),
  activity: Object.values(TravelTag).filter(
    (tag) => tag.category === "activity"
  ),
  style: Object.values(TravelTag).filter((tag) => tag.category === "style"),
  drinking: Object.values(TravelTag).filter(
    (tag) => tag.category === "drinking"
  ),
  smoking: Object.values(TravelTag).filter((tag) => tag.category === "smoking"),
  destination: Object.values(TravelTag).filter(
    (tag) => tag.category === "destination"
  ),
};
