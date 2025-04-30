import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown, { Options as ReactMarkdownOptions, Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkGithubBetaBlockquoteAdmonitions from 'remark-github-beta-blockquote-admonitions';
import remarkCustomPanels from './utils/remarkCustomPanels';
import remarkEnsureDirectiveBrackets from './utils/remarkEnsureDirectiveBrackets';
import remarkCornerDirectives from './utils/remarkCornerDirectives';
import { remarkDirectiveButton } from './utils/markdownDirectives';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TemplateManager } from './utils/templateManager';
import {
  Bold, Italic, List, Quote, Code, Link2, Image,
  Table, Strikethrough, ListTodo, Superscript, Subscript, Highlighter, ChevronsUpDown,
  Moon, Sun,
  PanelTopOpen,
  Minus,
  ListOrdered,
  Palette,
  FileText,
  Gem,
  Skull,
  Tag,
  Heading1,
  Heading2,
  Loader
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import './styles/index.css';
import './styles/layout/floating-layout.css';

const AUTOSAVE_KEY = 'markdown-editor-content';
const THEME_ID_KEY = 'markdown-editor-theme-id';
const DEFAULT_THEME_ID = 'lv426-distress-signal';
const AUTOSAVE_DELAY = 300000;

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
  { label: "Básico", dependency: 5, template: '\n:::panel{title="Título"}\nContenido...\n:::\n', cursorOffset: 16 },
  { label: "Nota", dependency: 4, template: '\n:::panel{style=note title="Nota"}\nContenido...\n:::\n', cursorOffset: 26 },
  { label: "Advertencia", dependency: 4, template: '\n:::panel{style=warning title="Advertencia"}\nContenido...\n:::\n', cursorOffset: 29 },
  { label: "Éxito", dependency: 4, template: '\n:::panel{style=success title="Éxito"}\nContenido...\n:::\n', cursorOffset: 27 },
  { label: "Peligro", dependency: 4, template: '\n:::panel{style=danger title="Peligro"}\nContenido...\n:::\n', cursorOffset: 27 },
  { label: "HUD Frame", dependency: 2, template: '\n:::panel{style=hud-frame title="HUD"}\nContenido...\n:::\n', cursorOffset: 31 },
  { label: "Glass", dependency: 3, template: '\n:::panel{style=glass title="Glass"}\nContenido...\n:::\n', cursorOffset: 27 },
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
  { label: "Reality Glitch (Cosmic)", dependency: 1, template: '\n:::panel{style=reality-glitch title="Reality Glitch"}\nContenido...\n:::\n', cursorOffset: 39 },
  { label: "Nanite Construct (Cosmic)", dependency: 1, template: '\n:::panel{style=nanite-construct title="Nanite Construct"}\nContenido...\n:::\n', cursorOffset: 41 },
  { label: "Crystal Matrix (Cosmic)", dependency: 1, template: '\n:::panel{style=crystal-matrix title="Crystal Matrix"}\nContenido...\n:::\n', cursorOffset: 39 },
  { label: "Void Touched (Cosmic)", dependency: 2, template: '\n:::panel{style=void-touched title="Void Touched"}\nContenido...\n:::\n', cursorOffset: 37 },
  { label: "Scanline Terminal (Cosmic)", dependency: 1, template: '\n:::panel{style=scanline-terminal title="Scanline Terminal"}\nContenido...\n:::\n', cursorOffset: 42 },
  { label: "Etiqueta de Prueba (Arkham)", icon: <Tag size={16} />, dependency: 4, template: '\n:::evidence-tag{title="Prueba #17" case="Caso Dunwich"}\nItem: Fragmento de Tela Manchada\nFecha: 1928-05-15\n:::\n', cursorOffset: 21 },
  { label: "Statblock", icon: <Skull size={16} />, dependency: 4, template: '\n:::statblock{title="Nombre Monstruo" style="monster-manual-dark"}\n**AC:** 10 | **HP:** 10/10 | **Speed:** 30 ft.\n**STR:** 10 (+0) **DEX:** 10 (+0) **CON:** 10 (+0) **INT:** 10 (+0) **WIS:** 10 (+0) **CHA:** 10 (+0)\n---\n#### Acciones\nAcción 1: Descripción.\n---\n#### Rasgos\nRasgo 1: Descripción.\n:::\n', cursorOffset: 32 },
  { label: "Hoja de Personaje", icon: <FileText size={16} />, dependency: 4, template: '\n:::character-sheet{title="Nombre Personaje" style="data-stream"}\n#### Atributos\n<div class="stat-item"><span class="stat-key">Fuerza:</span> <span class="stat-value">10 (+0)</span></div>\n<div class="stat-item"><span class="stat-key">Destreza:</span> <span class="stat-value">10 (+0)</span></div>\n{/* ... más atributos ... */}\n\n#### Habilidades\n<ul class="skills-list">\n    <li>Habilidad +0</li>\n</ul>\n\n#### Inventario\n<div class="inventory-grid">\n    <div class="item-slot">Objeto 1</div>\n    <div class="item-slot"></div>{/* Slot vacío */}\n</div>\n\n#### Notas\nNotas del personaje...\n:::\n', cursorOffset: 37 },
  { label: "Objeto Mágico", icon: <Gem size={16} />, dependency: 3, template: '\n:::magic-item{title="Nombre Objeto" style="arcane-relic"}\n<div class="item-description">\nDescripción del objeto...\n</div>\n<div class="item-rarity item-rarity--common">Común</div>\n:::\n', cursorOffset: 32 },
];

