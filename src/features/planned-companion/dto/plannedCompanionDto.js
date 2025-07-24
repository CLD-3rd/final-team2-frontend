// ✅ 리스트 응답 변환
// plannedCompanionDto.js
export const parsePlannedCompanionListResponse = (data) => {
  if (!data?.posts) return [];

  return data.posts.map((post) => ({
    id: post.id,
    title: post.title,
    location: post.location,
    startTime: post.startTime,
    endTime: post.endTime,
    content: post.description,
    author: post.author,
    participants: post.participants,
    maxParticipants: post.maxParticipants,
    image: post.image,
  }));
};
