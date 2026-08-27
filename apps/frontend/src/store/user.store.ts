import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo, UserRole } from '@app-types/user.types';
import { login as loginApi, register as registerApi, getUserProfile } from '@api/auth.api';

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;
}

interface UserActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname?: string, role?: UserRole) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      isLoggedIn: false,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const res = await loginApi({ email, password });
          set({
            token: res.accessToken,
            userInfo: res.user,
            isLoggedIn: true,
          });
          localStorage.setItem('token', res.accessToken);
        } finally {
          set({ loading: false });
        }
      },

      register: async (email: string, password: string, nickname?: string, role?: UserRole) => {
        set({ loading: true });
        try {
          const res = await registerApi({ email, password, nickname, role });
          set({
            token: res.accessToken,
            userInfo: res.user,
            isLoggedIn: true,
          });
          localStorage.setItem('token', res.accessToken);
        } finally {
          set({ loading: false });
        }
      },

      fetchUserInfo: async () => {
        try {
          const userInfo = await getUserProfile();
          set({ userInfo, isLoggedIn: true });
        } catch (error) {
          set({ userInfo: null, isLoggedIn: false });
        }
      },

      logout: () => {
        set({
          token: null,
          userInfo: null,
          isLoggedIn: false,
        });
        localStorage.removeItem('token');
      },

      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('token', token);
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