// --- Definición de Plantillas de Tabla Estilizada ---
const tableStyleTemplates = [
  { label: "Básica", template: '\n| Cabecera 1 | Cabecera 2 |\n| :--------- | :--------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n\n', cursorOffset: 14 },
  { label: "Cyber Matrix", template: '\n:::table{.table-style--cyber-matrix}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n', cursorOffset: 35 },
  { label: "Arcane Runes", template: '\n:::table{.table-style--arcane-runes}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n', cursorOffset: 35 },
  { label: "Holo Projection", template: '\n:::table{.table-style--holo-projection}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n', cursorOffset: 38 },
  { label: "Scrap Datasheet", template: '\n:::table{.table-style--scrap-datasheet}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n', cursorOffset: 40 },
  { label: "Liquid Metal", template: '\n:::table{.table-style--liquid-metal}\n| Cabecera 1 | Cabecera 2 |\n| ---------- | ---------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n:::\n\n', cursorOffset: 35 }
];

// --- Helper Functions for Panel Attribute Manipulation ---
const parsePanelAttributes = (attrString: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  attrString = attrString.trim();
  if (!attrString) return attributes;
  if (attrString.startsWith('{') && attrString.endsWith('}')) {
    attrString = attrString.slice(1, -1);
  }
  const regex = /(\w+)\s*=\s*"([^"]*)"|(\w+)\s*=\s*([^\s]+)/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    if (match[1] && match[2]) attributes[match[1]] = match[2];
    else if (match[3] && match[4]) attributes[match[3]] = match[4];
  }
  return attributes;
};

const serializePanelAttributes = (attributes: Record<string, string>): string => {
  if (Object.keys(attributes).length === 0) return '';
  return '{' + Object.entries(attributes)
    .map(([key, value]) => {
      if (value.includes(' ') || value.includes('=') || value.includes('"')) return `${key}="${value}"`;
      return `${key}=${value}`;
    })
    .join(' ') + '}';
};

const updatePanelStyleClass = (currentClasses: string | undefined, newStyleId: string): string => {
  const baseClasses = (currentClasses || '')
    .split(' ')
    .filter(cls => cls && !cls.startsWith('panel-style--'));
  if (newStyleId) baseClasses.push(`panel-style--${newStyleId}`);
  return baseClasses.filter(Boolean).join(' ');
};

