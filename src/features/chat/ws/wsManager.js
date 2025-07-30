// src/features/chat/ws/wsManager.js
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WSManager {
  constructor() {
    this.stompClient = null;
    this.subscriptions = [];
  }

  getAccessTokenFromCookie = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; accessToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  connect = () => {
    return new Promise((resolve, reject) => {
      if (this.connected && this.stompClient) {
        console.log("이미 WebSocket이 연결되어 있음.");
        return resolve(this.stompClient);
      }

      const token = this.getAccessTokenFromCookie();
      console.log("Access Token (from cookie):", token);

      const socket = new SockJS(`http://localhost:8080/ws`);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          this.connected = true;
          console.log("WebSocket 연결 완료");
          resolve(this.stompClient);
        },
        (error) => reject(error)
      );
    });
  };

  ensureConnected = async () => {
    if (!this.connected) {
      await this.connect();
    }
  };
  cleanupChatSubscriptions = () => {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  };

  // src/features/chat/ws/wsManager.js
subscribeChat = async (roomId, isGroup, callback) => {
  await this.ensureConnected(); // 연결 보장
  this.cleanupChatSubscriptions(); 

  let sub;
  if (isGroup) {
    sub = this.stompClient.subscribe(
      `/sub/chat/room/${roomId}`,
      (message) => callback(JSON.parse(message.body))
    );
  } else {
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

  subscribeNotifications = async (callback) => {
  await this.ensureConnected(); // 연결 보장
  const sub = this.stompClient.subscribe(
    "/user/queue/notifications",
    (message) => callback(JSON.parse(message.body))
  );
  this.subscriptions.push(sub);
};

  disconnect = () => {
  if (this.stompClient && this.connected) {
    console.log("Disconnecting WebSocket...");
    this.stompClient.disconnect(() => {
      this.connected = false;
      console.log("WebSocket disconnected.");
    });
  } else {
    console.log("WebSocket was not connected, skipping disconnect.");
  }
  };
}

export const wsManager = new WSManager();
