import { create } from "zustand";

interface User {
  token: string;
  email: string;
  fullName: string;
  role: string;
  employeeId: number;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,

  setUser: (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },

  isAuthenticated: () => {
    const { user } = get();
    if (user) return true;
    // Check localStorage on page refresh
    const stored = localStorage.getItem("user");
    if (stored) {
      set({ user: JSON.parse(stored) });
      return true;
    }
    return false;
  },
}));