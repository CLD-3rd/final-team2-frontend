import { formatTime } from "@/shared/utils/formatTime";

export const parseTravelPostsResponse = (data) => {
  if (!data) return [];

  switch (data.postType) {
    case "BEFORE":
      return (data.beforePosts || []).map((post) => ({
        id: post.travelPostId,
        title: post.title,
        content: post.content,
        location: post.location,
        startTime: post.startTime,
        endTime: post.endTime,
        author: post.author,
        viewCount: post.viewCount,
        participants: post.participants,
        maxParticipants: post.maxParticipants,
        image: post.imageUrl,
        createdAt: formatTime(post.createdAt),
        similarity: post.similarity ?? null, // 로그인 사용자일 때만
      }));

    case "NOW":
      return (data.nowPosts || []).map((post) => ({
        id: post.travelPostId,
        title: post.title,
        location: post.location,
        author: post.author,
        image: post.imageUrl,
        createdAt: formatTime(post.createdAt),
      }));

    default:
      return [];
  }
};

// ✅ 리스트 응답 변환
export const parsePlannedCompanionsResponse = (data) => {
  if (!data?.posts) return [];

  return data.posts.map((post) => ({
    id: post.travelPostId,
    title: post.title,
    content: post.content,
    location: post.location,
    startTime: post.startTime,
    endTime: post.endTime,
    author: post.author,
    participants: post.participants,
    maxParticipants: post.maxParticipants,
    image: post.image,
    createdAt: formatTime(post.createdAt),
  }));
};

export const parseLocalCompanionsResponse = (data) => {
  if (!data?.posts) return [];

  return data.posts.map((post) => ({
    id: post.travelPostId,
    title: post.title,
    location: post.location,
    author: post.author,
    image: post.image,
    createdAt: formatTime(post.createdAt),
  }));
};

// ✅ 상세 모집글 응답 파싱
export const parsePostDetailResponse = (data) => {
  if (!data) return null;

  return {
    id: data.travelPostId,
    title: data.title,
    content: data.content,
    location: data.location,
    startTime: data.startTime,
    endTime: data.endTime,
    author: {
      userId: data.author.userId,
      nickname: data.author.nickname,
      profileImgUrl: data.author.profileImgUrl,
    },
    maxParticipants: data.maxParticipants,
    imageUrl: data.imageUrl,
    createdAt: formatTime(data.createdAt),
  };
};
