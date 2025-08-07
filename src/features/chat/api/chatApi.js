import axiosInstance from '../../../shared/api/axiosInstance';

// 1대1 채팅방 생성
export const createDirectChatRoom = async (otherUserId) => {
  try {
    const response = await axiosInstance.post(`/api/chat/direct/${otherUserId}`);
    return response.data;
  } catch (error) {
    console.error('1대1 채팅방 생성 실패:', error);
    throw error;
  }
};

// 1대1 채팅방 목록 조회
export const getDirectChatRooms = async () => {
  try {
    const response = await axiosInstance.get('/api/chat/my-rooms/direct');
    return response.data;
  } catch (error) {
    console.error('1대1 채팅방 목록 조회 실패:', error);
    console.warn("API 호출 실패, mock 데이터 사용");
    return mockDirectRooms;
  }
};

// 그룹 채팅방 목록 조회
export const getGroupChatRooms = async () => {
  try {
    const response = await axiosInstance.get('/api/chat/my-rooms/group');
    return response.data;
  } catch (error) {
    console.error('그룹 채팅방 목록 조회 실패:', error);
    console.warn("API 호출 실패, mock 데이터 사용");
    return mockGroupRooms;
  }
};

// 특정 채팅방의 메시지 내역 조회
export const getChatMessages = async (roomId, page = 0, size=20) => {
  try {
    const response = await axiosInstance.get(`/api/chat/rooms/${roomId}/messages`,
      { params: { page, size, sort: "timestamp,desc" }}
    );
    return response.data;
  } catch (error) {
    console.error('채팅방 메시지 내역 조회 실패:', error);
    return { content: [], last: true, number: page, size };
  }
};

// 현재 사용자 정보 조회
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('현재 사용자 정보 조회 실패:', error);
    console.warn("API 호출 실패, mock 데이터 사용");
    return { id: 1, name: "John Doe", email: "john@example.com" };
  }
};

// 모든 사용자 목록 조회
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/users');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    console.warn("API 호출 실패, mock 데이터 사용");
    return mockUsers;
  }
};
