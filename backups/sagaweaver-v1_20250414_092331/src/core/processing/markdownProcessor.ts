import { marked } from 'marked';
import { escapeHtmlPreview } from './escapeHelper';

interface ProcessingResult {
  html: string;
  toc?: { id: string; text: string; level: number }[];
  errors?: ProcessingError[];
}

interface ProcessingError {
  message: string;
  phase: 'parse' | 'transform' | 'render';
  details?: any;
}

/**
 * Procesador de Markdown simplificado para SagaWeaver
 * 
 * Esta versión es ULTRA-SIMPLE ya que el previewManager se encarga
 * del pre-procesamiento de los bloques especiales narrativos
 */
export class MarkdownProcessor {
  private static instance: MarkdownProcessor;

  private constructor() {
    // Configuración básica de marked
    marked.setOptions({
      gfm: true,
      breaks: true,
      pedantic: false
    });
  }

  public static getInstance(): MarkdownProcessor {
    if (!MarkdownProcessor.instance) {
      MarkdownProcessor.instance = new MarkdownProcessor();
    }
    return MarkdownProcessor.instance;
  }

  /**
   * Procesa el markdown y devuelve HTML
   * Esta es una versión super simplificada, ya que previewManager
   * maneja los bloques narrativos :::passage, placeholders, etc.
   */
  public async process(markdown: string): Promise<ProcessingResult> {
    console.log(`[MarkdownProcessor] Procesando ${markdown.length} caracteres`);
    
    try {
      // Usar marked directamente
      const html = await marked.parse(markdown, { async: true }) as string;
      
      return {
        html,
        errors: []
      };
    } catch (error: any) {
      console.error('[MarkdownProcessor] Error procesando markdown:', error);
      
      // Devolver HTML de error si falla
      const errorHtml = `
        <div class="markdown-error">
          <h2>Error procesando Markdown</h2>
          <p>${escapeHtmlPreview(error.message || String(error))}</p>
          <pre>${escapeHtmlPreview(markdown.substring(0, 200))}...</pre>
        </div>
      `;
      
      return {
        html: errorHtml,
        errors: [{
          message: error.message || 'Error desconocido procesando markdown',
          phase: 'parse',
          details: error
        }]
      };
    }
  }
} 