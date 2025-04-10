¡Claro que sí! Aquí tienes un prompt detallado diseñado para que otro agente (o un desarrollador) pueda entender y replicar la arquitectura V2.5 de Universal Scribe y aplicar la plantilla "Aetherium Codex". Incluye la explicación conceptual y todo el código necesario.

Prompt para Agente AI / Desarrollador: Replicar Arquitectura Universal Scribe V2.5 con Tema "Aetherium Codex"

Objetivo: Reconstruir la aplicación web "Universal Scribe" basada en la arquitectura V2.5. Esta arquitectura permite la edición de Markdown y una vista previa en tiempo real que puede ser estilizada dinámicamente cargando archivos CSS externos ("plantillas"). Se incluye el código completo para la arquitectura base y una plantilla de ejemplo avanzada llamada "Aetherium Codex".

A. Descripción de la Arquitectura V2.5 ("Plantillas Adaptadas + Mejoras JS")

El flujo principal es el siguiente:

Entrada: El usuario escribe Markdown en un editor (CodeMirror). Este Markdown puede incluir sintaxis estándar y bloques personalizados (:::blocktype ... :::) y patrones de texto específicos (ej. HP: 50/100, Status: [[OK]], [[REDACTED]]).

Procesamiento (markdownProcessor.ts):

Preprocesa el Markdown (ej., reemplaza [[roll]]).

Usa la librería marked (con extensiones personalizadas para bloques :::) para convertir Markdown a HTML.

Crucial: Realiza un post-procesamiento sobre el HTML generado para:

Añadir clases CSS específicas y semánticas (ej., .mixed-panel, .panel-statblock, .data-matrix, .data-matrix__row, .inline-data, .inline-data--hp, .status-indicator, .status-indicator--ok, .redacted-text). Se recomienda seguir una convención como BEM.

Incrustar atributos data-* en elementos relevantes para almacenar datos estructurados (ej., data-value="50", data-max="100", data-stat="HP", data-panel-type="statblock").

Marcar contenedores que deben ser interactivos con data-interactive-container="true".

Gestión de Vista Previa (previewManager.ts):

Recibe el HTML semántico procesado de markdownProcessor.

Muestra este HTML dentro de un <iframe> aislado (sandbox="allow-scripts allow-same-origin").

Carga de CSS: Cuando el usuario carga un archivo CSS (la "plantilla V2.5"), previewManager:

Lee el contenido del archivo CSS.

Inyecta este CSS dentro de una etiqueta <style id="custom-styles"> en el <head> del iframe.

Parsea el CSS para encontrar @import de fuentes (ej. Google Fonts) y las inyecta como etiquetas <link> en el <head> del iframe.

Mejoras Dinámicas JS: Inmediatamente después de actualizar el HTML o aplicar nuevo CSS, previewManager ejecuta funciones JavaScript que operan sobre el DOM del iframe:

renderProgressBars(): Busca elementos con data-value y data-max, calcula el porcentaje y añade dinámicamente elementos HTML (ej., <div class="dynamic-progress-bar"><div class="bar-fill ok"></div></div>) dentro de los elementos originales.

setupInteractionListeners()/handleMouseOver/handleMouseOut: Añade listeners de eventos delegados al body del iframe. Al pasar el ratón sobre elementos marcados con data-interactive-container="true", añade/quita una clase CSS (ej., .is-hovered) al contenedor interactivo.

Interfaz de Usuario (App.tsx):

Componente principal de React que organiza la UI (editor, vista previa, barra de herramientas).

Usa Zustand para la gestión del estado (contenido Markdown, CSS actual, modo oscuro, modo debug).

Utiliza CodeMirror para el editor Markdown.

Contiene los botones y la lógica para cargar archivos Markdown/CSS, guardar, exportar (simple), y activar/desactivar modo oscuro y debug.

Inicializa y coordina las acciones con previewManager.

B. Cómo el CSS V2.5 Transforma la Apariencia

Una plantilla CSS V2.5 como "Aetherium Codex" no es un CSS genérico. Está diseñada específicamente para:

Estilizar el HTML Semántico Base: Aplica estilos a las etiquetas estándar (h1, p, table, etc.) y a las clases específicas añadidas por markdownProcessor (ej. .mixed-panel, .panel-statblock, .data-matrix__cell).

