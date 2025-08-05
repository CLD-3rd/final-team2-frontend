import { wsManager } from "../ws/wsManager";

// DirectChatRoomDto를 UI 형태로 변환
export const parseDirectChatRoomResponse = (response, currentUser) => {
  if (!response || !Array.isArray(response)) return [];
  
  return response.map(room => ({
    id: room.otherUserId,
    roomId: room.roomId,
    name: room.otherUserNickname,
    lastMessage: room.lastMessage || "",
    timestamp: room.lastMessageTimestamp || "now",
    unreadCount: room.unreadCount || 0,
    isOnline: false,
    avatarColor: "#8b5cf6",
    otherUserId: room.otherUserId,
    otherUserEmail: room.otherUserEmail,
    // profileImage: room.otherUserProfileImgUrl || "https://placeholder.com/40", // ✅ URL 수정
  }));
};

// GroupChatRoomDto를 UI 형태로 변환
export const parseGroupChatRoomResponse = (response, currentUser) => {
  if (!response || !Array.isArray(response)) return [];
  
  return response.map(room => ({
    id: room.roomId,
    roomId: room.roomId,
    name: room.groupName,
    lastMessage: "",
    timestamp: "now",
    unreadCount: room.unreadCount,
    isOnline: room.participants?.some(p => p.userId !== currentUser?.id) || false,
    avatarColor: "#3b82f6",
    participants: room.participants,
    type: room.type
  }));
};

// DirectMessageResponse를 UI 형태로 변환
export const parseChatMessageResponse = (response, currentUser, selectedChat) => {
  if (!response || !Array.isArray(response.content)) return [];

  // ✅ 문제의 원인이었던 myId 가져오는 부분을 currentUser에서 직접 가져오도록 수정
  const myId = currentUser?.id;
  
  return response.content.map((message, index) => {
    const isMe = Number(message.senderId) === myId;
    const rawTimestamp = new Date(message.timestamp);

    return {
      id: message.messageId || `msg-${rawTimestamp.getTime()}-${index}`, // 서버에서 고유 ID를 준다면 그것을 사용
      sender: isMe ? "me" : "other",
      type: message.type === "TALK" ? "text" : "system",
      content: message.content,
      timestamp: rawTimestamp.toISOString(),
      displayTime: rawTimestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: !isMe ? message.senderName?.charAt(0) : null,
      avatarColor: selectedChat?.avatarColor || "#8b5cf6",
      profileImage: "https://placeholder.com/40", // ✅ URL 수정
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
    profileImage: user.profileImage || "https://placeholder.com/40" // ✅ URL 수정
  }));
};

// 현재 사용자 정보를 UI 형태로 변환
export const parseCurrentUserResponse = (response) => {
  if (!response) return null;
  
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    profileImage: response.profileImage || "https://placeholder.com/40" // ✅ URL 수정
  };
};