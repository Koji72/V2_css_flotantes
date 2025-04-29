import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface EditorState {
  content: string;
  darkMode: boolean;
  selectedTemplate: any;
  templateId: string;
  notifications: Notification[];
  setContent: (content: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  setSelectedTemplate: (template: any) => void;
  setTemplateId: (id: string) => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const useStore = create<EditorState>()(
  persist(
    (set) => ({
      content: '',
      darkMode: true,
      selectedTemplate: null,
      templateId: '',
      notifications: [],
      setContent: (content) => set({ content }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setTemplateId: (id) => set({ templateId: id }),
      showNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        selectedTemplate: state.selectedTemplate,
        templateId: state.templateId,
      }),
    }
  )
);

export { useStore };
export type { Notification }; 