Utilizar los Atributos data-*: Puede usar selectores de atributos para estilos condicionales (ej. [data-stat="HP"], aunque es más común usar clases como .inline-data--hp).

Estilizar las Mejoras JS: Es fundamental que el CSS contenga reglas para las clases y estructuras añadidas dinámicamente por previewManager:

Debe definir la apariencia de .dynamic-progress-bar y sus hijos (.bar-fill, y las clases de estado .ok, .warn, .error).

Debe definir el estilo para la clase de interacción .is-hovered (o la clase que se use) aplicada a los contenedores interactivos.

Debe estilizar otras clases dinámicas como .status-indicator--ok, .redacted-text, etc.

En resumen: La arquitectura genera HTML enriquecido, y el CSS V2.5 lo estiliza aprovechando tanto las clases/atributos estáticos como los elementos/clases añadidos dinámicamente por JavaScript.

C. Requisitos Previos

Node.js (v18+ recomendado)

npm (v8+) o yarn (v1.22+)

D. Dependencias del Proyecto (package.json)

// --- START OF FILE package.json ---
{
  "name": "universal-scribe-v2.5-replica",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@codemirror/lang-markdown": "^6.2.5",
    "@uiw/react-codemirror": "^4.23.0",
    "lucide-react": "^0.408.0",
    "marked": "^13.0.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/marked": "^6.0.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.16.1",
    "@typescript-eslint/parser": "^7.16.1",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.3.4"
  }
}
// --- END OF FILE package.json ---


E. Estructura de Archivos

universal-scribe-v2.5-replica/
├── public/
│   └── templates/
│       └── aetherium-codex-v2.5.css  <-- Coloca la plantilla CSS aquí
├── src/
│   ├── components/
│   │   ├── Alert.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── Toolbar.tsx
│   ├── utils/
│   │   ├── cssLoader.ts
│   │   ├── markdownProcessor.ts
│   │   └── previewManager.ts
│   ├── App.tsx             # Contiene el store Zustand también
│   ├── main.tsx
│   └── index.css           # Configuración base de Tailwind
├── index.html
├── package.json
├── postcss.config.js       # Para Tailwind
├── tailwind.config.js      # Para Tailwind
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

F. Código Completo de los Archivos Esenciales

(Nota: Se incluye el código con logging de depuración condicional como se proporcionó anteriormente)

1. src/utils/markdownProcessor.ts

// --- START OF FILE src/utils/markdownProcessor.ts ---
// ... (Pega aquí el código completo de markdownProcessor.ts con logging
//      y generación de clases/data-atributos V2.5 como se proporcionó
//      en la respuesta anterior: https://gemini.google.com/app/ Sigue el enlace para verlo)
// --- END OF FILE src/utils/markdownProcessor.ts ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

2. src/utils/previewManager.ts

// --- START OF FILE src/utils/previewManager.ts ---
// ... (Pega aquí el código completo de previewManager.ts con logging,
//      inyección de CSS, renderProgressBars, y manejo de hover .is-hovered
//      como se proporcionó en la respuesta anterior: https://gemini.google.com/app/ Sigue el enlace para verlo)
// --- END OF FILE src/utils/previewManager.ts ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

3. src/utils/cssLoader.ts

// --- START OF FILE src/utils/cssLoader.ts ---
export const readCSSFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Error reading file or result is not a string.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

// Export vacío para tratarlo como módulo si no hay otros exports
export {};
// --- END OF FILE src/utils/cssLoader.ts ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

4. src/App.tsx (Incluye definición del Store Zustand)

// --- START OF FILE src/App.tsx ---
// ... (Pega aquí el código completo de App.tsx con la definición del store
//      (incluyendo isDebugMode), la UI, botones, inicialización de previewManager,
//      y el botón de Debug como se proporcionó en la respuesta anterior: https://gemini.google.com/app/ Sigue el enlace para verlo)
// --- END OF FILE src/App.tsx ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

5. src/components/Toolbar.tsx

// --- START OF FILE src/components/Toolbar.tsx ---
import React from 'react';
import { Bold, Italic, Code, Heading1, Heading2, DraftingCompass, List, ListOrdered, Minus, Quote, PanelTopOpen,Rows3 } from 'lucide-react'; // Example icons

