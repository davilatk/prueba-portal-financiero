import { create } from 'zustand';
import Cookies from 'js-cookie';
import { AuthState, User } from '@/types/common';
import { logoutAction } from '@/actions/auth';

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isHydrated: false,

    // Login
    login: (user: User) => {

        // Guardar usuario en localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_user', JSON.stringify(user));
        }

        set({
            isAuthenticated: true,
            user,
            isHydrated: true,
        });
    },

    // Logout
    logout: async () => {
        await logoutAction();

        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_user');
        }

        set({
            isAuthenticated: false,
            user: null,
            isHydrated: true,
        });
    },

    // Check Auth automático
    checkAuth: () => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('auth_user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                set({
                    isAuthenticated: true,
                    user: parsedUser,
                    isHydrated: true,
                });
            } catch (err) {
                console.error('Error parsing stored user', err);
                Cookies.remove('auth_token');
                localStorage.removeItem('auth_user');
                set({
                    isAuthenticated: false,
                    user: null,
                    isHydrated: true,
                });
            }
        } else {
            set({
                isAuthenticated: false,
                user: null,
                isHydrated: true,
            });
        }
    },
}));

export const useAuthStoreHydrate = () => {
    const { isHydrated, checkAuth } = useAuthStore();
    if (!isHydrated && typeof window !== 'undefined') {
        checkAuth();
    }
};
