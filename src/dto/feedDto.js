// ✅ Feed 목록 조회 시
export const parseFeedsResponse = (data) => {
  if (!data || !Array.isArray(data.feeds)) return [];

  return data.feeds.map((feed) => ({
    id: feed.feed_id,
    userId: feed.user_id,
    title: feed.title,
    content: feed.content,
    image: feed.image_url,
    region: feed.location,
    badgeRequest: feed.badge_request === "Y",
    views: feed.view_count,
    likes: feed.like_count,
    createdAt: feed.created_at,
    updatedAt: feed.modified_at,
  }));
};

// ✅ 상세 피드 응답 파싱
export const parseFeedDetailResponse = (data) => {
  if (!data) return null;

  return {
    id: data.feed_id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    images: data.image_url || [],
    region: data.location,
    badgeRequest: data.badge_request === "Y",
    views: data.view_count,
    likes: data.like_count,
    createdAt: data.created_at,
    updatedAt: data.modified_at,
    author: {
      nickname: data.author?.nickname || "익명",
      profileImage:
        data.author?.profile_image || "/images/default-user-profile.png",
    },
    comments: (data.comments || []).map((comment) => ({
      id: comment.comment_id,
      userId: comment.user_id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.modified_at || null,
    })),
  };
};