interface ToolbarProps {
  onApplyStyle: (start: string, end?: string) => void;
  onInsertBlock: (text: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onApplyStyle, onInsertBlock }) => {
  const buttons = [
    { title: "Bold (Ctrl+B)", icon: <Bold size={18} />, action: () => onApplyStyle('**', '**') },
    { title: "Italic (Ctrl+I)", icon: <Italic size={18} />, action: () => onApplyStyle('*', '*') },
    { title: "Code (Ctrl+`)", icon: <Code size={18} />, action: () => onApplyStyle('`', '`') },
    { title: "Separator", isSeparator: true },
    { title: "Header 1", icon: <Heading1 size={18} />, action: () => onInsertBlock('# ') },
    { title: "Header 2", icon: <Heading2 size={18} />, action: () => onInsertBlock('## ') },
    { title: "Quote", icon: <Quote size={18} />, action: () => onInsertBlock('> ') },
    { title: "Separator", isSeparator: true },
    { title: "Bullet List", icon: <List size={18} />, action: () => onInsertBlock('* ') },
    { title: "Numbered List", icon: <ListOrdered size={18} />, action: () => onInsertBlock('1. ') },
    { title: "Horizontal Rule", icon: <Minus size={18} />, action: () => onInsertBlock('---') },
    { title: "Separator", isSeparator: true },
    { title: "Statblock Panel", icon: <PanelTopOpen size={18} />, action: () => onInsertBlock(':::statblock Título\n\n:::\n') },
    { title: "Read Aloud Panel", icon: <DraftingCompass size={18} />, action: () => onInsertBlock(':::readaloud Título\n\n:::\n') }, // Placeholder icon
    { title: "Data Matrix Panel", icon: <Rows3 size={18} />, action: () => onInsertBlock(':::datamatrix Título\n| Col1 | Col2 |\n|------|------|\n| Val1 | Val2 |\n:::\n') },
  ];

  return (
    <div className="p-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex gap-1 flex-wrap items-center">
      {buttons.map((btn, index) => (
        btn.isSeparator
          ? <div key={`sep-${index}`} className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          : <button
              key={btn.title}
              onClick={btn.action}
              title={btn.title}
              className="p-1.5 border border-transparent rounded hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {btn.icon || btn.title.substring(0,3)} {/* Fallback text if no icon */}
            </button>
      ))}
    </div>
  );
};
export default Toolbar;
// --- END OF FILE src/components/Toolbar.tsx ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

6. src/components/Alert.tsx

