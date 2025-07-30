import axiosInstance from '../../../shared/api/axiosInstance';

// Mock 데이터
const mockDirectRooms = [
  { 
    id: 1, 
    roomId: "room-1", 
    name: "Alice Smith", 
    lastMessage: "Hello! How are you?", 
    timestamp: "2 min ago", 
    unreadCount: 1, 
    isOnline: true,
    avatarColor: "#8b5cf6"
  },
  { 
    id: 2, 
    roomId: "room-2", 
    name: "Bob Johnson", 
    lastMessage: "See you tomorrow!", 
    timestamp: "1 hour ago", 
    unreadCount: 0, 
    isOnline: false,
    avatarColor: "#10b981"
  },
  { 
    id: 3, 
    roomId: "room-3", 
    name: "Carol Davis", 
    lastMessage: "Thanks for the help!", 
    timestamp: "3 hours ago", 
    unreadCount: 2, 
    isOnline: true,
    avatarColor: "#f59e0b"
  },
];

const mockGroupRooms = [
  { 
    id: 1, 
    roomId: "group-1", 
    name: "Project Team", 
    lastMessage: "Meeting at 3 PM", 
    timestamp: "30 min ago", 
    unreadCount: 3, 
    isOnline: true,
    avatarColor: "#3b82f6"
  },
  { 
    id: 2, 
    roomId: "group-2", 
    name: "Friends Group", 
    lastMessage: "Happy birthday!", 
    timestamp: "2 hours ago", 
    unreadCount: 0, 
    isOnline: false,
    avatarColor: "#10b981"
  },
];

const mockChatMessages = [
  { 
    id: 1, 
    sender: "other", 
    type: "text", 
    content: "Hi! How are you doing?", 
    timestamp: "2:30 PM", 
    avatar: "A", 
    avatarColor: "#8b5cf6",
    profileImage: "https://via.placeholder.com/40"
  },
  { 
    id: 2, 
    sender: "me", 
    type: "text", 
    content: "I'm doing great! How about you?", 
    timestamp: "2:32 PM" 
  },
  { 
    id: 3, 
    sender: "other", 
    type: "text", 
    content: "Pretty good! Working on the new project.", 
    timestamp: "2:35 PM", 
    avatar: "A", 
    avatarColor: "#8b5cf6",
    profileImage: "https://via.placeholder.com/40"
  },
  { 
    id: 4, 
    sender: "me", 
    type: "file", 
    content: "project-document.pdf", 
    timestamp: "2:40 PM", 
    fileIcon: "📄",
    profileImage: "https://via.placeholder.com/40"
  },
];

const mockUsers = [
  { id: 2, name: "Alice Smith", email: "alice@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  { id: 4, name: "Carol Davis", email: "carol@example.com" },
  { id: 5, name: "David Wilson", email: "david@example.com" },
  { id: 6, name: "Eva Brown", email: "eva@example.com" },
];

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
export const getChatMessages = async (roomId) => {
  try {
    const response = await axiosInstance.get(`/api/chat/rooms/${roomId}/messages`);
    return response.data;
  } catch (error) {
    console.error('채팅방 메시지 내역 조회 실패:', error);
    console.warn("API 호출 실패, mock 데이터 사용");
    return mockChatMessages;
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
