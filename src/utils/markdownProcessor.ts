import { marked, Token, TokenizerAndRendererExtension } from "marked";

// --- Status Definitions ---
const statusKeywords: { [key: string]: string } = {
    "high": "status-error", "comms lost": "status-error", "hostile action": "status-error",
    "critical": "status-error", "error": "status-error", "medium": "status-warn",
    "low ammunition": "status-warn", "resupply requested": "status-warn",
    "potential counter": "status-warn", "interference": "status-warn", "warning": "status-warn",
    "jamming": "status-warn", "low": "status-ok", "actively engaged": "status-ok",
    "standby": "status-ok", "ready": "status-ok", "nominal": "status-ok",
    "secure uplink": "status-ok", "active cyberwarfare": "status-ok",
    "air superiority patrol": "status-ok", "engaged": "status-ok",
    "fully operational": "status-ok", "ok": "status-ok", "none": "status-neutral",
    "unknown": "status-neutral", "info": "status-neutral", "redacted": "status-neutral",
    "medical triage": "status-neutral", "secure zone": "status-ok",
};

function findStatusClass(text: string): string | null {
    const lowerText = text?.toLowerCase().trim() || '';
    if (!lowerText) return null;
    for (const keyword in statusKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerText)) return statusKeywords[keyword];
    }
    const statusClasses = Object.values(statusKeywords);
    if (statusClasses.includes(lowerText)) return lowerText;
    return null;
}

