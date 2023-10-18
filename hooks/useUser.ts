import { SafeUser } from '@/types';
import { create } from 'zustand';

interface UserStore {
    user: SafeUser | null;
    onChangeUser: (user: SafeUser | null) => void;
}

const useUser = create<UserStore>(set => ({
    user: null,
    onChangeUser: (user: SafeUser | null) => set({ user })
}));

export default useUser;
