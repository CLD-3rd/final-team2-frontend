// src/api/feed.js
import axios from "./axiosInstance";

// ✅ feed 전체 조회
export const getFeeds = async () => {
  const response = await axios.get("/api/feed");
  return response.data;
};

// ✅ feed 상세 조회
export const getFeedDetail = async (feedId) => {
  const response = await axios.get(`/api/feed/${feedId}`);
  return response.data;
};

// ✅ feed 등록
export const createFeed = async (data) => {
  const response = await axios.post("/api/feed", data);
  return response.data;
};

// ✅ feed 수정
export const updateFeed = async (feedId, data) => {
  const response = await axios.patch(`/api/feed/${feedId}`, data);
  return response.data;
};

// ✅ feed 삭제
export const deleteFeed = async (feedId) => {
  const response = await axios.delete(`/api/feed/${feedId}`);
  return response.data;
};

// ✅ 댓글 조회
export const getComments = async (feedId) => {
  const response = await axios.get(`/api/feed/${feedId}/comments`);
  return response.data;
};

// ✅ 댓글 등록
export const createComment = async (feedId, data) => {
  const response = await axios.post(`/api/feed/${feedId}/comments`, data);
  return response.data;
};

// ✅ 댓글 수정
export const updateComment = async (feedId, commentId, data) => {
  const response = await axios.patch(
    `/api/feed/${feedId}/comments/${commentId}`,
    data
  );
  return response.data;
};

// ✅ 댓글 삭제
export const deleteComment = async (feedId, commentId) => {
  const response = await axios.delete(
    `/api/feed/${feedId}/comments/${commentId}`
  );
  return response.data;
};
