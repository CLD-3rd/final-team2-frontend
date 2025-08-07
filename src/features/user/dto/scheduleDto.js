export const parseScheduleResponse = async (
  rawData,
  currentUserId,
  getParticipants,
  getApprovedCount
) => {
  if (!rawData || !Array.isArray(rawData)) return [];

  return await Promise.all(
    rawData.map(async (item) => {
      try {
        const [participants, approvedCount] = await Promise.all([
          getParticipants(item.travelPostId),
          getApprovedCount(item.travelPostId),
        ]);

        const myStatus =
          participants.find((p) => p.participantId === currentUserId)?.status ||
          null;

        return {
          id: item.travelPostId,
          title: item.title,
          location: item.location,
          startDate: item.startTime,
          endDate: item.endTime,
          isReviewed: item.isReviewed ?? false,
          myJoinStatus: myStatus,

          owner: item.author
            ? {
                id: item.author.userId,
                name: item.author.nickname,
                image:
                  item.author.profileImgUrl || "/images/default-user.png",
              }
            : null,

          participants: participants.map((p) => ({
            id: p.participantId,
            name: p.participantNickname,
            status: p.status,
            approved: p.status === "APPROVED",
            image: p.profileImgUrl || "/images/default-user.png",
          })),

          approvedCount,
          recruitLimit: item.maxParticipants ?? 0,
          progressStatus: item.status ?? null,
        };
      } catch (err) {
        console.error("❌ 파싱 실패:", item.travelPostId, err);
        return null;
      }
    })
  ).then((results) => results.filter(Boolean));
};
