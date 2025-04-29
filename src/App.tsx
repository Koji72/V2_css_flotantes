import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkGithubBetaBlockquoteAdmonitions from 'remark-github-beta-blockquote-admonitions';
import remarkCustomPanels from './utils/remarkCustomPanels';
import remarkEnsureDirectiveBrackets from './utils/remarkEnsureDirectiveBrackets';
import remarkCornerDirectives from './utils/remarkCornerDirectives';
// import remarkCollapse from 'remark-collapse'; // Incompatible, comentado
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Importar TemplateManager
import { TemplateManager } from './utils/templateManager';
// Importar iconos de Lucide
import {
  Bold, Italic, Heading1, Heading2, List, Quote, Code, Link2, Image as ImageIcon,
  Table, Strikethrough, ListTodo, Superscript, Subscript, Highlighter, ChevronsUpDown,
  Moon, Sun,
  PanelTopOpen,
  Minus,
  ListOrdered,
  Palette,
  Square,
  LayoutGrid,
  FileText,
  Scroll,
  Gem,
  Skull,
  Tag
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import './styles/index.css';
import './styles/layout/floating-layout.css';
// Importar fix de visibilidad de texto
import '../public/styles/text-visibility-fix.css';

const AUTOSAVE_KEY = 'markdown-editor-content';
const THEME_ID_KEY = 'markdown-editor-theme-id'; // Renombrar key para claridad
const DEFAULT_THEME_ID = 'lv426-distress-signal'; // CORREGIDO: Usar ID válido por defecto
const AUTOSAVE_DELAY = 300000; // Milisegundos (5 minutos)

// Contenido Markdown por defecto si no hay nada guardado
const DEFAULT_MARKDOWN_CONTENT = `
# ¡Bienvenido!

Este es un editor Markdown con vista previa en vivo.

Escribe Markdown en el panel izquierdo y ve el resultado HTML renderizado a la derecha.

## Paneles de Ejemplo

Intenta cambiar la plantilla o el estilo visual usando los menús desplegables.

:::panel{title="Panel Básico"}
Este es un panel simple.
:::

:::panel{style=note title="Panel de Nota"}
Este panel usa el estilo semántico 'note'.
:::
`;

// --- Definición de Plantillas de Panel ---
const panelTemplates = [
  {
    label: "Básico",
    dependency: 5, // Muy dependiente del tema base
    template: '\n:::panel{title="Título"}\nContenido...\n:::\n',
    cursorOffset: 16
  },
  {
    label: "Nota",
    dependency: 4, // Estilo semántico, depende bastante del tema para colores base
    template: '\n:::panel{style=note title="Nota"}\nContenido...\n:::\n',
    cursorOffset: 26
  },
  {
    label: "Advertencia",
    dependency: 4, // Estilo semántico
    template: '\n:::panel{style=warning title="Advertencia"}\nContenido...\n:::\n',
    cursorOffset: 29
  },
  {
    label: "Éxito",
    dependency: 4, // Estilo semántico
    template: '\n:::panel{style=success title="Éxito"}\nContenido...\n:::\n',
    cursorOffset: 27
  },
  {
    label: "Peligro",
    dependency: 4, // Estilo semántico
    template: '\n:::panel{style=danger title="Peligro"}\nContenido...\n:::\n',
    cursorOffset: 27
  },
  {
    label: "HUD Frame",
    dependency: 2, // Estilo visual fuerte
    template: '\n:::panel{style=hud-frame title="HUD"}\nContenido...\n:::\n',
    cursorOffset: 31
  },
  {
    label: "Glass",
    dependency: 3, // Efecto visual, pero puede heredar colores/bordes
    template: '\n:::panel{style=glass title="Glass"}\nContenido...\n:::\n',
    cursorOffset: 27
  },
  { label: "Data Stream", dependency: 1, template: '\n:::panel{style=data-stream title="Data Stream"}\nContenido...\n:::\n', cursorOffset: 33 },
  { label: "Blueprint", dependency: 2, template: '\n:::panel{style=blueprint title="Blueprint"}\nContenido...\n:::\n', cursorOffset: 31 },
  { label: "Alien Tech", dependency: 2, template: '\n:::panel{style=alien-tech title="Alien Tech"}\nContenido...\n:::\n', cursorOffset: 32 },
  { label: "Retro Cassette", dependency: 2, template: '\n:::panel{style=retro-cassette title="Retro Cassette"}\nContenido...\n:::\n', cursorOffset: 36 },
  { label: "Grimoire Page", dependency: 2, template: '\n:::panel{style=grimoire-page title="Grimoire Page"}\nContenido...\n:::\n', cursorOffset: 35 },
  { label: "Elven Scroll", dependency: 2, template: '\n:::panel{style=elven-scroll title="Elven Scroll"}\nContenido...\n:::\n', cursorOffset: 34 },
  { label: "Dwarven Stone", dependency: 2, template: '\n:::panel{style=dwarven-stone title="Dwarven Stone"}\nContenido...\n:::\n', cursorOffset: 35 },
  { label: "Steampunk Gauge", dependency: 2, template: '\n:::panel{style=steampunk-gauge title="TÍTULO"}\nContenido...\n:::\n', cursorOffset: 41 },
  { label: "Minimalist Card", dependency: 3, template: '\n:::panel{style=minimalist-card title="Minimalist Card"}\nContenido...\n:::\n', cursorOffset: 39 },
  { label: "Brutalist Web", dependency: 2, template: '\n:::panel{style=brutalist-web title="Brutalist Web"}\nContenido...\n:::\n', cursorOffset: 35 },
  { label: "Paper Cutout", dependency: 3, template: '\n:::panel{style=paper-cutout title="Paper Cutout"}\nContenido...\n:::\n', cursorOffset: 34 },
  {
    label: "Reality Glitch (Cosmic)",
    dependency: 1, // Estilo muy específico
    template: '\n:::panel{style=reality-glitch title="Reality Glitch"}\nContenido...\n:::\n',
    cursorOffset: 39
  },
  {
    label: "Nanite Construct (Cosmic)",
    dependency: 1, // Estilo muy específico
    template: '\n:::panel{style=nanite-construct title="Nanite Construct"}\nContenido...\n:::\n',
    cursorOffset: 41
  },
  {
    label: "Crystal Matrix (Cosmic)",
    dependency: 1, // Estilo muy específico
    template: '\n:::panel{style=crystal-matrix title="Crystal Matrix"}\nContenido...\n:::\n',
    cursorOffset: 39
  },
  {
    label: "Void Touched (Cosmic)",
    dependency: 2, // Estilo específico, pero podría heredar algo
    template: '\n:::panel{style=void-touched title="Void Touched"}\nContenido...\n:::\n',
    cursorOffset: 37
  },
  {
    label: "Scanline Terminal (Cosmic)",
    dependency: 1, // Estilo muy específico
    template: '\n:::panel{style=scanline-terminal title="Scanline Terminal"}\nContenido...\n:::\n',
    cursorOffset: 42
  },
  {
    label: "Etiqueta de Prueba (Arkham)",
    icon: <Tag size={16} />,
    dependency: 4,
    template: '\n:::evidence-tag{title="Prueba #17" case="Caso Dunwich"}\nItem: Fragmento de Tela Manchada\nFecha: 1928-05-15\n:::\n',
    cursorOffset: 21
  },
  {
    label: "Statblock",
    icon: <Skull size={16} />,
    dependency: 4, // El panel BASE depende bastante
    template: '\n:::statblock{title="Nombre Monstruo" style="monster-manual-dark"}\n**AC:** 10 | **HP:** 10/10 | **Speed:** 30 ft.\n**STR:** 10 (+0) **DEX:** 10 (+0) **CON:** 10 (+0) **INT:** 10 (+0) **WIS:** 10 (+0) **CHA:** 10 (+0)\n---\n#### Acciones\nAcción 1: Descripción.\n---\n#### Rasgos\nRasgo 1: Descripción.\n:::\n',
    cursorOffset: 32
  },
  {
    label: "Hoja de Personaje",
    icon: <FileText size={16} />,
    dependency: 4, // El panel BASE depende bastante
    template: '\n:::character-sheet{title="Nombre Personaje" style="data-stream"}\n#### Atributos\n<div class="stat-item"><span class="stat-key">Fuerza:</span> <span class="stat-value">10 (+0)</span></div>\n<div class="stat-item"><span class="stat-key">Destreza:</span> <span class="stat-value">10 (+0)</span></div>\n{/* ... más atributos ... */}\n\n#### Habilidades\n<ul class="skills-list">\n    <li>Habilidad +0</li>\n</ul>\n\n#### Inventario\n<div class="inventory-grid">\n    <div class="item-slot">Objeto 1</div>\n    <div class="item-slot"></div>{/* Slot vacío */}\n</div>\n\n#### Notas\nNotas del personaje...\n:::\n',
    cursorOffset: 37
  },
  {
    label: "Objeto Mágico",
    icon: <Gem size={16} />,
    dependency: 3, // El panel BASE tiene dependencia moderada (rareza fija)
    template: '\n:::magic-item{title="Nombre Objeto" style="arcane-relic"}\n<div class="item-description">\nDescripción del objeto...\n</div>\n<div class="item-rarity item-rarity--common">Común</div>\n:::\n',
    cursorOffset: 32
  },
];

// --- Definición de Plantillas de Tabla Estilizada ---
const tableStyleTemplates = [
  {
    label: "Básica",
    template: '\n| Cabecera 1 | Cabecera 2 |\n| :--------- | :--------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n\n',
    cursorOffset: 14 // Dentro de la primera cabecera
  },
  {
    label: "Cyber Matrix",
    template: '\n:::table{.table-style--cyber-matrix}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n',
    cursorOffset: 35 // Ajustado
  },
  {
    label: "Arcane Runes",
    template: '\n:::table{.table-style--arcane-runes}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n',
    cursorOffset: 35 // Ajustado
  },
  {
    label: "Holo Projection",
    template: '\n:::table{.table-style--holo-projection}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n',
    cursorOffset: 38 // Ajustado
  },
  {
    label: "Scrap Datasheet",
    template: '\n:::table{.table-style--scrap-datasheet}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n',
    cursorOffset: 40 // Ajustado
  },
  {
    label: "Liquid Metal",
    template: '\n:::table{.table-style--liquid-metal}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n',
    cursorOffset: 35 // Ajustado
  }
];

// --- Helper Functions for Panel Attribute Manipulation ---

// Helper function to parse attributes within {}
// Handles simple cases with double quotes, might need refinement for complex values
const parsePanelAttributes = (attrString: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  
  // Eliminar espacios al principio y al final
  attrString = attrString.trim();
  
  // Si la cadena está vacía, devolver un objeto vacío
  if (!attrString) {
    return attributes;
  }
  
  // Eliminar las llaves si existen
  if (attrString.startsWith('{') && attrString.endsWith('}')) {
    attrString = attrString.slice(1, -1);
  }
  
  // Dividir por espacios, pero respetando las comillas
  const regex = /(\w+)\s*=\s*"([^"]*)"|(\w+)\s*=\s*([^\s]+)/g;
  let match;
  
  while ((match = regex.exec(attrString)) !== null) {
    // Si el atributo tiene comillas
    if (match[1] && match[2]) {
      attributes[match[1]] = match[2];
    }
    // Si el atributo no tiene comillas
    else if (match[3] && match[4]) {
      attributes[match[3]] = match[4];
    }
  }
  
  return attributes;
};

