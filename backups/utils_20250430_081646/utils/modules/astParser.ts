/**
 * ASTParser - Parser de Markdown basado en AST
 * 
 * Proporciona un procesador de markdown avanzado basado en AST (Árbol de Sintaxis Abstracta),
 * reemplazando el enfoque basado en expresiones regulares por una solución más robusta.
 * 
 * @author SW-Architect
 * @version 1.0.0
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkDirective from 'remark-directive';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { cacheManager } from './cacheManager';
import { featureFlags } from './featureFlags';
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

// Interfaces para los resultados del procesamiento
export interface ProcessResult {
  html: string;
  metadata: Record<string, any>;
  warnings: string[];
}

export interface PanelData {
  type: string;
  title?: string;
  style?: string;
  layout?: string;
  width?: string;
  classes?: string[];
  id?: string;
  animation?: string;
}

// Configuración para sanitización
const sanitizeConfig = {
  // Permitir atributos data-* y clases personalizadas
  attributes: {
    '*': ['className', 'style', /^data-.*$/],
    'div': ['id', 'class'],
    'section': ['id', 'class', 'aria-label'],
    'button': ['id', 'class', 'data-action', 'disabled', 'data-button-style']
  },
  // Permitir todos los elementos por defecto
  tagNames: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'blockquote',
    'pre', 'code', 'em', 'strong', 'del', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'a', 'img', 'br', 'hr', 'div', 'span', 'section', 'button', 'details', 'summary'
  ]
};

/**
 * Plugin para remark que procesa las directivas personalizadas de panel
 */
function remarkPanelPlugin() {
  return (tree: any, file: any) => {
    visit(tree, (node) => {
      // Procesar directivas de tipo contenedor
      if (node.type === 'containerDirective') {
        processPanelDirective(node, file);
      }
      // Procesar directivas de tipo texto (botones)
      else if (node.type === 'textDirective' && node.name === 'button') {
        processButtonDirective(node, file);
      }
    });
  };
}

/**
 * Procesa una directiva de panel
 */
