// api.ts (또는 api.js)
import axios from 'axios';
import { BASE_URL } from './API';   // 토큰 재발급 URL도 더 이상 필요 없음

export const appAxios = axios.create({
  baseURL: BASE_URL,
  // 필요하다면 기본 헤더를 여기서 지정
  // headers: { 'Content-Type': 'application/json' },
});

/**
 * 공통 응답 인터셉터 (선택)
 *  - 성공 응답은 그대로 리턴
 *  - 에러는 로깅 후 그대로 throw
 */
appAxios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);
