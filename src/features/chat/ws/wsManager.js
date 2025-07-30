// src/features/chat/ws/wsManager.js
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WSManager {
  constructor() {
    this.stompClient = null;
    this.subscriptions = [];
  }

  connect = () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("accessToken");
    console.log("Access Token:", token); // ← 여기 추가

    const socket = new SockJS(`http://localhost:8080/ws`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      { Authorization: `Bearer ${token}` }, // 헤더로 JWT 전달
      () => resolve(),
      (error) => reject(error)
    );
  });
};





  cleanupChatSubscriptions = () => {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  };

  // src/features/chat/ws/wsManager.js
subscribeChat = (roomId, isGroup, callback) => {
  this.cleanupChatSubscriptions(); // 기존 구독 해제

  let sub;
  if (isGroup) {
    // 그룹 채팅방 구독
    sub = this.stompClient.subscribe(
      `/sub/chat/room/${roomId}`,
      (message) => callback(JSON.parse(message.body))
    );
  } else {
    // 1:1 채팅 메시지 구독 (개인 큐)
    sub = this.stompClient.subscribe(
      `/user/queue/messages`,
      (message) => callback(JSON.parse(message.body))
    );
  }

  this.subscriptions.push(sub);
};


  sendMessage = (roomId, message, isGroup = false, recipientId = null) => {
    const destination = isGroup
      ? `/pub/chat.group.send/${roomId}`
      : `/pub/chat.direct.send/${roomId}`;
    if (!isGroup) message.recipientId = recipientId;

    this.stompClient.send(destination, {}, JSON.stringify(message));
  };

  subscribeNotifications = (callback) => {
  const sub = this.stompClient.subscribe(
    "/user/queue/notifications",
    (message) => callback(JSON.parse(message.body))
  );
  this.subscriptions.push(sub);
};

  disconnect = () => {
    if (this.stompClient) this.stompClient.disconnect();
  };
}

export const wsManager = new WSManager();
