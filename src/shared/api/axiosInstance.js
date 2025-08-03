import axios from "axios";
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ 환경변수 사용
  withCredentials: true, // ✅ 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 (옵션)
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (에러 처리)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // ✅ 서버 연결 불가 (Network Error, 서버 다운 등)
      toast.error("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } else {
      const status = error.response.status;
      const message =
        error.response.data?.message || "요청 처리 중 오류가 발생했습니다.";

      // ✅ 상황별 추가 처리 가능
      if (status === 401) {
        toast.error("인증이 만료되었습니다. 다시 로그인 해주세요.");
        // 필요 시 로그아웃 처리 로직 추가
      } else if (status === 403) {
        toast.error("권한이 없습니다.");
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
