// Feed 목록 조회 시
export const parseFeedsResponse = (res) => {
  if (res.status !== 200) return [];

  return (
    res.data?.feeds?.map((feed) => ({
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
    })) || []
  );
};
