"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processContent = processContent;
// src/core/processing/pipeline.ts
// Orquestador del pipeline de procesamiento Aethelred V4.0 
const _01_normalizer_1 = require("./01_normalizer");
const _02_parser_1 = require("./02_parser");
const _03_transformer_1 = require("./03_transformer");
const _04_renderer_1 = require("./04_renderer");
/**
 * Procesa el markdown crudo a través del pipeline Aethelred V4.0.
 * @param rawMarkdown El string de markdown original.
 * @returns Una promesa que resuelve a un objeto ProcessingResult.
 */
async function processContent(rawMarkdown) {
    console.log('\n[Pipeline] 🔍 DEBUG INPUT:', {
        content: rawMarkdown,
        type: typeof rawMarkdown,
        length: rawMarkdown?.length || 0,
        isValid: Boolean(rawMarkdown && typeof rawMarkdown === 'string')
    });
    // Validación más estricta de la entrada
    if (!rawMarkdown) {
        console.warn('[Pipeline] ❌ Empty input received');
        return {
            html: '<div class="error">No content provided</div>',
            errors: [{
                    stage: 'unknown',
                    message: 'Empty input received'
                }]
        };
    }
    if (typeof rawMarkdown !== 'string') {
        console.warn('[Pipeline] ❌ Invalid input type:', typeof rawMarkdown);
        return {
            html: '<div class="error">Invalid content type</div>',
            errors: [{
                    stage: 'unknown',
                    message: `Invalid input type: ${typeof rawMarkdown}`
                }]
        };
    }
    const errors = [];
    let currentStage = 'normalize';
    let data = rawMarkdown;
    let finalAst = null;
    try {
        // Etapa 1: Normalizar
        console.log('\n[Pipeline] 🔄 Stage 1: NORMALIZE');
        currentStage = 'normalize';
        data = (0, _01_normalizer_1.normalize)(data);
        if (!data) {
            throw new Error('Normalization returned null or undefined');
        }
        console.log('[Pipeline] ✅ Normalize output:', {
            length: data.length,
            preview: data.substring(0, 100)
        });
        // Etapa 2: Parsear a AST
        console.log('\n[Pipeline] 🔍 Stage 2: PARSE');
        currentStage = 'parse';
        const parseResult = await (0, _02_parser_1.parseToAst)(data);
        if (parseResult.errors.length > 0) {
            console.warn('[Pipeline] ⚠️ Parse warnings:', parseResult.errors);
            errors.push(...parseResult.errors);
        }
        if (!parseResult.ast)
            throw new Error("AST Parsing failed critically. No AST generated.");
        data = parseResult.ast;
        console.log('[Pipeline] ✅ Parse complete. AST node count:', JSON.stringify(data)?.length);
        console.log('[Pipeline] AST preview:', JSON.stringify(data).substring(0, 200));
        // Etapa 3: Transformar/Enriquecer AST
        console.log('\n[Pipeline] 🔧 Stage 3: TRANSFORM');
        currentStage = 'transform';
        const transformResult = (0, _03_transformer_1.transformAst)(data);
        if (transformResult.errors.length > 0) {
            console.warn('[Pipeline] ⚠️ Transform warnings:', transformResult.errors);
            errors.push(...transformResult.errors);
        }
        data = transformResult.ast;
        finalAst = data;
        console.log('[Pipeline] ✅ Transform complete. AST node count:', JSON.stringify(data)?.length);
        console.log('[Pipeline] Transformed AST preview:', JSON.stringify(data).substring(0, 200));
        // Etapa 4: Renderizar AST a HTML
        console.log('\n[Pipeline] 🎨 Stage 4: RENDER');
        currentStage = 'render';
        const renderResult = (0, _04_renderer_1.renderAstToHtml)(data);
        if (renderResult.errors.length > 0) {
            console.warn('[Pipeline] ⚠️ Render warnings:', renderResult.errors);
            errors.push(...renderResult.errors);
        }
        data = renderResult.html;
        console.log('[Pipeline] ✅ Render complete. HTML length:', data?.length);
        console.log('[Pipeline] HTML preview:', data?.substring(0, 200));
        console.log('\n[Pipeline] ✨ Pipeline completed successfully');
        console.log('[Pipeline] Total errors/warnings:', errors.length);
        return { html: data, ast: finalAst, errors };
    }
    catch (error) {
        console.error(`[Pipeline] CRITICAL PIPELINE ERROR during stage: ${currentStage}`, error);
        // Añadir el error crítico al array de errores
        errors.push({ stage: currentStage, message: error.message || 'Unknown critical error', details: error });
        // Decidir qué HTML devolver en caso de fallo crítico
        const errorHtml = `<div class="error pipeline-error">
            <h2>Processing Pipeline Failed</h2>
            <p>Stage: <strong>${currentStage}</strong></p>
            <p>Error: ${escapeHtmlLocal(error.message || 'Unknown critical error')}</p>
            <p>Check the browser console for more details.</p>
        </div>`;
        // Intentar devolver el HTML generado hasta el momento si es posible y es string, sino el errorHtml
        const lastValidHtml = typeof data === 'string' ? data : errorHtml;
        return { html: errorHtml, errors }; // Devolver error claro
    }
}
// Helper de escape (puede moverse a utils)
const escapeHtmlLocal = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
