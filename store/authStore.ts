import { create } from "zustand";

interface AuthStore {
	isLoggedIn: boolean;
	setIsLoggedIn: (status: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isLoggedIn: false,
	setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));
