import { wsManager } from "../ws/wsManager";

// DirectChatRoomDto를 UI 형태로 변환
export const parseDirectChatRoomResponse = (response, currentUser) => {
  if (!response || !Array.isArray(response)) return [];
  
  return response.map(room => ({
    id: room.otherUserId,
    roomId: room.roomId,
    name: room.otherUserNickname,
    lastMessage: "", // API에서 제공되지 않는 경우 빈 문자열
    timestamp: "now", // API에서 제공되지 않는 경우 기본값
    unreadCount: 0, // API에서 제공되지 않는 경우 기본값
    isOnline: false, // API에서 제공되지 않는 경우 기본값
    avatarColor: "#8b5cf6", // 기본 색상
    otherUserId: room.otherUserId,
    otherUserEmail: room.otherUserEmail,
  }));
};

// GroupChatRoomDto를 UI 형태로 변환
export const parseGroupChatRoomResponse = (response, currentUser) => {
  if (!response || !Array.isArray(response)) return [];
  
  return response.map(room => ({
    id: room.roomId,
    roomId: room.roomId,
    name: room.groupName,
    lastMessage: "", // API에서 제공되지 않는 경우 빈 문자열
    timestamp: "now", // API에서 제공되지 않는 경우 기본값
    unreadCount: room.unreadCount,
    isOnline: room.participants?.some(p => p.userId !== currentUser?.id) || false,
    avatarColor: "#3b82f6", // 그룹 채팅방 기본 색상
    participants: room.participants,
    type: room.type
  }));
};

// DirectMessageResponse를 UI 형태로 변환
export const parseChatMessageResponse = (response, currentUser, selectedChat) => {
  if (!response || !Array.isArray(response.content)) return [];
  const myId = Number(wsManager.getCurrentUserId());
  
  return response.content.map((message, index) => {
    const isMe = Number(message.senderId) === myId;

    console.log("💬 senderId:", message.senderId, "myId:", myId, "isMe:", isMe);
    const rawTimestamp = new Date(message.timestamp);  // 이걸 기준으로 정렬
return {
  id: index + 1,
  sender: isMe ? "me" : "other",
  type: message.type === "TALK" ? "text" : "system",
  content: message.content,
  timestamp: rawTimestamp.toISOString(), // 저장은 원본 유지
  displayTime: rawTimestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // 표시용
  avatar: !isMe ? message.senderName?.charAt(0) : null,
  avatarColor: selectedChat?.avatarColor || "#8b5cf6",
  profileImage: "https://via.placeholder.com/40",
  senderName: message.senderName,
  senderId: message.senderId
};
  });
};

// 사용자 목록을 UI 형태로 변환
export const parseUsersResponse = (response) => {
  if (!response || !Array.isArray(response)) return [];
  
  return response.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || "https://via.placeholder.com/40"
  }));
};

// 현재 사용자 정보를 UI 형태로 변환
export const parseCurrentUserResponse = (response) => {
  if (!response) return null;
  
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    profileImage: response.profileImage || "https://via.placeholder.com/40"
  };
}; 