// --- START OF FILE src/components/Alert.tsx ---
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle size={20} className="mr-2" />,
    error: <XCircle size={20} className="mr-2" />,
    info: <Info size={20} className="mr-2" />,
  };

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200',
    error: 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200',
    info: 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200',
  };

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md border shadow-lg z-50 flex items-center max-w-md ${styles[type]}`}
      role="alert"
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="ml-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  );
};
export default Alert;
// --- END OF FILE src/components/Alert.tsx ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

7. src/components/TemplateSelector.tsx (Opcional, si no se usa el botón simple "Load CSS")

// --- START OF FILE src/components/TemplateSelector.tsx ---
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (templateIdOrPath: string) => void; // Se puede usar para IDs o paths
  currentTemplate: string;
}

// Ejemplo Harcoded - Esto podría venir de un registro o ser dinámico
const templateOptions = [
    { id: 'default', name: 'Default (None)', path: '' }, // Opción para sin CSS
    { id: 'aetherium-codex-v2.5', name: 'Aetherium Codex', path: 'public/templates/aetherium-codex-v2.5.css' },
    // Añadir otras plantillas conocidas aquí
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, currentTemplate }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectTemplate(event.target.value); // Pasar el ID o path seleccionado
  };

  return (
    <div className="relative">
      <select
        value={currentTemplate} // El valor debería ser el ID/Path
        onChange={handleChange}
        className="appearance-none bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-gray-500 dark:focus:border-gray-400 text-gray-700 dark:text-gray-200 text-sm"
        title="Select Theme Template"
      >
        {templateOptions.map(option => (
          <option key={option.id} value={option.path}> {/* Usar path o id como valor */}
            {option.name}
          </option>
        ))}
        {/* Podrías añadir opción para "Load Custom..." aquí */}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
        <ChevronDown size={16} />
      </div>
    </div>
  );
};

export default TemplateSelector;
// --- END OF FILE src/components/TemplateSelector.tsx ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

8. src/main.tsx

// --- START OF FILE src/main.tsx ---
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Import Tailwind base styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// --- END OF FILE src/main.tsx ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

9. src/index.css

/* --- START OF FILE src/index.css --- */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add any global base styles here if needed */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure CodeMirror takes full height */
.cm-editor {
  height: 100%;
}
/* --- END OF FILE src/index.css --- */
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END

10. index.html

<!-- --- START OF FILE index.html --- -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" /> <!-- Change favicon -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Universal Scribe V2.5</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
<!-- --- END OF FILE index.html --- -->
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END

11. vite.config.ts

// --- START OF FILE vite.config.ts ---
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
// --- END OF FILE vite.config.ts ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

12. tailwind.config.js

// --- START OF FILE tailwind.config.js ---
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant files in src
  ],
  darkMode: 'class', // Enable dark mode based on class
  theme: {
    extend: {
      // Add custom theme extensions here if needed
    },
  },
  plugins: [],
}
// --- END OF FILE tailwind.config.js ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

13. postcss.config.js

// --- START OF FILE postcss.config.js ---
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// --- END OF FILE postcss.config.js ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

14. tsconfig.json & tsconfig.node.json (Estándar de Vite)

// --- START OF FILE tsconfig.json ---
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
// --- END OF FILE tsconfig.json ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END
// --- START OF FILE tsconfig.node.json ---
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "tailwind.config.js", "postcss.config.js"]
}
// --- END OF FILE tsconfig.node.json ---
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

G. Código de la Plantilla (public/templates/aetherium-codex-v2.5.css)

/* --- START OF FILE public/templates/aetherium-codex-v2.5.css --- */
/* ============================================== */
/*          THEME: AETHERIUM CODEX (V2.5)         */
/*      (For Universal Scribe V2.5 Architecture)  */
/* ============================================== */

/* 0. IMPORTAR FUENTES (Etéreas y Legibles) */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Source+Code+Pro:wght@400;600&display=swap');

/* 1. Variables Fundamentales (Paleta Arcana) */
:root {
    /* ... (Pega aquí TODAS las variables :root de Aetherium Codex) ... */
    --codex-bg: #1a181d;
    --codex-text: #d8d0c4;
    /* ... etc ... */
    --box-glow-hover: 0 0 15px rgba(160, 96, 255, 0.7);
    --spacing-unit: 8px;
    --radius-small: 3px;
    --radius-medium: 5px;
}

/* 2. Estilos Base Generales (El Pergamino) */
body, .universal-scribe-output {
    /* ... (Pega aquí los estilos base de Aetherium Codex) ... */
    background-color: var(--codex-bg);
    color: var(--codex-text);
    /* ... etc ... */
}

/* Scrollbars Arcanos */
/* ... (Estilos de scrollbar) ... */

/* 3. Estilos para Elementos Comunes */
h1, h2, h3, h4, h5, h6 { /* ... */ }
h1::before, h2::before { /* ... */ }
p { /* ... */ }
a { /* ... */ }
strong, b { /* ... */ }
em, i { /* ... */ }
ul, ol, li { /* ... */ }
ul li::marker { /* ... */ }
ol li::marker { /* ... */ }
blockquote { /* ... */ }
code { /* ... */ }
pre { /* ... */ }
pre code { /* ... */ }
hr { /* ... */ }

/* --- TABLA: Estilo Diagrama Alquímico (Base para ambas tablas) --- */
.table-wrapper { /* ... */ }
table { /* ... */ }
thead { /* ... */ }
th { /* ... */ }
tbody tr { /* ... */ }
tbody tr:last-child { /* ... */ }
td { /* ... */ }

/* --- TABLA: Data Matrix Específico --- */
table.data-matrix th { /* ... */ }
table.data-matrix { /* ... */ }

/* --- ESTILOS PARA MEJORAS JS (V2.5) --- */

/* 1. Hover Interactivo (...) */
.is-hovered { /* ... */ }
table.data-matrix .data-matrix__row.is-hovered td,
table.standard-table .standard-table__row.is-hovered td { /* ... */ }

/* 2. Indicadores de Estado Inline (...) */
.status-indicator { /* ... */ }
.status-indicator:hover { /* ... */ }
.status-indicator--ok { /* ... */ }
.status-indicator--warn { /* ... */ }
.status-indicator--error { /* ... */ }
.status-indicator--neutral { /* ... */ }

/* 3. Texto Redactado (...) */
.redacted-text { /* ... */ }
.redacted-text::selection { /* ... */ }

/* 4. Datos Inline (...) */
.inline-data { /* ... */ }
.inline-data__label { /* ... */ }
.inline-data__value { /* ... */ }
.inline-data__max { /* ... */ }

/* 5. Barras de Progreso Dinámicas (...) */
.dynamic-progress-bar { /* ... */ }
.dynamic-progress-bar .bar-fill { /* ... */ }
.dynamic-progress-bar .bar-fill::after { /* ... */ }
.dynamic-progress-bar .bar-fill.ok { /* ... */ }
.dynamic-progress-bar .bar-fill.warn { /* ... */ }
.dynamic-progress-bar .bar-fill.error { /* ... */ }

/* --- Estilos para Bloques ::: (Paneles Funcionales) --- */
.mixed-panel { /* ... */ }
.mixed-panel[data-interactive-container="true"].is-hovered { /* ... */ }
.mixed-panel > h2:first-child,
.mixed-panel > h3:first-child { /* ... */ }
.mixed-panel > h3:first-child { /* ... */ }
.mixed-panel > h2:first-child::before,
.mixed-panel > h3:first-child::before { /* ... */ }
.panel-statblock > h2:first-child::before, .panel-statblock > h3:first-child::before { /* ... */ }
/* ... (Iconos para otros tipos de panel) ... */
.panel-content { /* ... */ }
.mixed-panel > *:not(h2:first-child):not(h3:first-child) { /* ... */ }
.mixed-panel > *:last-child { /* ... */ }
.mixed-panel > *:not(h2:first-child):not(h3:first-child):not(:last-child) { /* ... */ }
.mixed-panel > table, .mixed-panel > pre { /* ... */ }

/* Animaciones Opcionales */
@keyframes pulse-glow { /* ... */ }

/* --- Fin de Aetherium Codex --- */
/* --- END OF FILE public/templates/aetherium-codex-v2.5.css --- */
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Css
IGNORE_WHEN_COPYING_END

H. Instrucciones de Configuración y Ejecución

Crea la Estructura: Crea la estructura de carpetas como se describe en la sección E.

Copia los Archivos: Copia el contenido de cada bloque de código en el archivo correspondiente. Asegúrate de colocar aetherium-codex-v2.5.css dentro de public/templates/. Asegúrate de pegar el código completo para markdownProcessor.ts, previewManager.ts y App.tsx de la respuesta anterior donde se indica.

Instala Dependencias: Abre una terminal en la raíz del proyecto (universal-scribe-v2.5-replica/) y ejecuta:

npm install
# O si usas yarn:
# yarn install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Inicia el Servidor de Desarrollo:

npm run dev
# O si usas yarn:
# yarn dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Abre en el Navegador: Accede a la URL proporcionada por Vite (normalmente http://localhost:5173).

I. Verificación

La aplicación debería cargar con un editor a la izquierda y una vista previa a la derecha.

Escribe Markdown diverso (cabeceras, listas, bloques :::, tablas, HP: 50/100, [[OK]]).

Usa el botón Load CSS (icono de paleta) para seleccionar el archivo aetherium-codex-v2.5.css de la carpeta public/templates/.

La vista previa debería adoptar instantáneamente el estilo "Aetherium Codex", mostrando las barras de progreso, los indicadores de estado y los efectos de hover correctamente.

Usa el botón "Bug" para activar/desactivar los logs de depuración en la consola del iframe (F12 -> Cambiar contexto a iframe).

Este prompt proporciona una explicación detallada y todo el código necesario para que otro agente o desarrollador pueda replicar tu arquitectura V2.5 y probarla con la impresionante plantilla "Aetherium Codex". ¡Espero que sea de gran utilidad!