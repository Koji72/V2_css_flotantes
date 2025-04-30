"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSandbox = exports.SecurityValidator = void 0;
class SecurityValidator {
    constructor() {
        this.allowedAPIs = new Set([
            'read:state',
            'write:state',
            'create:node',
            'delete:node',
            'update:node',
            'register:component',
            'register:action'
        ]);
        this.allowedPermissions = new Set([
            'read:state',
            'write:state',
            'create:node',
            'delete:node',
            'update:node',
            'register:component',
            'register:action'
        ]);
    }
    validateManifest(manifest) {
        const errors = [];
        // Validar campos requeridos
        if (!manifest.name)
            errors.push('Name is required');
        if (!manifest.version)
            errors.push('Version is required');
        if (!manifest.author)
            errors.push('Author is required');
        if (!manifest.permissions)
            errors.push('Permissions are required');
        // Validar formato de versión
        if (manifest.version && !this.isValidVersion(manifest.version)) {
            errors.push('Invalid version format');
        }
        // Validar permisos
        if (manifest.permissions) {
            manifest.permissions.forEach(permission => {
                if (!this.allowedPermissions.has(permission)) {
                    errors.push(`Invalid permission: ${permission}`);
                }
            });
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateCode(code) {
        const errors = [];
        // Validar uso de APIs no permitidas
        const disallowedPatterns = [
            /eval\s*\(/,
            /new\s+Function\s*\(/,
            /document\./,
            /window\./,
            /localStorage\./,
            /sessionStorage\./,
            /XMLHttpRequest/,
            /fetch\s*\(/,
            /import\s*\(/,
            /require\s*\(/
        ];
        disallowedPatterns.forEach(pattern => {
            if (pattern.test(code)) {
                errors.push(`Disallowed API usage: ${pattern.toString()}`);
            }
        });
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validatePermissions(permissions) {
        const errors = [];
        permissions.forEach(permission => {
            if (!this.allowedPermissions.has(permission)) {
                errors.push(`Invalid permission: ${permission}`);
            }
        });
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    isValidVersion(version) {
        return /^\d+\.\d+\.\d+$/.test(version);
    }
}
exports.SecurityValidator = SecurityValidator;
class PluginSandbox {
    constructor() {
        this.iframe = document.createElement('iframe');
        this.iframe.sandbox.add('allow-scripts');
        this.messageHandlers = new Map();
        this.setupMessageHandling();
    }
    setupMessageHandling() {
        window.addEventListener('message', (event) => {
            if (event.source !== this.iframe.contentWindow)
                return;
            const { type, payload } = event.data;
            const handler = this.messageHandlers.get(type);
            if (handler) {
                handler(payload);
            }
        });
    }
    createContext() {
        return {
            // APIs permitidas
            readState: (key) => {
                this.iframe.contentWindow?.postMessage({ type: 'readState', payload: { key } }, '*');
            },
            writeState: (key, value) => {
                this.iframe.contentWindow?.postMessage({ type: 'writeState', payload: { key, value } }, '*');
            },
            // ... otras APIs permitidas
        };
    }
    async loadPlugin(code, manifest) {
        // Validar código y manifiesto
        const validator = new SecurityValidator();
        const manifestResult = validator.validateManifest(manifest);
        const codeResult = validator.validateCode(code);
        if (!manifestResult.isValid || !codeResult.isValid) {
            throw new Error([
                ...manifestResult.errors,
                ...codeResult.errors
            ].join('\n'));
        }
        // Crear contexto seguro
        this.context = this.createContext();
        // Cargar código en el sandbox
        const script = `
      (function(context) {
        ${code}
      })(window.parent.context);
    `;
        this.iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            window.parent.context = ${JSON.stringify(this.context)};
          </script>
        </head>
        <body>
          <script>${script}</script>
        </body>
      </html>
    `;
        document.body.appendChild(this.iframe);
    }
    registerMessageHandler(type, handler) {
        this.messageHandlers.set(type, handler);
    }
    unregisterMessageHandler(type) {
        this.messageHandlers.delete(type);
    }
    dispose() {
        this.iframe.remove();
        this.messageHandlers.clear();
    }
}
exports.PluginSandbox = PluginSandbox;
