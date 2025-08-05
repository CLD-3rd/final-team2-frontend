import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axiosInstance from '../../../shared/api/axiosInstance';
import { toast } from 'react-hot-toast';

class WebSocketManager {
    constructor() {
    this.stompClient = null;
    this.connectionPromise = null;
    this.subscriptions = new Map();
    // ✅ [추가] ChatPage에서 사용할 단일 메시지 핸들러
    this.messageHandler = null; 
  }

  // ✅ [추가] 메시지 핸들러를 등록하는 함수
  setMessageHandler(handler) {
    this.messageHandler = handler;
  }
  
  // ✅ [추가] 메시지 핸들러를 제거하는 함수
  clearMessageHandler() {
    this.messageHandler = null;
  }

  connect() {
    if (this.stompClient?.connected) {
      return Promise.resolve(this.stompClient);
    }
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        console.log("웹소켓 연결 티켓을 요청합니다...");
        const response = await axiosInstance.get('/api/ws-ticket');
        const ticket = response.data.ticket;
        if (!ticket) {
          throw new Error("서버로부터 유효한 티켓을 받지 못했습니다.");
        }
        console.log("티켓 발급 성공. STOMP 연결을 시작합니다.");
        const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = () => {};
        this.stompClient.connect(
          { 'Authorization': ticket },
          (frame) => {
            console.log("✅ WebSocket 연결 성공!", frame);
            this.connectionPromise = null;
            resolve(this.stompClient);
          },
          (error) => {
            console.error('❌ WebSocket 연결 실패:', error);
            toast.error("실시간 서버에 연결할 수 없습니다.");
            this.connectionPromise = null;
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ 웹소켓 연결 과정에서 에러 발생:', error);
        this.connectionPromise = null;
        reject(error);
      }
    });
    return this.connectionPromise;
  }

  /**
   * [수정] 구독 로직 전체 변경
   * 동일한 채널에 여러 콜백을 등록할 수 있도록 처리합니다.
   */
  subscribe(destination, callback) {
    if (!this.stompClient?.connected) {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
      return;
    }

    const existingSubscription = this.subscriptions.get(destination);

    if (existingSubscription) {
      existingSubscription.callbacks.add(callback);
      console.log(`[콜백 추가] 기존 구독(${destination})에 콜백이 추가되었습니다.`);
    } else {
      const callbacks = new Set([callback]);
      const stompSub = this.stompClient.subscribe(destination, (message) => {
        try {
          const body = JSON.parse(message.body);
          this.subscriptions.get(destination)?.callbacks.forEach(cb => {
            cb(body);
          });
        } catch (e) {
          console.error("메시지 파싱 또는 콜백 실행 실패", e);
        }
      });

      this.subscriptions.set(destination, { stompSub, callbacks });
      console.log(`[신규 구독] 성공: ${destination}`);
    }
  }

  /**
   * [수정] 구독 해제 로직 변경
   * 특정 콜백만 제거하고, 더 이상 콜백이 없으면 STOMP 구독을 해제합니다.
   */
  unsubscribe(destination, callback) {
    const subscription = this.subscriptions.get(destination);
    if (!subscription) return;

    subscription.callbacks.delete(callback);
    console.log(`[콜백 제거] 구독(${destination})에서 콜백이 제거되었습니다.`);

    if (subscription.callbacks.size === 0) {
      subscription.stompSub.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`[구독 해제] 마지막 콜백 제거됨. STOMP 구독(${destination})을 해제합니다.`);
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log("WebSocket 연결이 종료되었습니다.");
        this.stompClient = null;
        this.subscriptions.clear();
      });
    }
  }

  sendMessage(destination, body, headers = {}) {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
        headers,
      });
    } else {
      console.error("메시지를 보내기 전에 연결이 필요합니다.");
      toast.error("서버에 연결되지 않아 메시지를 보낼 수 없습니다.");
    }
  }
}

export const wsManager = new WebSocketManager();