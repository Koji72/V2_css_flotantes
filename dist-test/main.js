"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.css");
require("./styles/index.css");
require("./styles/floating-blocks.css");
require("./styles/button-styles.css");
const previewManager_1 = __importDefault(require("./utils/previewManager"));
const cssLoader_1 = require("./utils/cssLoader");
// Initialize DOM elements
const markdownEditor = document.getElementById('markdown-editor');
const previewFrame = document.getElementById('preview-frame');
const loadCSSButton = document.getElementById('load-css');
const cssFileInput = document.getElementById('css-file');
// Initialize preview manager
previewManager_1.default.initialize(previewFrame);
// Set up event listeners
markdownEditor.addEventListener('input', () => {
    previewManager_1.default.updateContent(markdownEditor.value);
});
loadCSSButton.addEventListener('click', () => {
    cssFileInput.click();
});
cssFileInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const cssContent = await (0, cssLoader_1.readCSSFile)(file);
            previewManager_1.default.applyCustomCSS(cssContent);
        }
        catch (error) {
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
