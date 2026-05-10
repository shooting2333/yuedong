import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE,
});

// 添加token到请求头
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getStats: () => api.get('/users/stats'),
};

export const petAPI = {
  create: (name: string, personality: string, gender: string) =>
    api.post('/pets', { name, personality, gender }),
  get: (id: string) => api.get(`/pets/${id}`),
  getUserPets: () => api.get('/users/pets'),
  getDetail: (id: string) => api.get(`/pets/${id}/detail`),
  checkEvolution: (id: string) => api.post(`/pets/${id}/check-evolution`),
};

export const monsterAPI = {
  getAll: () => api.get('/monsters'),
};

export const battleAPI = {
  start: (monsterId: string, petId: string) =>
    api.post('/battles', { monsterId, petId }),
  update: (battleId: string, kcalConsumed: number) =>
    api.put(`/battles/${battleId}`, { kcalConsumed }),
};

export const leaderboardAPI = {
  getKcalLeaderboard: (limit = 50, offset = 0) =>
    api.get(`/leaderboard/kcal?limit=${limit}&offset=${offset}`),
  getCoinsLeaderboard: (limit = 50, offset = 0) =>
    api.get(`/leaderboard/coins?limit=${limit}&offset=${offset}`),
};

export const achievementAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/user'),
  check: () => api.post('/achievements/check'),
};

export const groupAPI = {
  create: (name: string, difficulty: string, requiredKcalPerPerson: number, coinsPerPerson: number, deadline: string) =>
    api.post('/groups', { name, difficulty, requiredKcalPerPerson, coinsPerPerson, deadline }),
  get: (id: string) => api.get(`/groups/${id}`),
  getAll: () => api.get('/groups'),
  join: (id: string) => api.post(`/groups/${id}/join`),
};
