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
      const socket = new SockJS("/ws-stomp"); // 서버 엔드포인트
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, () => resolve(), (error) => reject(error));
    });
  };

  cleanupChatSubscriptions = () => {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  };

  subscribeChat = (roomId, isGroup, callback) => {
    const destination = isGroup
      ? `/sub/chat/group/${roomId}`
      : `/sub/chat/direct/${roomId}`;

    const sub = this.stompClient.subscribe(destination, callback);
    this.subscriptions.push(sub);
  };

  sendMessage = (roomId, message, isGroup = false, recipientId = null) => {
    const destination = isGroup
      ? `/pub/chat.group.send/${roomId}`
      : `/pub/chat.direct.send/${roomId}`;
    if (!isGroup) message.recipientId = recipientId;

    this.stompClient.send(destination, {}, JSON.stringify(message));
  };

  disconnect = () => {
    if (this.stompClient) this.stompClient.disconnect();
  };
}

export const wsManager = new WSManager();
