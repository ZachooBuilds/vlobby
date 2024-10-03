import { type ReactNode } from 'react';
import { create } from 'zustand';

interface DrawerState {
  isOpen: boolean;
  title: string;
  description: string;
  content: ReactNode | null;
  openDrawer: (title: string, description: string, content?: ReactNode) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  content: null,
  openDrawer: (title, description, content) =>
    set({ isOpen: true, title, description, content }),
  closeDrawer: () =>
    set({ isOpen: false, title: '', description: '', content: null }),
}));

export default useDrawerStore;
