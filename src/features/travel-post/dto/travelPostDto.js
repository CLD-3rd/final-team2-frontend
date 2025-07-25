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
    createdAt: post.createdAt,
  }));
};

export const parseLocalCompanionsResponse = (data) => {
  if (!data?.posts) return [];

  return data.posts.map((post) => ({
    id: post.travelPostId,
    title: post.title,
    location: post.location,
    startTime: post.startTime,
    endTime: post.endTime,
    author: post.author,
    participants: post.participants,
    maxParticipants: post.maxParticipants,
    image: post.image,
    createdAt: post.createdAt,
  }));
};
