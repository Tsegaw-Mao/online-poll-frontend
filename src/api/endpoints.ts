export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login/",
    LOGOUT: "/api/auth/logout/",
    REFRESH: "/api/auth/refresh/",
    REGISTER: "/api/auth/register/",
  },
  POLLS: {
    LIST: "/api/polls/",
    CREATE: "/api/polls/",
    DETAIL: (id: number) => `/api/polls/${id}/`,
    VOTE: "/api/vote/",
  },
};
