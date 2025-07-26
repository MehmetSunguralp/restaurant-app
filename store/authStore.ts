import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
	isLoggedIn: boolean;
	email: string | null;
	role: string | null;
	setIsLoggedIn: (status: boolean) => void;
	setAuthDetails: (email: string | null, role: string) => void;
	clearAuthDetails: () => void;
}

// export const useAuthStore = create<AuthStore>((set) => ({
// 	isLoggedIn: false,
// 	email: null,
// 	role: "USER",
// 	setIsLoggedIn: (status) => set({ isLoggedIn: status }),
// 	setAuthDetails: (email, role) => set({ email, role }),
// 	clearAuthDetails: () =>
// 		set({
// 			isLoggedIn: false,
// 			email: null,
// 			role: null,
// 		}),
// }));

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            isLoggedIn: false,
            email: null,
            role: "USER",
            setIsLoggedIn: (status) => set({ isLoggedIn: status }),
            setAuthDetails: (email, role) => set({ email, role }),
            clearAuthDetails: () => set({ isLoggedIn: false, email: null, role: null }),
        }),
        {
            name: "auth-storage", // key in localStorage
        }
    )
);
