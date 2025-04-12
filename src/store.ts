import { create } from 'zustand';

interface StoreState {
  markdown: string;
  css: string;
  darkMode: boolean;
  templateId: string;
  setMarkdown: (markdown: string) => void;
  setCSS: (css: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  setTemplateId: (templateId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  markdown: '',
  css: '',
  darkMode: true,
  templateId: 'default',
  setMarkdown: (markdown) => set({ markdown }),
  setCSS: (css) => set({ css }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setTemplateId: (templateId) => set({ templateId }),
})); 