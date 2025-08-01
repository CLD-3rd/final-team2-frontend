// src/features/chat/ws/wsManager.js
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WSManager {
  constructor() {
    this.stompClient = null;
    this.subscriptions = [];
    this.currentRoomId = null;
    this.lastSubscribe = null;
    this.connected = false;
  }

  startHealthCheck = () => {
  if (this.healthCheckInterval) return; // 이미 실행 중이면 무시

  this.healthCheckInterval = setInterval(async () => {
    if (!this.isActuallyConnected()) {
      console.warn("🧠 WebSocket 끊김 감지 → 재연결 시도");
      try {
        await this.connect(); // 자동 재연결 + 구독 복구됨
      } catch (e) {
        console.error("❌ 재연결 실패", e);
      }
    }
  }, 10000); // 10초마다 체크
};

stopHealthCheck = () => {
  if (this.healthCheckInterval) {
    clearInterval(this.healthCheckInterval);
    this.healthCheckInterval = null;
  }
};

  isActuallyConnected() {
    return this.stompClient && this.stompClient.connected;
  }

  getTokenFromCookie() {
  const name = "accessToken=";
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  return null;
}

connect = () => {
  return new Promise((resolve, reject) => {
    if (this.connected && this.isActuallyConnected()) {
      console.log("🔗 이미 WebSocket 연결됨");
      return resolve(this.stompClient);
    }

    const token = this.getTokenFromCookie();
    if (!token) {
      console.error("❌ 쿠키에 Access Token 없음");
      return reject("Access Token not found in cookie");
    }

    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.onclose = () => {
      console.warn("❌ WebSocket 연결 끊김");
      this.connected = false;

      // 자동 재연결
      setTimeout(() => {
        console.log("🔁 WebSocket 재연결 시도");
        this.connect(); // 다시 시도
      }, 3000);
    };

    this.stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        this.connected = true;
        console.log("✅ WebSocket 연결 성공");
        resolve(this.stompClient);

        if (this.lastSubscribe) {
      const { roomId, isGroup, callback } = this.lastSubscribe;
      console.log("🔁 재연결 후 구독 재시도:", roomId);
      this.subscribeChat(roomId, isGroup, callback, true);
    }
      },
      (error) => {
        console.error("🚫 WebSocket 연결 실패:", error);
        this.connected = false;
        reject(error);
      }
    );
  });
};

getCurrentUserId() {
  const token = this.getTokenFromCookie();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.sub || payload.id; // 토큰 구조에 따라 조정
  } catch (err) {
    console.error("JWT 파싱 실패", err);
    return null;
  }
}


  ensureConnected = async () => {
  if (!this.connected || !this.isActuallyConnected()) {
    await this.connect();
  }
};
  cleanupChatSubscriptions = () => {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  };

  // src/features/chat/ws/wsManager.js
subscribeChat = async (roomId, isGroup, callback, isRecovery = false) => {
  console.log("📩 구독 시도:", roomId, isGroup ? "(Group)" : "(Direct)");
  await this.ensureConnected();
  this.cleanupChatSubscriptions();

  const handleMessage = (message) => {
    const raw = JSON.parse(message.body);
    const currentUserId = this.getCurrentUserId();
    const parsed = {
      ...raw,
      sender: Number(raw.senderId) === Number(currentUserId) ? "me" : "other",
      type: "text",
    };
    callback(parsed);
  };

  const sub = isGroup
    ? this.stompClient.subscribe(`/sub/chat/room/${roomId}`, handleMessage)
    : this.stompClient.subscribe(`/user/queue/messages`, handleMessage);

  this.subscriptions.push(sub);
  this.currentRoomId = roomId;
  this.currentChatType = isGroup ? "group" : "direct";

  this.lastSubscribe = { roomId, isGroup, callback };
};




  sendMessage = (roomId, message, isGroup = false, recipientId = null) => {
    const destination = isGroup
      ? `/pub/chat.group.send/${roomId}`
      : `/pub/chat.direct.send/${roomId}`;
    if (!isGroup) message.recipientId = recipientId;

    this.stompClient.send(destination, {}, JSON.stringify(message));
    console.log("🧪 wsManager.sendMessage 호출됨");
    console.log("destination:", destination);
    console.log("payload:", message);
    console.log("typeof payload:", typeof message);
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
