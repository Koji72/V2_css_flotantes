"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const useStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
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
}), {
    name: 'editor-storage',
    partialize: (state) => ({
        darkMode: state.darkMode,
        selectedTemplate: state.selectedTemplate,
        templateId: state.templateId,
    }),
}));
exports.useStore = useStore;
