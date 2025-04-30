"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerButtonHandlers = void 0;
const buttonManager_1 = require("./buttonManager");
const registerButtonHandlers = () => {
    const buttonManager = buttonManager_1.ButtonManager.getInstance();
    // Handler por defecto
    buttonManager.registerHandler('default', (action, event) => {
        const customEvent = new CustomEvent('panel-button-click', {
            detail: { action }
        });
        document.dispatchEvent(customEvent);
    });
    // Handler para logging
    buttonManager.registerHandler('log', (action, event) => {
        console.log(`Button clicked: ${action}`);
    });
    // Handler para navegación
    buttonManager.registerHandler('navigate', (action, event) => {
        window.location.href = action;
    });
    // Handler para mostrar alertas
    buttonManager.registerHandler('alert', (action, event) => {
        alert(action);
    });
    // Handler para toggle de clases
    buttonManager.registerHandler('toggle-class', (action, event) => {
        const [targetId, className] = action.split(':');
        const target = document.getElementById(targetId);
        if (target) {
            target.classList.toggle(className);
        }
    });
};
exports.registerButtonHandlers = registerButtonHandlers;