const App: React.FC = () => {
  const templateManager = TemplateManager.getInstance();

  const [content, setContent] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>(templateManager.getCurrentTemplateId());
  const [selectedVisualStyle, setSelectedVisualStyle] = useState<string>('');
  const [availableVisualStyles, setAvailableVisualStyles] = useState<{ id: string; name: string }[]>([]);
  const [loadingTheme, setLoadingTheme] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const handleImageButtonClickRef = useRef<() => void>(() => {});
  const insertTableTemplateRef = useRef<() => void>(() => {});
  const applyFormatRef = useRef<typeof applyFormat>(() => {});

  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollingPanel = useRef<'editor' | 'preview' | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load initial content and theme
  useEffect(() => {
    console.log('[Initial Load] useEffect triggered.');
    if (!hasLoadedRef.current) {
      const savedContent = localStorage.getItem(AUTOSAVE_KEY);
      const initialContent = savedContent !== null ? savedContent : DEFAULT_MARKDOWN_CONTENT;
      console.log(`[Initial Load] Initial content source: ${savedContent !== null ? 'localStorage' : 'default'}`);
      setContent(initialContent);
      console.log('[Initial Load] setContent called.');

      const savedThemeId = localStorage.getItem(THEME_ID_KEY) || templateManager.getCurrentTemplateId();
      setSelectedTheme(savedThemeId);
      if (templateManager.getCurrentTemplateId() !== savedThemeId) {
         templateManager.setCurrentTemplateId(savedThemeId);
      }
      console.log(`[Initial Load] Loaded theme ID: ${savedThemeId}`);

      setAvailableVisualStyles([{ id: '', name: 'Estilo Visual (Panel)' }, ...templateManager.getVisualStylesForTemplate(savedThemeId)]);
      setSelectedVisualStyle('');

      hasLoadedRef.current = true;
      console.log('[Initial Load] hasLoadedRef set to true.');
    }
  }, [templateManager]);

  // Toggle dark/light theme on main document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Autosave content
  useEffect(() => {
    if (!hasLoadedRef.current) {
        console.log('[Autosave] Skipping initial autosave check.');
        return;
    }
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(() => {
      console.log('[Autosave] Saving content to localStorage...');
      localStorage.setItem(AUTOSAVE_KEY, content);
      toast.success('Contenido auto-guardado!');
    }, AUTOSAVE_DELAY);
    return () => { if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current); };
  }, [content]);

  // Load and apply theme CSS to the main document's head
  useEffect(() => {
    const loadAndApplyTheme = async () => {
      if (selectedTheme) {
        console.log(`[App Effect] Theme changed to: ${selectedTheme}. Attempting to load and apply.`);
        setLoadingTheme(true);
        const loadingToastId = toast.loading(`Cargando tema: ${templateManager.getTemplateNameById(selectedTheme)}...`);

        // Eliminar el style tag anterior si existe
        const oldStyleElement = document.getElementById('template-styles');
        if (oldStyleElement) {
          oldStyleElement.remove();
        }
        const oldVisibilityFix = document.getElementById('text-visibility-fix');
        if (oldVisibilityFix) {
           oldVisibilityFix.remove();
        }

        try {
          console.log(`[Theme Load] Intentando cargar CSS para el tema ID: ${selectedTheme}`);

          const cssContent = await templateManager.fetchTemplateContent(selectedTheme);

          console.log(`[Theme Load] Contenido CSS cargado (primeros 200 chars):\n${cssContent.substring(0, 200)}`);

          // Crear y añadir el nuevo style tag
          const styleElement = document.createElement('style');
          styleElement.id = 'template-styles';
          styleElement.textContent = cssContent;
          document.head.appendChild(styleElement);

          // Crear y añadir el fix de visibilidad
          const visibilityFixStyle = document.createElement('style');
          visibilityFixStyle.id = 'text-visibility-fix';
          visibilityFixStyle.textContent = `
/* Simplified Visibility Fix */
.panel * { position: relative !important; z-index: 1 !important; }
.panel::before, .panel::after { z-index: 0 !important; pointer-events: none !important; }
/* Add specific problematic panels if necessary */
/* .panel-style--reality-glitch *, .panel-style--void-touched * { z-index: 2 !important; } */
          `;
          document.head.appendChild(visibilityFixStyle);

          toast.success(`Tema '${templateManager.getTemplateNameById(selectedTheme)}' aplicado.`, { id: loadingToastId });
          setAvailableVisualStyles([{ id: '', name: 'Estilo Visual (Panel)' }, ...templateManager.getVisualStylesForTemplate(selectedTheme)]);
          setSelectedVisualStyle('');
        } catch (error) {
          console.error("Error cargando o aplicando el tema:", error);
          toast.error(`Error al cargar el tema '${templateManager.getTemplateNameById(selectedTheme)}'.`, { id: loadingToastId });
        } finally {
          setLoadingTheme(false);
        }
      }
    };
    loadAndApplyTheme();
  }, [selectedTheme, templateManager]);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  }, [isResizing, setLeftWidth]);

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
      setContent(textBeforeLine + textToInsert);
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
  applyFormatRef.current = applyFormat;

  handleImageButtonClickRef.current = () => {
    fileInputRef.current?.click();
  };

  insertTableTemplateRef.current = () => {
    const tableTemplate =`\n| Cabecera 1 | Cabecera 2 |\n| :--------- | :--------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n\n`;
    insertText(tableTemplate, tableTemplate.length);
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const MAX_SIZE_MB = 1;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Imagen demasiado grande (> ${MAX_SIZE_MB} MB)`);
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentApplyFormat = applyFormatRef.current;
    const currentHandleImageButtonClick = handleImageButtonClickRef.current;
    const currentInsertTableTemplate = insertTableTemplateRef.current;
    if (e.ctrlKey || e.metaKey) {
      let handled = true;
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'c': currentApplyFormat('- [ ] ', 'line'); break;
          case 'p': currentApplyFormat('<sup>', 'wrap'); break;
          case 'b': currentApplyFormat('<sub>', 'wrap'); break;
          case 'h': currentApplyFormat('<mark>', 'wrap'); break;
          case 'd': insertText('\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n'); handled = true; break;
          default: handled = false;
        }
      } else {
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
      if (handled) e.preventDefault();
    }
  }, [insertText]);

  // Scroll Sync between editor and preview div
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (!textareaRef.current || !previewRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    animationFrameRef.current = requestAnimationFrame(() => {
      if (scrollingPanel.current === source) {
        const editorScrollHeight = editor.scrollHeight;
        const editorClientHeight = editor.clientHeight;
        const previewScrollHeight = preview.scrollHeight;
        const previewClientHeight = preview.clientHeight;

        if (source === 'editor' && editorScrollHeight > editorClientHeight) {
          const scrollRatio = editor.scrollTop / (editorScrollHeight - editorClientHeight);
          if (previewScrollHeight > previewClientHeight) {
            preview.scrollTop = scrollRatio * (previewScrollHeight - previewClientHeight);
          }
        } else if (source === 'preview' && previewScrollHeight > previewClientHeight) {
          const scrollRatio = preview.scrollTop / (previewScrollHeight - previewClientHeight);
          if (editorScrollHeight > editorClientHeight) {
            editor.scrollTop = scrollRatio * (editorScrollHeight - editorClientHeight);
          }
        }
      }
    });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => { scrollingPanel.current = null; }, 150);
  }, []);

  const handleEditorScroll = useCallback(() => {
    if (!scrollingPanel.current) scrollingPanel.current = 'editor';
    syncScroll('editor');
  }, [syncScroll]);

  const handlePreviewScroll = useCallback(() => {
    if (!scrollingPanel.current) scrollingPanel.current = 'preview';
    syncScroll('preview');
  }, [syncScroll]);

  const insertBlock = useCallback((textToInsert: string) => {
    insertText(textToInsert);
  }, [insertText]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  // --- Toolbar Buttons Definition (Restored) ---
  const buttons: any[] = [
    { title: "Negrita (Ctrl+B)", icon: <Bold size={18} />, action: () => applyFormatRef.current('**', 'wrap') },
    { title: "Cursiva (Ctrl+I)", icon: <Italic size={18} />, action: () => applyFormatRef.current('*', 'wrap') },
    { title: "Tachado (Ctrl+S)", icon: <Strikethrough size={18} />, action: () => applyFormatRef.current('~~', 'wrap') },
    { title: "Resaltado (Ctrl+Shift+H)", icon: <Highlighter size={18} />, action: () => applyFormatRef.current('<mark>', 'wrap') },
    { title: "Superíndice (Ctrl+Shift+P)", icon: <Superscript size={18} />, action: () => applyFormatRef.current('<sup>', 'wrap') },
    { title: "Subíndice (Ctrl+Shift+B)", icon: <Subscript size={18} />, action: () => applyFormatRef.current('<sub>', 'wrap') },
    { isSeparator: true },
    { title: "Encabezado 1 (Ctrl+1)", icon: <Heading1 size={18} />, action: () => insertBlock('# ') },
    { title: "Encabezado 2 (Ctrl+2)", icon: <Heading2 size={18} />, action: () => insertBlock('## ') },
    { isSeparator: true },
    { title: "Lista Desordenada (Ctrl+L)", icon: <List size={18} />, action: () => insertBlock('- ') },
    { title: "Lista Ordenada", icon: <ListOrdered size={18} />, action: () => insertBlock('1. ') },
    { title: "Lista de Tareas (Ctrl+Shift+C)", icon: <ListTodo size={18} />, action: () => insertBlock('- [ ] ') },
    { isSeparator: true },
    { title: "Cita (Ctrl+Q)", icon: <Quote size={18} />, action: () => insertBlock('> ') },
    { title: "Código (Ctrl+`)", icon: <Code size={18} />, action: () => applyFormatRef.current('`', 'wrap') },
    { title: "Bloque Colapsable (Ctrl+Shift+D)", icon: <ChevronsUpDown size={18} />, action: () => insertText('\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n') },
    { isSeparator: true },
    { title: "Enlace (Ctrl+K)", icon: <Link2 size={18} />, action: () => applyFormatRef.current('[](url)', 'insert') },
    { title: "Imagen (Ctrl+G)", icon: <Image size={18} />, action: () => handleImageButtonClickRef.current() },
    {
      title: "Insertar Tabla",
      icon: <Table size={18} />,
      isDropdown: true,
      dropdownId: 'table-inserter',
      options: tableStyleTemplates
    },
    { title: "Línea Horizontal", icon: <Minus size={18} />, action: () => insertText('\n\n---\n\n') },
    { isSeparator: true },
    { title: "Cambiar Tema Claro/Oscuro", icon: isDarkMode ? <Sun size={18} /> : <Moon size={18} />, action: toggleTheme },
  ];

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newThemeId = event.target.value;
    templateManager.setCurrentTemplateId(newThemeId);
    setSelectedTheme(newThemeId);
    localStorage.setItem(THEME_ID_KEY, newThemeId);
  };

  const handleVisualStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyleId = event.target.value;
    setSelectedVisualStyle(newStyleId);
    const textarea = textareaRef.current;
    if (!textarea) return;
    const cursorPosition = textarea.selectionStart;
    const currentContent = content;
    let panelStartIndex = -1;
    let searchIndex = cursorPosition;
    let safetyCounter = 0;
    const maxSearchDepth = 500;
    while (searchIndex >= 0 && safetyCounter < maxSearchDepth) {
        const lineStart = currentContent.lastIndexOf('\n', searchIndex - 1) + 1;
        const lineEnd = currentContent.indexOf('\n', lineStart);
        const currentLine = currentContent.substring(lineStart, lineEnd !== -1 ? lineEnd : currentContent.length);
        if (currentLine.trim().startsWith(':::panel{')) {
            if (cursorPosition >= lineStart) {
                 panelStartIndex = lineStart;
                 break;
            }
        }
        if (lineStart === 0) break;
        searchIndex = lineStart - 1;
        safetyCounter++;
    }
    if (panelStartIndex === -1) {
        toast.error("Coloca el cursor dentro o justo después de un bloque :::panel{...} para aplicar el estilo.");
        return;
    }
    const definitionLineEnd = currentContent.indexOf('\n', panelStartIndex);
    const originalDefinitionLine = currentContent.substring(
        panelStartIndex,
        definitionLineEnd !== -1 ? definitionLineEnd : currentContent.length
    );
    const closingBraceIndex = originalDefinitionLine.indexOf('}');
    if (closingBraceIndex === -1) {
        toast.error("Error: El formato del panel :::panel{...} es incorrecto.");
        return;
    }
    const attributesString = originalDefinitionLine.substring(':::panel{'.length, closingBraceIndex);
    const attributes = parsePanelAttributes(attributesString);
    const currentClass = attributes['class'];
    const newClassValue = updatePanelStyleClass(currentClass, newStyleId);
    if (newClassValue) attributes['class'] = newClassValue;
    else delete attributes['class'];
    const newAttributesString = serializePanelAttributes(attributes);
    const newDefinitionLine = `:::panel{${newAttributesString}}`;
    const newContent = currentContent.substring(0, panelStartIndex) +
                       newDefinitionLine +
                       currentContent.substring(panelStartIndex + originalDefinitionLine.length);
    setContent(newContent);
    toast.success(`Estilo '${templateManager.getVisualStyleDetail(newStyleId)?.name || 'Ninguno'}' aplicado.`);
    setTimeout(() => {
        if (textareaRef.current) {
            const newCursorPosition = panelStartIndex + newDefinitionLine.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }, 0);
  };

  // Adjusted CodeBlock component
  const CodeBlock: Components['code'] = ({ node, className, children, ...props }) => {
    // Check for language class to determine if it's a block
    const match = /language-(\w+)/.exec(className || '');
    const isBlock = !!match;
    const nodeProps = (node?.properties as React.HTMLAttributes<HTMLElement>) || {};

    // If it's a block with a language, use SyntaxHighlighter
    if (isBlock && match) {
      return (
        <SyntaxHighlighter
          // @ts-ignore - Style prop type mismatch
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
          {...nodeProps}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    } 
    // Otherwise, render as a standard <code> element (handles inline and blocks without language)
    else {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  const markdownOptions: ReactMarkdownOptions = {
    remarkPlugins: [
      remarkGfm,
      remarkDirective,
      remarkEnsureDirectiveBrackets,
      remarkCustomPanels,
      remarkCornerDirectives,
      remarkDirectiveButton,
      remarkGithubBetaBlockquoteAdmonitions,
    ],
    rehypePlugins: [rehypeRaw],
    components: {
      code: CodeBlock,
    },
  };

  return (
    <>
      <div className="app">
        <Toaster position="bottom-right" toastOptions={{ style: { background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#333' }, success: { duration: 3000 } }} />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        <div className="toolbar">
          <select id="theme-selector" value={selectedTheme} onChange={handleThemeChange} className="dropdown" disabled={loadingTheme}>
              {templateManager.getAvailableTemplates().map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {loadingTheme && theme.id === selectedTheme ? 'Cargando...' : theme.name}
                </option>
              ))}
          </select>
          <select id="visual-style-selector" value={selectedVisualStyle} onChange={handleVisualStyleChange} className="dropdown" disabled={availableVisualStyles.length <= 1}>
            {availableVisualStyles.map((style) => (<option key={style.id || 'none'} value={style.id}>{style.name}</option>))}
          </select>
          {buttons.map((btn, index) => {
            if (btn.isSeparator) {
              return <div key={`sep-${index}`} className="toolbar-separator"></div>;
            } else if (btn.isDropdown) {
              const isOpen = activeDropdown === btn.dropdownId;
              return (
                <div key={btn.title} className="toolbar-dropdown-container" ref={isOpen ? dropdownRef : null}>
                  <button title={btn.title} onClick={() => setActiveDropdown(isOpen ? null : btn.dropdownId)} className={`toolbar-button ${isOpen ? 'active' : ''}`}>
                    {btn.icon}
                  </button>
                  {isOpen && (
                    <ul className="toolbar-dropdown-menu">
                      {btn.options.map((option: any) => (
                        <li key={option.label} className="toolbar-dropdown-item">
                          <button onClick={() => {
                              if (option.template) {
                                insertText(option.template, option.cursorOffset);
                              }
                              setActiveDropdown(null);
                           }}>
                            {option.icon}{option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            } else {
              return (<button key={btn.title} title={btn.title} onClick={btn.action} className="toolbar-button">{btn.icon}</button>);
            }
          })}
          {loadingTheme && <Loader className="animate-spin toolbar-button" size={18} />}
        </div>
        <div className="main-panel">
          <div ref={editorContainerRef} className="editor-panel" style={{ width: `${leftWidth}%`, height: '100%', overflowY: 'auto' }}>
            <textarea
              ref={textareaRef}
              className="editor"
              value={content}
              onChange={handleEditorChange}
              onKeyDown={handleKeyDown}
              onScroll={handleEditorScroll}
              placeholder="Escribe aquí tu markdown..."
              style={{ height: '100%', width: '100%', resize: 'none', border: 'none', outline: 'none', padding: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div className="resizer" onMouseDown={startResizing} />
          <div className="preview-panel" style={{ width: `${100 - leftWidth}%`, height: '100%', overflowY: 'auto' }} onScroll={handlePreviewScroll}>
            <div ref={previewRef} className="preview-html" style={{ padding: '1rem' }}>
              <ReactMarkdown
                {...markdownOptions}
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