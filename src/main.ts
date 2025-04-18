import './index.css';
import './styles/index.css';
import './styles/floating-blocks.css';
import './styles/button-styles.css';
import previewManager from './utils/previewManager';
import { readCSSFile } from './utils/cssLoader';

// Initialize DOM elements
const markdownEditor = document.getElementById('markdown-editor') as HTMLTextAreaElement;
const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
const loadCSSButton = document.getElementById('load-css') as HTMLButtonElement;
const cssFileInput = document.getElementById('css-file') as HTMLInputElement;

// Initialize preview manager
previewManager.initialize(previewFrame);

// Set up event listeners
markdownEditor.addEventListener('input', () => {
    previewManager.updateContent(markdownEditor.value);
});

loadCSSButton.addEventListener('click', () => {
    cssFileInput.click();
});

cssFileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        try {
            const cssContent = await readCSSFile(file);
            previewManager.applyCustomCSS(cssContent);
        } catch (error) {
            console.error('Error loading CSS:', error);
            alert('Error al cargar el archivo CSS. Por favor, asegúrate de que es un archivo CSS válido.');
        }
    }
});

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
        box-sizing: border-box;
    }

    .editor-container, .preview-container {
        flex: 1;
        margin-bottom: 20px;
    }

    #markdown-editor {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        font-family: monospace;
        resize: none;
    }

    #preview-frame {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }

    .controls {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style); 