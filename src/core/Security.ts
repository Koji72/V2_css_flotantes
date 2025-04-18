import { PluginManifest } from './PluginSystem';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class SecurityValidator {
  private allowedAPIs: Set<string>;
  private allowedPermissions: Set<string>;

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

  validateManifest(manifest: PluginManifest): ValidationResult {
    const errors: string[] = [];

    // Validar campos requeridos
    if (!manifest.name) errors.push('Name is required');
    if (!manifest.version) errors.push('Version is required');
    if (!manifest.author) errors.push('Author is required');
    if (!manifest.permissions) errors.push('Permissions are required');

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

  validateCode(code: string): ValidationResult {
    const errors: string[] = [];

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

  validatePermissions(permissions: string[]): ValidationResult {
    const errors: string[] = [];

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

  private isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
  }
}

export class PluginSandbox {
  private iframe: HTMLIFrameElement;
  private context: any;
  private messageHandlers: Map<string, Function>;

  constructor() {
    this.iframe = document.createElement('iframe');
    this.iframe.sandbox.add('allow-scripts');
    this.messageHandlers = new Map();
    this.setupMessageHandling();
  }

  private setupMessageHandling(): void {
    window.addEventListener('message', (event) => {
      if (event.source !== this.iframe.contentWindow) return;

      const { type, payload } = event.data;
      const handler = this.messageHandlers.get(type);
      if (handler) {
        handler(payload);
      }
    });
  }

  private createContext(): any {
    return {
      // APIs permitidas
      readState: (key: string) => {
        this.iframe.contentWindow?.postMessage({ type: 'readState', payload: { key } }, '*');
      },
      writeState: (key: string, value: any) => {
        this.iframe.contentWindow?.postMessage({ type: 'writeState', payload: { key, value } }, '*');
      },
      // ... otras APIs permitidas
    };
  }

  async loadPlugin(code: string, manifest: PluginManifest): Promise<void> {
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

  registerMessageHandler(type: string, handler: Function): void {
    this.messageHandlers.set(type, handler);
  }

  unregisterMessageHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  dispose(): void {
    this.iframe.remove();
    this.messageHandlers.clear();
  }
} 