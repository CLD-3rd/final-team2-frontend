// 유저 정보 DTO 변환
export const parseUserInfoResponse = (rawData) => {
  if (!rawData || !rawData.content) {
    return {
      username: "알 수 없음",
      profileImage: "/images/user-profile.jpg",
    };
  }
  const { nickname, profileImageUrl } = rawData.content;
  return {
    username: nickname,
    profileImage: profileImageUrl,
  };
};

export const parseUserReviewResponse = (data) => {
    if (!data || !data.content) return { rating: 0, reviewCount: 0 };
    const { average_rating, total_reviews } = data.content;
    return {
      rating: average_rating,
      reviewCount: total_reviews,
    };
  };
  

  // src/user/userDto.js
export const parseUserBadgeResponse = (rawData) => {
  const { badges } = rawData.content;
  return badges.map((badge) => badge.name); 
  // 현재는 뱃지 이름만 추출해서 표시
};
