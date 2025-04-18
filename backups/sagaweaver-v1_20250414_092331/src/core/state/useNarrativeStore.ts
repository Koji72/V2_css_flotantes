import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NarrativeState {
  // Contenido y Apariencia
  rawMarkdown: string;
  activeTemplateId: string; // ID de la plantilla CSS seleccionada
  loadedCss: string;        // Contenido del CSS cargado
  darkMode: boolean;        // Para la UI principal

  // Estado UI
  isLoading: boolean;
  // Potencialmente estado del juego si se comparte con la UI principal
  // playerHp: number;

  // Acciones
  setRawMarkdown: (md: string) => void;
  setActiveTemplateId: (id: string) => void;
  setLoadedCss: (css: string) => void;
  toggleDarkMode: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useNarrativeStore = create<NarrativeState>()(
  persist(
    (set, get) => ({
      // Valores Iniciales
      rawMarkdown: `# Mi Aventura\n\n:::passage | id=inicio\nBienvenido a SagaWeaver.\n[[choice: Empezar | goto=escena1]]\n:::`,
      activeTemplateId: 'default-narrative', // Empezar con una plantilla narrativa base
      loadedCss: '', // Se cargará dinámicamente
      darkMode: true,
      isLoading: false,
      // playerHp: 100, // Ejemplo

      // Setters
      setRawMarkdown: (md) => set({ rawMarkdown: md }),
      setActiveTemplateId: (id) => set({ activeTemplateId: id }),
      setLoadedCss: (css) => set({ loadedCss: css }),
      toggleDarkMode: () => set((state) => {
          const newMode = !state.darkMode;
          document.documentElement.classList.toggle('dark-mode-app', newMode); // Clase para UI principal
          return { darkMode: newMode };
      }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      // setPlayerHp: (hp) => set({ playerHp: hp})
    }),
    {
      name: 'sagaweaver-storage', // Nombre para localStorage
      storage: createJSONStorage(() => localStorage), // Persistir en localStorage
      partialize: (state) => ({
        // Solo persistir lo esencial
        rawMarkdown: state.rawMarkdown,
        activeTemplateId: state.activeTemplateId,
        darkMode: state.darkMode,
      }),
    }
  )
); 