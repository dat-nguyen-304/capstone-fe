import { create } from 'zustand';

interface SelectedSidebarStore {
    teacherKeys: string[];
    onTeacherKeys: (keys: string[]) => void;
    adminKeys: string[];
    onAdminKeys: (keys: string[]) => void;
}

export const useSelectedSidebar = create<SelectedSidebarStore>(set => ({
    teacherKeys: [],
    onTeacherKeys: (teacherKeys: string[]) => set({ teacherKeys }),
    adminKeys: [],
    onAdminKeys: (adminKeys: string[]) => set({ adminKeys })
}));
