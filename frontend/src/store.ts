import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  level?: number;
  experience?: number;
}

export interface Pet {
  id: string;
  name: string;
  personality: string;
  gender: string;
  current_form: string;
  trust_level: number;
  total_kcal: number;
}

export interface Monster {
  id: string;
  name: string;
  type: string;
  required_kcal: number;
  reward_coins: number;
  reward_fragments: number;
  description: string;
}

export interface Battle {
  id: string;
  monster_id: string;
  pet_id: string;
  kcal_consumed: number;
  coins_earned: number;
  fragments_earned: number;
  status: 'in_progress' | 'completed' | 'failed';
}

export interface UserStats {
  user_id: string;
  total_battles: number;
  total_wins: number;
  total_kcal: number;
  current_streak: number;
  last_active_date: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  requirement: any;
  reward_coins: number;
  icon?: string;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number;
  level: number;
}

interface AppStore {
  user: User | null;
  token: string | null;
  pet: Pet | null;
  currentBattle: Battle | null;
  monsters: Monster[];
  userStats: UserStats | null;
  achievements: Achievement[];
  userAchievements: Achievement[];
  leaderboard: LeaderboardEntry[];

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setPet: (pet: Pet | null) => void;
  setCurrentBattle: (battle: Battle | null) => void;
  setMonsters: (monsters: Monster[]) => void;
  setUserStats: (stats: UserStats | null) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setUserAchievements: (achievements: Achievement[]) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  updateUserCoins: (coins: number) => void;
  updatePetTrust: (trust: number) => void;
  updateUserLevel: (level: number, experience: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  pet: null,
  currentBattle: null,
  monsters: [],
  userStats: null,
  achievements: [],
  userAchievements: [],
  leaderboard: [],

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setPet: (pet) => set({ pet }),
  setCurrentBattle: (battle) => set({ currentBattle: battle }),
  setMonsters: (monsters) => set({ monsters }),
  setUserStats: (stats) => set({ userStats: stats }),
  setAchievements: (achievements) => set({ achievements }),
  setUserAchievements: (achievements) => set({ userAchievements: achievements }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  updateUserCoins: (coins) => set((state) => ({
    user: state.user ? { ...state.user, coins } : null
  })),
  updatePetTrust: (trust) => set((state) => ({
    pet: state.pet ? { ...state.pet, trust_level: trust } : null
  })),
  updateUserLevel: (level, experience) => set((state) => ({
    user: state.user ? { ...state.user, level, experience } : null
  }))
}));
