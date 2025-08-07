import axios from "axios";
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 익명 접근 허용 API 리스트
const ANONYMOUS_ALLOWED_PATHS = [
  "/api/users/me",
  "/api/feeds",
  "/api/travel-posts",
];

// ✅ 요청 인터셉터
instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = error.config.url;

    // ✅ 요청 URL이 익명 허용 리스트에 포함되는지 확인
    const isAnonymousAllowed = ANONYMOUS_ALLOWED_PATHS.some((path) =>
      requestUrl.startsWith(path)
    );

    if (status === 401 && isAnonymousAllowed) {
      // ✅ 익명 허용 API에서 401 → 정상 동작으로 간주
      return Promise.resolve({ data: null });
    }

    // ✅ 상황별 에러 처리
    if (status === 401) {
      toast.error("로그인이 필요합니다.");
    } else if (status === 403) {
      toast.error("권한이 없습니다.");
    } else if (status >= 400 && !isAnonymousAllowed) {
      const message =
        error.response.data?.message || "요청 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