function processPanelDirective(node: any, file: any) {
  // Verificar si es un panel u otro tipo de directiva
  if (['panel', 'info', 'warning', 'success', 'error', 'note'].includes(node.name)) {
    const data: PanelData = {
      type: node.name,
      classes: []
    };

    // Extraer atributos
    if (node.attributes) {
      data.title = node.attributes.title;
      data.style = node.attributes.style;
      data.layout = node.attributes.layout;
      data.width = node.attributes.width;
      data.id = node.attributes.id;
      data.animation = node.attributes.animation;
      
      // Procesar clases especificadas
      if (node.attributes.class) {
        data.classes = node.attributes.class.split(/\s+/).filter(Boolean);
      }
    }

    // Crear clases CSS basadas en atributos
    const cssClasses = ['mixed-panel'];
    
    // Añadir clase de tipo si no es un panel genérico
    if (data.type !== 'panel') {
      cssClasses.push(`panel-${data.type}`);
    }
    
    // Añadir clase de estilo si está especificada
    if (data.style) {
      // Normalizar estilo
      if (!data.style.startsWith('panel-style--') && 
          !['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(data.style)) {
        cssClasses.push(`panel-style--${data.style}`);
      } else {
        cssClasses.push(data.style);
      }
    }
    
    // Añadir clase de layout si está especificada
    if (data.layout) {
      cssClasses.push(`panel-layout--${data.layout}`);
    }
    
    // Añadir clases personalizadas
    if (data.classes && data.classes.length > 0) {
      cssClasses.push(...data.classes);
    }

    // Crear atributos para el elemento HTML
    const hProperties: Record<string, any> = {
      className: cssClasses.join(' '),
      'data-panel-type': data.type,
      'data-interactive-container': 'true'
    };
    
    // Añadir atributos adicionales si están presentes
    if (data.id) hProperties.id = data.id;
    if (data.title) hProperties['aria-label'] = data.title;
    if (data.width) hProperties.style = `width: ${data.width.match(/^\d+$/) ? `${data.width}%` : data.width};`;

    // Crear estructura para el encabezado del panel si hay título
    let headerNode;
    if (data.title) {
      headerNode = h('div.panel-header-container', [
        h('h3.panel-header', { title: data.title }, data.title),
        h('div.panel-header-decoration')
      ]);
    }

    // Crear estructura para el contenido
    const contentWrapperNode = h('div.panel-content-wrapper', [
      h('div.panel-content', node.children)
    ]);

    // Decoración de esquinas
    const cornerNodes = [
      h('div.corner-decoration.top-left'),
      h('div.corner-decoration.top-right'),
      h('div.corner-decoration.bottom-left'),
      h('div.corner-decoration.bottom-right')
    ];

    // Animación si está presente
    let animationNode;
    if (data.animation) {
      animationNode = h(`div.animation-overlay.${data.animation}-effect`);
    }

    // Reemplazar el nodo original por nuestra estructura
    node.data = { 
      hName: 'section',
      hProperties
    };

    // Construir contenido del nodo
    node.children = [
      ...cornerNodes,
      ...(headerNode ? [headerNode] : []),
      contentWrapperNode,
      ...(animationNode ? [animationNode] : [])
    ];
  }
}

/**
 * Procesa una directiva de botón
 */
function processButtonDirective(node: any, file: any) {
  // Solo procesar directivas de botón
  if (node.name !== 'button') return;

  // Extraer atributos del botón
  const attrs = node.attributes || {};
  const action = attrs.action || '';
  const style = attrs.style || 'primary';
  const disabled = attrs.disabled === 'true';
  const loading = attrs.loading === 'true';
  
  // ID único para el botón
  const buttonId = `btn-${Math.random().toString(36).substring(2, 9)}`;

  // Crear clases CSS
  const classes = [`panel-button`, `panel-button-${style}`];
  
  // Crear atributos para el elemento HTML
  const hProperties: Record<string, any> = {
    id: buttonId,
    className: classes.join(' '),
    'data-action': action,
    'data-button-style': style
  };
  
  // Añadir atributos condicionales
  if (disabled) hProperties.disabled = true;
  if (loading) hProperties['data-loading'] = 'true';

  // Copiar otros atributos data-*
  Object.keys(attrs).forEach(key => {
    if (key.startsWith('data-') && key !== 'data-loading') {
      hProperties[key] = attrs[key];
    }
  });

  // Reemplazar el nodo original por un elemento button
  node.data = {
    hName: 'button',
    hProperties
  };
}

/**
 * Clase ASTParser - Implementación del parser basado en AST
 */
export class ASTParser {
  private static instance: ASTParser;
  private processor: any;
  private debugMode: boolean = false;

  /**
   * Constructor privado (singleton)
   */
  private constructor() {
    // Crear procesador unificado con plugins
    this.processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkPanelPlugin)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSanitize, sanitizeConfig)
      .use(rehypeStringify, { allowDangerousHtml: true });

    console.log('[ASTParser] Inicializado con procesador unificado');
  }

  /**
   * Obtener la instancia única (patrón Singleton)
   */
  public static getInstance(): ASTParser {
    if (!ASTParser.instance) {
      ASTParser.instance = new ASTParser();
    }
    return ASTParser.instance;
  }

  /**
   * Establece el modo de depuración
   */
  public setDebugMode(debug: boolean): void {
    this.debugMode = debug;
    console.log(`[ASTParser] Modo debug ${debug ? 'habilitado' : 'deshabilitado'}`);
  }

  /**
   * Logs para depuración
   */
  private log(...args: any[]): void {
    if (this.debugMode) {
      console.log('[ASTParser Debug]', ...args);
    }
  }

  /**
   * Procesa contenido markdown y devuelve HTML
   */
  public async process(markdown: string): Promise<ProcessResult> {
    this.log(`Procesando markdown (longitud: ${markdown.length})`);

    // Verificar si el AST Parser está habilitado
    if (!featureFlags.isEnabled('astParser')) {
      // Fallback al procesador tradicional
      console.log('[ASTParser] AST Parser deshabilitado, no se utilizará');
      throw new Error('AST Parser deshabilitado');
    }

    // Verificar si el resultado está en caché
    if (featureFlags.isEnabled('cacheMarkdown')) {
      const cacheResult = await cacheManager.executeWithCache<Record<string, any>>(
        markdown,
        async () => {
          const { result, warnings } = await this.processWithoutCache(markdown);
          return { 
            html: result, 
            data: { warnings }
          };
        }
      );

      const metadata = cacheResult.data || {};
      const warnings = metadata.warnings || [];

      this.log(`Procesamiento finalizado (desde caché: ${cacheResult.fromCache})`);
      return {
        html: cacheResult.html,
        metadata,
        warnings
      };
    } else {
      const { result, warnings } = await this.processWithoutCache(markdown);
      
      this.log('Procesamiento finalizado (sin caché)');
      return {
        html: result,
        metadata: {},
        warnings
      };
    }
  }

  /**
   * Procesa markdown sin utilizar caché
   */
  private async processWithoutCache(markdown: string): Promise<{ result: string, warnings: string[] }> {
    const warnings: string[] = [];
    this.log('Iniciando procesamiento con AST parser...');

    try {
      // Pre-procesamiento para compatibilidad con sintaxis existente
      let processedMarkdown = this.preprocessMarkdown(markdown);
      
      // Proceso principal con unified
      const result = await this.processor.process(processedMarkdown);
      
      this.log('Procesamiento AST completado con éxito');
      return { result: String(result), warnings };
    } catch (error) {
      console.error('[ASTParser] Error durante el procesamiento:', error);
      warnings.push(`Error en procesamiento: ${error instanceof Error ? error.message : 'Desconocido'}`);
      return { 
        result: `<div class="error markdown-error">Error en procesamiento AST: ${error instanceof Error ? error.message : 'Desconocido'}</div>`,
        warnings
      };
    }
  }

  /**
   * Pre-procesa el markdown para adaptarlo a las expectativas del parser
   */
  private preprocessMarkdown(markdown: string): string {
    this.log('Pre-procesando markdown para compatibilidad');
    
    // Adaptar sintaxis de panel antigua a formato de directiva
    let result = markdown.replace(
      /^:::(panel|info|warning|success|error|note)(\s*{([^}]*)}|)([^:]*)^:::/gm,
      (match, type, attrsFull, attrs, content) => {
        // Crear formato de directiva adecuado
        return `:::${type}${attrs ? `{${attrs}}` : ''}\n${content.trim()}\n:::`;
      }
    );

    // Adaptar sintaxis de botón antigua a formato de directiva
    result = result.replace(
      /::button{([^}]*)}([^:]*)::/g,
      (match, attrs, text) => `:button{${attrs}}${text.trim()}:`
    );

    // Adaptar sintaxis alternativa de botón
    result = result.replace(
      /\[([^\]]+)\](\{\.panel-button[^}]*\})/g,
      (match, text, classes) => {
        // Extraer clases y convertirlas a estilos
        let style = 'secondary'; // Por defecto
        if (classes.includes('primary')) style = 'primary';
        else if (classes.includes('success')) style = 'success';
        else if (classes.includes('warning')) style = 'warning';
        else if (classes.includes('danger')) style = 'danger';
        
        return `:button{style="${style}"}${text.trim()}:`;
      }
    );

    return result;
  }
}

// Exportar instancia única
export const astParser = ASTParser.getInstance();
export default astParser; 