// --- Custom Block Extension ---
const customBlockExtension: TokenizerAndRendererExtension = {
    name: 'customBlock',
    level: 'block',
    start(src: string) { 
        const cap = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)/.exec(src); 
        return cap ? cap.index : undefined; 
    },
    tokenizer(src: string): Token | undefined {
        const rule = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
        const match = rule.exec(src);
        if (match) {
            const type = match[1].trim().toLowerCase();
            let title = match[2] ? match[2].trim() : '';
            let content = match[3] ? match[3].trim() : '';
            
            if (!title && content) {
                const lines = content.split('\n');
                const potentialTitle = lines[0].trim();
                if (lines.length > 1 && 
                    !potentialTitle.match(/^#{1,6}\s|^[\*\->+\|]\s|^\s*$/) && 
                    /^[a-zA-Z0-9\s,:;\.\(\)\[\]\{\}\-_\/\\#@!¡¿?'"]+$/.test(potentialTitle) && 
                    potentialTitle.length < 100) {
                    title = potentialTitle;
                    content = lines.slice(1).join('\n').trim();
                } else {
                    title = type.charAt(0).toUpperCase() + type.slice(1);
                }
            } else if (!title) {
                title = type.charAt(0).toUpperCase() + type.slice(1);
            }
            
            const tokens: Token[] = [];
            this.lexer.blockTokens(content, tokens);
            
            return { 
                type: 'customBlock', 
                raw: match[0], 
                blockType: type, 
                title: title, 
                tokens: tokens 
            };
        }
        return undefined;
    },
    renderer(token: Token & { blockType: string; title: string; tokens: marked.Token[] }): string {
        const { blockType, title, tokens } = token;
        let processedContent = '';
        
        try {
            // @ts-ignore
            processedContent = this.parser.parse(tokens);
        } catch(e) {
            console.warn("Renderer fallback: parsing raw content for block", blockType);
            const contentRule = /^(?: {0,3}|\t):::\w+\s*.*?\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
            const contentMatch = contentRule.exec(token.raw);
            processedContent = marked.parse(contentMatch?.[1]?.trim() ?? '');
        }

        if (blockType === 'note') {
            const titleHTML = title && title.toLowerCase() !== 'note' ? `<strong>${title}:</strong> ` : '';
            return `<blockquote class="note-block">${titleHTML}${processedContent}</blockquote>`;
        }
        
        if (blockType === 'datamatrix') {
            return `<div class="datamatrix-raw-output" data-title="${title}">${processedContent}</div>`;
        }

        const panelClassMap: { [key: string]: { panel: string, icon: string, content?: string } } = {
            'statblock': { panel: 'panel-unit-status', icon: 'icon-status' },
            'readaloud': { panel: 'panel-event-log', icon: 'icon-log', content: 'log-list'},
            'objectives': { panel: 'panel-objectives', icon: 'icon-objective', content: 'objective-list'},
            'encounter': { panel: 'panel-mission-intel', icon: 'icon-objective'},
        };

        const { panel: panelClassSpecific, icon: iconClass, content: contentClass = '' } = 
            panelClassMap[blockType] || { panel: `custom-${blockType}`, icon: '', content: '' };
        
        const panelClasses = ['mixed-panel', panelClassSpecific, blockType];
        const headerIcon = iconClass ? `<span class="header-icon ${iconClass}"></span>` : '';
        const headerHTML = `<div class="panel-header">${headerIcon}<h2>${title}</h2></div>`;

        return `<section class="${panelClasses.join(' ')}">${headerHTML}<div class="panel-content ${contentClass}">${processedContent}</div></section>`;
    }
};

marked.use({ extensions: [customBlockExtension] });
marked.setOptions({ gfm: true, breaks: true, headerIds: false, mangle: false });

class MarkdownProcessor {
    process(markdown: string): string {
        try {
            markdown = markdown.replace(
                /(?<!\`\`\`[^\`]*|\`[^\`]*|<code>.*|<pre>.*)(?:\[\[(.+?)\]\])/g, 
                (match, content) => `<span class="dice-roll">${content.trim()}</span>`
            );
            let html = marked.parse(markdown);
            html = this.postProcessHTML(html);
            return html;
        } catch (error: unknown) {
            console.error('[MarkdownProcessor] Error:', error);
            return `<div class="error-message">Error processing markdown: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
    }

    postProcessHTML(html: string): string {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
            const body = doc.body;

            // Process DataMatrix tables
            body.querySelectorAll('div.datamatrix-raw-output').forEach(wrapper => {
                const table = wrapper.querySelector('table');
                if (table) {
                    table.classList.add('data-matrix');
                    table.querySelectorAll('tbody td').forEach(cell => {
                        if (!cell.querySelector('span[class^="status-"]')) {
                            const statusClass = findStatusClass(cell.textContent || '');
                            if (statusClass) {
                                const span = doc.createElement('span');
                                span.className = statusClass;
                                while (cell.firstChild) {
                                    span.appendChild(cell.firstChild);
                                }
                                cell.appendChild(span);
                            }
                        }
                        if (cell.textContent?.trim().startsWith('[REDACTED')) {
                            cell.classList.add('redacted');
                        }
                    });
                    
                    const container = doc.createElement('div');
                    container.className = 'table-container datamatrix-container';
                    const panelContent = wrapper.closest('.panel-content');
                    const parent = panelContent || wrapper.parentNode;
                    
                    if (parent) {
                        parent.insertBefore(container, wrapper);
                        container.appendChild(table);
                        
                        const title = wrapper.dataset.title;
                        if (title) {
                            const titleEl = doc.createElement('h3');
                            titleEl.className = 'data-matrix-title';
                            titleEl.textContent = title;
                            container.parentNode?.insertBefore(titleEl, container);
                        }
                    }
                    
                    wrapper.remove();
                } else {
                    wrapper.innerHTML = '<div class="error-message">Error: No table found in datamatrix block.</div>';
                }
            });

            // Process standard tables
            body.querySelectorAll('table:not(.data-matrix)').forEach(table => {
                if (!table.closest('.table-container')) {
                    const container = doc.createElement('div');
                    container.className = 'table-container standard-markdown-table';
                    const panelContent = table.closest('.panel-content');
                    const parent = panelContent || table.parentNode;
                    
                    if (parent) {
                        parent.insertBefore(container, table);
                        container.appendChild(table);
                        
                        table.querySelectorAll('tbody td').forEach(cell => {
                            if (!cell.querySelector('span[class^="status-"]')) {
                                const statusClass = findStatusClass(cell.textContent || '');
                                if (statusClass) {
                                    const span = doc.createElement('span');
                                    span.className = statusClass;
                                    while (cell.firstChild) {
                                        span.appendChild(cell.firstChild);
                                    }
                                    cell.appendChild(span);
                                }
                            }
                            if (cell.textContent?.trim().startsWith('[REDACTED')) {
                                cell.classList.add('redacted');
                            }
                        });
                    }
                }
            });

            body.querySelectorAll('p:empty').forEach(p => p.remove());
            return body.innerHTML;
        } catch (e) {
            console.error("Error post-processing HTML:", e);
            return html;
        }
    }
}

const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor; 