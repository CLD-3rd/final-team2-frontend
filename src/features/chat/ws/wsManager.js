// src/features/chat/ws/wsManager.js
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WSManager {
  constructor() {
    this.stompClient = null;
    this.subscriptions = [];
    this.currentRoomId = null;
  }

  getAccessToken = () => {
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

      const token = this.getAccessToken();
      if (!token) {
        console.error("Access Token이 없음. WebSocket 연결 불가.");
        return reject("Access Token not found");
      }

      console.log("Access Token:", token);
      const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          this.connected = true;
          console.log("WebSocket 연결 완료");
          resolve(this.stompClient);
        },
        (error) => {
          console.error("WebSocket 연결 실패:", error);
          reject(error);
        }
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
      (message) => {
        console.log("그룹 메시지 수신:", message.body);
        callback(JSON.parse(message.body));
      }
    );
  } else {
    sub = this.stompClient.subscribe(
      `/user/queue/messages`,
      (message) => {
        console.log("📩 1:1 메시지 수신:", message.body);
        callback(JSON.parse(message.body));
      }
    );
  }

  this.subscriptions.push(sub);
  this.currentRoomId = roomId;
};


  sendMessage = (roomId, message, isGroup = false, recipientId = null) => {
    const destination = isGroup
      ? `/pub/chat.group.send/${roomId}`
      : `/pub/chat.direct.send/${roomId}`;
    if (!isGroup) message.recipientId = recipientId;

    this.stompClient.send(destination, {}, JSON.stringify(message));
  };

  // 반드시 connect 이후 실행
  subscribeNotifications = async (callback) => {
  await this.ensureConnected(); // WebSocket 연결 보장
  if (!this.stompClient || !this.connected) {
    console.error("WebSocket이 아직 연결되지 않음.");
    return;
  }
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