// Helper function to serialize attributes back into a string
const serializePanelAttributes = (attributes: Record<string, string>): string => {
  if (Object.keys(attributes).length === 0) {
    return '';
  }
  
  return '{' + Object.entries(attributes)
    .map(([key, value]) => {
      // Si el valor contiene espacios o caracteres especiales, usar comillas
      if (value.includes(' ') || value.includes('=') || value.includes('"')) {
        return `${key}="${value}"`;
      }
      return `${key}=${value}`;
    })
    .join(' ') + '}';
};

// Helper function to update the class attribute specifically for panel styles
const updatePanelStyleClass = (currentClasses: string | undefined, newStyleId: string): string => {
  const baseClasses = (currentClasses || '')
    .split(' ')
    .filter(cls => cls && !cls.startsWith('panel-style--')); // Remove old panel styles

  if (newStyleId) {
    baseClasses.push(`panel-style--${newStyleId}`);
  }

  return baseClasses.filter(Boolean).join(' '); // Join valid classes, remove empty strings
};

const App: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [content, setContent] = useState(() => {
    const savedContent = localStorage.getItem(AUTOSAVE_KEY);
    return savedContent !== null ? savedContent : DEFAULT_MARKDOWN_CONTENT;
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(DEFAULT_THEME_ID); // Usar ID en estado
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para el input de archivo
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false); // Bandera para carga inicial
  const previewRef = useRef<HTMLDivElement>(null); // <-- Ref para la vista previa
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref para timeout
  const scrollingPanel = useRef<'editor' | 'preview' | null>(null); // Para saber quién inició
  const animationFrameRef = useRef<number | null>(null); // Para throttling
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Para manejar qué dropdown está abierto
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref para detectar clics fuera

  // Refs para funciones usadas en callbacks para evitar problemas de dependencia/orden
  const handleImageButtonClickRef = useRef<() => void>(() => {});
  const insertTableTemplateRef = useRef<() => void>(() => {});
  const applyFormatRef = useRef<typeof applyFormat>(() => {});

  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    // Initialize theme from localStorage or default
    const savedThemeId = localStorage.getItem(THEME_ID_KEY);
    // Validar si el ID guardado existe en las plantillas disponibles (opcional pero recomendado)
    // Por ahora, simplemente usamos el guardado o el por defecto
    const initialId = savedThemeId || DEFAULT_THEME_ID;
    console.log(`[Theme Init] Initializing theme. Saved: ${savedThemeId}, Default: ${DEFAULT_THEME_ID}, Chosen: ${initialId}`);
    // Asegurarse de que TemplateManager también se inicialice con este ID si es necesario
    // TemplateManager.getInstance().setCurrentTemplateId(initialId); // Podría ser necesario
    return initialId;
  });
  // --- NEW STATE for Visual Style Dropdown ---
  const [availableVisualStyles, setAvailableVisualStyles] = useState<{ id: string; name: string }[]>([]);
  const [selectedVisualStyle, setSelectedVisualStyle] = useState<string>(''); // Default to 'None'

  useEffect(() => {
    console.log('[Initial Load] useEffect triggered.');
    if (!hasLoadedRef.current) {
      const savedContent = localStorage.getItem(AUTOSAVE_KEY);
      console.log(`[Initial Load] localStorage.getItem returned: ${savedContent ? `"${savedContent.substring(0, 50)}..."` : '(null or empty)'}`);
      if (savedContent) {
        console.log('[Initial Load] Found saved content. Calling setContent...');
        setContent(savedContent);
        console.log('[Initial Load] setContent called.');
      } else {
        console.log('[Initial Load] No saved content found in localStorage.');
      }
      // Cargar tema CSS guardado
      const savedTheme = localStorage.getItem(THEME_ID_KEY);
      if (savedTheme) {
          setActiveTemplateId(savedTheme);
          console.log(`[Initial Load] Loaded theme: ${savedTheme}`);
      } else {
          console.log(`[Initial Load] No saved theme found, using default: ${DEFAULT_THEME_ID}`);
      }
      hasLoadedRef.current = true;
      console.log('[Initial Load] hasLoadedRef set to true.');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      console.log('[Autosave] Skipping initial autosave check.');
      return;
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      console.log('[Autosave] Saving content to localStorage...');
      localStorage.setItem(AUTOSAVE_KEY, content);
      toast.success('Contenido auto-guardado!');
    }, AUTOSAVE_DELAY);
    
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [content]);

  // Efecto para CAMBIAR la hoja de estilos del tema y GUARDAR la selección
  useEffect(() => {
    console.log(`[Theme Effect] Running for activeTemplateId: ${activeTemplateId}`);
    let themeLink = document.getElementById('theme-stylesheet') as HTMLLinkElement;
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'theme-stylesheet';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
      console.log('[Theme Effect] Created theme <link> tag.');
    }
    // *** CORRECCIÓN: Añadir .css al ID para formar el nombre de archivo ***
    const themeFilename = `${activeTemplateId}.css`;
    const newHrefBase = `/templates/${themeFilename}`;
    const currentHref = themeLink.getAttribute('href');
    
    const timestamp = Date.now();
    const newHrefWithTimestamp = `${newHrefBase}?t=${timestamp}`;
    
    console.log(`[Theme Effect] Current href: ${currentHref}`);
    console.log(`[Theme Effect] Attempting to set href to: ${newHrefWithTimestamp}`); 

    if (!currentHref || !currentHref.startsWith(newHrefBase)) {
        themeLink.href = newHrefWithTimestamp;
        console.log(`[Theme Effect] Applied theme via href: ${newHrefWithTimestamp}`);
    } else {
        if (currentHref !== newHrefWithTimestamp) {
             themeLink.href = newHrefWithTimestamp;
             console.log(`[Theme Effect] Force re-applied theme with new timestamp: ${newHrefWithTimestamp}`);
        } else {
             console.log(`[Theme Effect] Effect ran for ${activeTemplateId}, base href is correct and timestamp seems current. No change made.`);
        }
    }

    if (hasLoadedRef.current) {
        localStorage.setItem(THEME_ID_KEY, activeTemplateId); // Usar nueva key
        console.log(`[Theme Effect] Saved theme ID: ${activeTemplateId} to localStorage`);
    }

  }, [activeTemplateId]); // Depender del ID

  // --- NEW useEffect to update visual styles when theme changes ---
  useEffect(() => {
    console.log(`Theme changed to: ${selectedTheme}, updating visual styles...`);
    const styles = TemplateManager.getInstance().getVisualStylesForTemplate(selectedTheme);
    console.log("Available visual styles:", styles);
    setAvailableVisualStyles(styles);
    setSelectedVisualStyle(''); // Reset visual style selection when theme changes
  }, [selectedTheme]);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // --- NEW DEBUG LOGS ---
    console.log(`[handleEditorChange] CALLED. Event target value length: ${e.target.value.length}`);
    // --- END NEW DEBUG LOG ---
    console.log(`[handleEditorChange] New content length: ${e.target.value.length}`); // Existing log
    setContent(e.target.value);
    // --- NEW DEBUG LOG ---
    console.log(`[handleEditorChange] setContent has been called.`);
    // --- END NEW DEBUG LOG ---
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  }, [setLeftWidth, isResizing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => resize(e);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
    };
  }, [isResizing, resize, stopResizing]);

  const insertText = useCallback((textToInsert: string, cursorPosOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;

    const newText = currentContent.substring(0, start) + textToInsert + currentContent.substring(end);
    const newCursorPos = cursorPosOffset !== undefined ? start + cursorPosOffset : start + textToInsert.length;

    setContent(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [setContent]);

  // Definir applyFormat (sin useCallback inicialmente, se asignará a ref)
  function applyFormat (format: string, type: 'wrap' | 'line' | 'insert') {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;
    const selectedText = currentContent.substring(start, end);

    if (type === 'wrap') {
      if (start === end) insertText(format + format, format.length);
      else insertText(format + selectedText + format, start + format.length + selectedText.length + format.length);
    } else if (type === 'line') {
      const lineStart = currentContent.lastIndexOf('\n', start - 1) + 1;
      const needsNewline = lineStart > 0 && currentContent[lineStart - 1] !== '\n';
      const prefix = needsNewline ? '\n' : '';
      const lineContent = currentContent.substring(lineStart);
      const textBeforeLine = currentContent.substring(0, lineStart);
      const textToInsert = prefix + format + lineContent;
      setContent(textBeforeLine + textToInsert); // Actualización directa
      setTimeout(() => {
        if (textareaRef.current) {
          const cursor = start + prefix.length + format.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(cursor, cursor);
        }
      }, 0);
    } else if (type === 'insert') {
      let cursorPosOffset = format.length;
      if (format.includes('[](url)') || format.includes('![Alt text](url)')) {
        cursorPosOffset = format.indexOf('(') + 1;
      }
      insertText(format, cursorPosOffset);
    }
  }
  // Asignar la función al ref en cada render para que handleKeyDown tenga la última versión
  applyFormatRef.current = applyFormat; 

  // Asignar handleImageButtonClick a ref
  handleImageButtonClickRef.current = () => {
    fileInputRef.current?.click();
  };
  
  // Asignar insertTableTemplate a ref
  insertTableTemplateRef.current = () => {
    const tableTemplate =
`\n| Cabecera 1 | Cabecera 2 |\n| :--------- | :--------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n\n`;
    insertText(tableTemplate, tableTemplate.length);
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const MAX_SIZE_MB = 1;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Imagen > ${MAX_SIZE_MB} MB`);
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const altText = file.name.replace(/\.[^/.]+$/, "");
      const imageMarkdown = `![${altText}](${base64String})\n`;
      insertText(imageMarkdown);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [insertText]);

  // handleKeyDown ahora usa las funciones a través de refs
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentApplyFormat = applyFormatRef.current;
    const currentHandleImageButtonClick = handleImageButtonClickRef.current;
    const currentInsertTableTemplate = insertTableTemplateRef.current;

    if (e.ctrlKey || e.metaKey) {
      let handled = true;
      if (e.shiftKey) { // Combos con Shift
        switch (e.key.toLowerCase()) {
          case 'c': currentApplyFormat('- [ ] ', 'line'); break; // Checklist
          case 'p': currentApplyFormat('<sup>', 'wrap'); break; // Superscript (Power)
          case 'b': currentApplyFormat('<sub>', 'wrap'); break; // Subscript (Base/Bottom)
          case 'h': currentApplyFormat('<mark>', 'wrap'); break; // Highlight (Mark)
          case 'd': insertText('\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n'); handled = true; break; // Details/Collapse
          default: handled = false;
        }
      } else { // Solo Ctrl/Cmd sin Shift
        switch (e.key.toLowerCase()) {
          case 'b': currentApplyFormat('**', 'wrap'); break;
          case 'i': currentApplyFormat('*', 'wrap'); break;
          case '1': currentApplyFormat('# ', 'line'); break;
          case '2': currentApplyFormat('## ', 'line'); break;
          case 'l': currentApplyFormat('- ', 'line'); break;
          case 'q': currentApplyFormat('> ', 'line'); break;
          case '`': currentApplyFormat('`', 'wrap'); break;
          case 'k': currentApplyFormat('[](url)', 'insert'); break;
          case 'g': currentHandleImageButtonClick(); break;
          case 't': currentInsertTableTemplate(); break;
          case 's': currentApplyFormat('~~', 'wrap'); break;
          default: handled = false;
        }
      }

      if (handled) {
        e.preventDefault();
        console.log(`[handleKeyDown] Handled shortcut: ${e.shiftKey ? 'Ctrl/Cmd+Shift+' : 'Ctrl/Cmd+'}${e.key}`);
      }
    }
  }, [insertText]); // <- Añadir insertText como dependencia

  // Función para insertar la plantilla <details>
  const insertDetailsTemplate = useCallback(() => {
    const template = '\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n';
    // Colocar el cursor justo después de <summary>
    insertText(template, template.indexOf('</summary>'));
  }, [insertText]);

  // Función THROTTLED para sincronizar scroll
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (!textareaRef.current || !previewRef.current) return;

    const editor = textareaRef.current;
    const preview = previewRef.current;

    // Cancelar frame anterior si existe
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Programar la sincronización en el siguiente frame
    animationFrameRef.current = requestAnimationFrame(() => {
      // Solo sincronizar si el scroll NO fue iniciado por el panel destino
      if (scrollingPanel.current === source) {
        if (source === 'editor') {
          const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
          // Solo aplicar si hay espacio para scroll
          if (preview.scrollHeight > preview.clientHeight) {
             preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
          }
        } else { // source === 'preview'
          const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
          // Solo aplicar si hay espacio para scroll
          if (editor.scrollHeight > editor.clientHeight) {
            editor.scrollTop = scrollRatio * (editor.scrollHeight - editor.clientHeight);
          }
        }
      }
    });

    // Resetear quién inició el scroll después de un cooldown
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      scrollingPanel.current = null;
    }, 150); // Cooldown un poco más largo: 150ms

  }, []);

  // Listener para scroll del editor
  const handleEditorScroll = useCallback(() => {
    if (!scrollingPanel.current) { // Si nadie ha iniciado scroll recientemente
      scrollingPanel.current = 'editor';
    }
    syncScroll('editor');
  }, [syncScroll]);

  // Listener para scroll de la vista previa
  const handlePreviewScroll = useCallback(() => {
    if (!scrollingPanel.current) { // Si nadie ha iniciado scroll recientemente
      scrollingPanel.current = 'preview';
    }
    syncScroll('preview');
  }, [syncScroll]);

  // Definir la función insertOrWrapBlock (si no existe ya una similar)
  // O simplemente usar insertText directamente si es solo inserción
  const insertBlock = useCallback((textToInsert: string) => {
    insertText(textToInsert);
  }, [insertText]);

  // Hook para cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null); // Cerrar cualquier dropdown abierto
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Dependencia del ref

  // --- Toolbar Buttons Definition ---
  // Quitar tipos explícitos por ahora para evitar errores complejos del linter
  /*
  type PanelOption = { label: string; template: string; cursorOffset: number };
  type ThemeOption = { label: string; fileName: string; action: () => void };

  type ToolbarButton = 
    | { isSeparator: true } 
    | { title: string; icon: JSX.Element; action: () => void; isDropdown?: false } 
    | { title: string; icon: JSX.Element; isDropdown: true; dropdownId: 'panel-inserter'; options: PanelOption[] }
    | { title: string; icon: JSX.Element; isDropdown: true; dropdownId: 'theme-selector'; options: ThemeOption[] };
  */

  // Usar 'any' temporalmente para el tipo del array de botones
  console.log("[Toolbar Definition] Contenido de panelTemplates:", panelTemplates); // <-- AÑADIR ESTE LOG
  const buttons: any[] = [
    // Grupo Formato Básico
    { title: "Negrita (Ctrl+B)", icon: <Bold size={18} />, action: () => applyFormatRef.current('**', 'wrap') },
    { title: "Cursiva (Ctrl+I)", icon: <Italic size={18} />, action: () => applyFormatRef.current('*', 'wrap') },
    { title: "Tachado (Ctrl+S)", icon: <Strikethrough size={18} />, action: () => applyFormatRef.current('~~', 'wrap') },
    { title: "Resaltado (Ctrl+Shift+H)", icon: <Highlighter size={18} />, action: () => applyFormatRef.current('<mark>', 'wrap') },
    { title: "Superíndice (Ctrl+Shift+P)", icon: <Superscript size={18} />, action: () => applyFormatRef.current('<sup>', 'wrap') },
    { title: "Subíndice (Ctrl+Shift+B)", icon: <Subscript size={18} />, action: () => applyFormatRef.current('<sub>', 'wrap') },
    { isSeparator: true },
    // Grupo Encabezados
    { title: "Encabezado 1 (Ctrl+1)", icon: <Heading1 size={18} />, action: () => insertBlock('# ') },
    { title: "Encabezado 2 (Ctrl+2)", icon: <Heading2 size={18} />, action: () => insertBlock('## ') },
    { isSeparator: true },
    // Grupo Listas
    { title: "Lista Desordenada (Ctrl+L)", icon: <List size={18} />, action: () => insertBlock('- ') },
    { title: "Lista Ordenada", icon: <ListOrdered size={18} />, action: () => insertBlock('1. ') }, // Añadir si se desea
    { title: "Lista de Tareas (Ctrl+Shift+C)", icon: <ListTodo size={18} />, action: () => insertBlock('- [ ] ') },
    { isSeparator: true },
    // Grupo Bloques
    { title: "Cita (Ctrl+Q)", icon: <Quote size={18} />, action: () => insertBlock('> ') },
    { title: "Código (Ctrl+`)", icon: <Code size={18} />, action: () => applyFormatRef.current('`', 'wrap') },
    { title: "Bloque Colapsable (Ctrl+Shift+D)", icon: <ChevronsUpDown size={18} />, action: () => insertText('\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n') },
    {
      title: "Insertar Panel",
      icon: <PanelTopOpen size={18} />,
      isDropdown: true, 
      dropdownId: 'panel-inserter',
      options: panelTemplates
    },
    { isSeparator: true },
    // Grupo Inserciones
    { title: "Enlace (Ctrl+K)", icon: <Link2 size={18} />, action: () => applyFormatRef.current('[](url)', 'insert') },
    { title: "Imagen (Ctrl+G)", icon: <ImageIcon size={18} />, action: () => handleImageButtonClickRef.current() },
    {
      title: "Insertar Tabla",
      icon: <Table size={18} />,
      isDropdown: true,
      dropdownId: 'table-inserter',
      options: tableStyleTemplates
    },
    { title: "Línea Horizontal", icon: <Minus size={18} />, action: () => insertText('\n\n---\n\n') },
    { isSeparator: true },
    // Grupo Otros
    {
      title: "Seleccionar Tema",
      icon: <Palette size={18} />, 
      tooltip: 'Cambiar Tema',
      isDropdown: true,
      dropdownId: 'theme-selector',
      options: TemplateManager.getInstance().getAvailableTemplates().map(template => ({
        label: template.name,
        action: () => setActiveTemplateId(template.id) // Asegurar que actualiza activeTemplateId
      }))
    },
    { title: "Cambiar Tema Claro/Oscuro", icon: isDarkMode ? <Sun size={18} /> : <Moon size={18} />, action: toggleTheme },
  ];

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newThemeId = event.target.value;
    console.log("Theme selected:", newThemeId);
    setSelectedTheme(newThemeId);
    TemplateManager.getInstance().setCurrentTemplateId(newThemeId);
    // Preview update logic likely happens elsewhere based on TemplateManager state
  };

  // --- MODIFIED Handler for Visual Style Dropdown Change ---
  const handleVisualStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyleId = event.target.value;
    console.log("Visual style selected:", newStyleId);
    setSelectedVisualStyle(newStyleId);

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const currentContent = content; // Use state variable

    // 1. Find the start of the relevant panel block (looking backwards)
    let panelStartIndex = -1;
    let searchIndex = cursorPosition;
    let safetyCounter = 0; // Prevent infinite loops
    const maxSearchDepth = 500; // Limit search depth

    while (searchIndex >= 0 && safetyCounter < maxSearchDepth) {
        const lineStart = currentContent.lastIndexOf('\n', searchIndex - 1) + 1;
        const lineEnd = currentContent.indexOf('\n', lineStart);
        const currentLine = currentContent.substring(lineStart, lineEnd !== -1 ? lineEnd : currentContent.length);

        if (currentLine.trim().startsWith(':::panel{')) {
            // Check if cursor is *after* the start of this panel definition
            if (cursorPosition >= lineStart) {
                 panelStartIndex = lineStart;
                 console.log(`Found panel start candidate at index: ${panelStartIndex} on line: "${currentLine.trim()}"`);
                 break; // Found the most recent panel definition line before/at the cursor
            }
        }
        
        // If the line is the closing :::, stop searching backwards for this block
        if (currentLine.trim() === ':::') {
            // We might want to find the opening tag before this closing one
            // For now, just stop if we hit a closing tag before an opening one
             console.log("Found closing ::: before opening { while searching back.");
             // break; // Option: Stop search if block closed before cursor
        }

        if (lineStart === 0) break; // Reached start of document
        searchIndex = lineStart - 1; // Move to the end of the previous line
        safetyCounter++;
    }
    
    if (panelStartIndex === -1) {
        console.log("No relevant panel block found before cursor.");
        toast.error("Coloca el cursor dentro o justo después de un bloque :::panel{...} para aplicar el estilo.");
        return; // No panel found before cursor
    }

    // Find the actual end of the definition line, including the closing brace
    const definitionLineEnd = currentContent.indexOf('\n', panelStartIndex);
    const originalDefinitionLine = currentContent.substring(
        panelStartIndex, 
        definitionLineEnd !== -1 ? definitionLineEnd : currentContent.length
    );

    const closingBraceIndex = originalDefinitionLine.indexOf('}');
    if (closingBraceIndex === -1) {
        console.error(`Malformed panel definition found at index ${panelStartIndex}: No closing brace '}' on the line.`);
        toast.error("Error: El formato del panel :::panel{...} es incorrecto.");
        return; // Malformed panel definition line
    }

    const attributesString = originalDefinitionLine.substring(':::panel{'.length, closingBraceIndex);
    console.log("Extracted attributes string:", attributesString);

    // 3. Parse attributes
    const attributes = parsePanelAttributes(attributesString);
    console.log("Parsed attributes:", attributes);

    // 4. Update class attribute
    const currentClass = attributes['class'];
    const newClassValue = updatePanelStyleClass(currentClass, newStyleId);

    if (newClassValue) {
      attributes['class'] = newClassValue;
    } else {
      delete attributes['class']; // Remove class attribute if empty
    }
    console.log("Updated attributes:", attributes);

    // 5. Serialize attributes back
    const newAttributesString = serializePanelAttributes(attributes);
    console.log("Serialized attributes:", newAttributesString);

    // 6. Reconstruct the panel definition line
    const newDefinitionLine = `:::panel{${newAttributesString}}`;
    console.log("New definition line:", newDefinitionLine);

    // 7. Update content state
    const newContent = currentContent.substring(0, panelStartIndex) +
                       newDefinitionLine +
                       currentContent.substring(panelStartIndex + originalDefinitionLine.length);

    setContent(newContent); // Update the main state
    toast.success(`Estilo '${TemplateManager.getInstance().getVisualStyleDetail(newStyleId)?.name || 'Ninguno'}' aplicado.`);

    // Optional: Restore cursor position intelligently
     setTimeout(() => {
        if (textareaRef.current) {
            const lengthDifference = newDefinitionLine.length - originalDefinitionLine.length;
            // Place cursor at the end of the modified definition line
            const newCursorPosition = panelStartIndex + newDefinitionLine.length; 
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }, 0);
  };

  return (
    <>
      {/* SVG Filter Definition for Reality Glitch */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="reality-glitch-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.005" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={15} xChannelSelector="R" yChannelSelector="G" result="distorted" />
            <feComponentTransfer in="distorted" result="adjusted">
              <feFuncR type="linear" slope={1.2} intercept={-0.1}/>
              <feFuncG type="linear" slope={1.2} intercept={-0.1}/>
              <feFuncB type="linear" slope={1.2} intercept={-0.1}/>
            </feComponentTransfer>
            <feGaussianBlur in="adjusted" stdDeviation={1} result="blurred"/>
            <feBlend mode="screen" in="SourceGraphic" in2="blurred"/>
          </filter>
        </defs>
      </svg>

      <div className="app">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: isDarkMode ? '#333' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
            },
            success: {
              duration: 3000,
            },
          }}
        />
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <div className="toolbar">
          {/* Theme Selector Dropdown (Ensure this exists) */}
          <select id="theme-selector" value={selectedTheme} onChange={handleThemeChange} className="dropdown">
            {TemplateManager.getInstance().getAvailableTemplates().map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          {/* --- ADDING the Visual Style Selector Dropdown --- */}
          <select 
            id="visual-style-selector" 
            value={selectedVisualStyle} 
            onChange={handleVisualStyleChange} 
            className="dropdown" 
            disabled={availableVisualStyles.length <= 1} // Disable if only "None" is available
          >
            {availableVisualStyles.map((style) => (
              <option key={style.id || 'none'} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>

          {buttons.map((btn, index) => {
            // Usar comprobaciones más simples y acceso directo a propiedades
            if (btn.isSeparator) {
              return <div key={`sep-${index}`} className="toolbar-separator"></div>;
            } else if (btn.isDropdown && btn.dropdownId === 'panel-inserter') {
              const isOpen = activeDropdown === btn.dropdownId;
              return (
                <div key={btn.title} className="toolbar-dropdown-container" ref={isOpen ? dropdownRef : null}>
                   <button 
                    title={btn.title} 
                    onClick={() => setActiveDropdown(isOpen ? null : btn.dropdownId)}
                    className={`toolbar-button ${isOpen ? 'active' : ''}`}
                   >
                     {btn.icon}
                   </button>
                  {isOpen && (
                    <ul className="toolbar-dropdown-menu">
                      {btn.options.map((option: any) => ( // Usar any para la opción
                        <li key={option.label} className="toolbar-dropdown-item">
                          <button onClick={() => {
                            insertText(option.template, option.cursorOffset); // Asumir que existen
                            setActiveDropdown(null);
                          }}>
                            {option.label}{option.dependency ? ` (Dep: ${option.dependency})` : ''}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            } else if (btn.isDropdown && btn.dropdownId === 'theme-selector') {
              return null; // Avoid rendering the theme dropdown button from the map if we added the <select> manually
            } else if (btn.isDropdown && btn.dropdownId === 'table-inserter') { // Handle Table Dropdown
              const isOpen = activeDropdown === btn.dropdownId;
              return (
                <div key={btn.title} className="toolbar-dropdown-container" ref={isOpen ? dropdownRef : null}>
                   <button
                    title={btn.title}
                    onClick={() => setActiveDropdown(isOpen ? null : btn.dropdownId)}
                    className={`toolbar-button ${isOpen ? 'active' : ''}`}
                   >
                     {btn.icon}
                   </button>
                  {isOpen && (
                    <ul className="toolbar-dropdown-menu">
                      {btn.options.map((option: any) => ( // Usar any para la opción
                        <li key={option.label} className="toolbar-dropdown-item">
                          <button onClick={() => {
                            insertText(option.template, option.cursorOffset); // Insert the styled table template
                            setActiveDropdown(null);
                          }}>
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
            </div>
              );
            } else {
               // Botón normal
               return (
                <button key={btn.title} title={btn.title} onClick={btn.action} className="toolbar-button">
                  {btn.icon}
                </button>
              );
            }
          })}
          </div>
        <div className="flex flex-1 h-full" style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 40px)' }}> {/* Asumiendo altura toolbar aprox 40px */}
          
          {/* Editor Panel (sin float) */}
          <div className="editor-container" style={{ width: `${leftWidth}%`, height: '100%', overflowY: 'auto' }}>
            <textarea
              ref={textareaRef}
              className="editor"
              value={content}
              onChange={handleEditorChange}
              onKeyDown={handleKeyDown}
              onScroll={handleEditorScroll}
              placeholder="Escribe aquí tu markdown..."
              style={{ height: '100%', width: '100%' }} /* Asegurar que llene el contenedor */
            />
          </div>

          {/* Resizer (Ahora funciona mejor con flex) */}
          <div className="resizer" onMouseDown={startResizing} />

          {/* Preview Panel (sin float) */}
          <div className="preview-panel" style={{ width: `${100 - leftWidth}%`, height: '100%', overflow: 'hidden' }}> {/* Usar 100 - leftWidth, quitar el -1 */}
            <div 
              ref={previewRef} 
              className="preview markdown-body"
              style={{ 
                height: '100%', 
                overflowY: 'auto', 
                scrollPaddingTop: '20px', 
                /* display: 'block' ya no es necesario explícitamente con flex */
              }}
              onScroll={handlePreviewScroll}
            >
              <ReactMarkdown 
                remarkPlugins={[
                  remarkGfm, // Descomentado para probar
                  remarkEnsureDirectiveBrackets, // Descomentado para probar
                  remarkDirective, // Necesario para reconocer :::
                  remarkCustomPanels, // El plugin que queremos probar
                  remarkCornerDirectives, // Descomentado 
                  remarkGithubBetaBlockquoteAdmonitions // Descomentado 
                ]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code(props: any) {
                    const { node, inline, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match?.[1];
                    if (!inline && language) {
                      return (
                        <div className="code-block-wrapper">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={language}
                            PreTag="div"
                            customStyle={{
                              margin: '0',
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      );
                    } else {
                      const finalClassName = inline ? undefined : className;
                      const contentToRender = children !== undefined && children !== null ? children : '';
                      return (
                        <code className={finalClassName} {...rest}>
                          {contentToRender}
                        </code>
                      );
                    }
                  }
                }}
              >
                {content}
              </ReactMarkdown>
          </div>
        </div>

        </div>
      </div>
    </>
  );
};

export default App;