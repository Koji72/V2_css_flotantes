import { create } from 'zustand';
import { Template } from './types/templates';

interface StoreState {
  markdown: string;
  css: string;
  darkMode: boolean;
  templateId: string;
  selectedTemplate: Template | null;
  content: string;
  setMarkdown: (markdown: string) => void;
  setCSS: (css: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  setTemplateId: (templateId: string) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setContent: (content: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  markdown: '',
  css: '',
  darkMode: true,
  templateId: 'default',
  selectedTemplate: null,
  content: '',
  setMarkdown: (markdown) => set({ markdown }),
  setCSS: (css) => set({ css }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setTemplateId: (templateId) => set({ templateId }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setContent: (content) => set({ content }),
})); 