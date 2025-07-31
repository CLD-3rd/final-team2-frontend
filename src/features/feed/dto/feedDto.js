import { formatTime } from "@/shared";

// ✅ Feed 목록 조회 시
export const parseFeedsResponse = (data) => {
  if (!data) return [];

  return data.feeds.map((feed) => ({
    id: feed.feedId,
    author: {
      userId: feed.author.userId,
      nickname: feed.author.nickname,
      profileImgUrl: feed.author.profileImgUrl,
    },
    title: feed.title,
    content: feed.content,
    imageUrl: feed.imageUrl,
    location: feed.location,
    viewCount: feed.viewCount,
    createdAt: formatTime(feed.createdAt),
  }));
};

// ✅ 상세 피드 응답 파싱
export const parseFeedDetailResponse = (data) => {
  if (!data) return null;

  return {
    id: data.feedId,
    author: {
      userId: data.author.userId,
      nickname: data.author.nickname,
      profileImgUrl: data.author.profileImgUrl,
    },
    title: data.title,
    content: data.content,
    location: data.location,
    imageUrl: data.imageUrl,
    createdAt: formatTime(data.createdAt),
    comments: (data.comments || []).map((comment) => ({
      id: comment.commentId,
      nickname: comment.author.nickname,
      profileImgUrl: comment.author.profileImgUrl,
      content: comment.content,
      timestamp: formatTime(comment.createdAt), // "방금 전", "2시간 전" 같은 포맷 함수 사용
      isMyComment: comment.isMyComment || false,
    })),
  };
};
