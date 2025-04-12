import { marked } from 'marked';

// Definición de tipos para hacer TypeScript feliz
interface CustomBlockToken {
    type: string;
    raw: string;
    blockType: string;
    title: string;
    content: string;
    floatClass: string;
    customClasses: string;
    tokens: any[];
}

// Define the custom block extension with appropriate typing
export const customBlockExtension = {
  name: 'customBlock',
  level: 'block',
  tokenizer(src: string) {
    const match = /^:::\s*(\w+)(?:\s+(.+))?\n([\s\S]*?)\n:::/gm.exec(src);
    if (match) {
      return {
        type: 'customBlock',
        raw: match[0],
        blockType: match[1],
        title: match[2]?.trim() || '',
        content: match[3].trim(),
        tokens: []
      };
    }
    return undefined;
  },
  renderer(token: unknown) {
    const customToken = token as CustomBlockToken;
    const { blockType, title, content } = customToken;
    
    switch (blockType) {
      case 'datamatrix':
        return `
          <div class="datamatrix-container" data-theme-component="datamatrix">
            <div class="datamatrix-header">
              <h3>${title || 'Data Matrix'}</h3>
            </div>
            <div class="datamatrix-content">
              ${marked(content)}
            </div>
          </div>
        `;
        
      case 'panel':
        return `
          <div class="custom-panel" data-theme-component="panel">
            <div class="panel-header">
              <h3>${title || 'Panel'}</h3>
            </div>
            <div class="panel-content">
              ${marked(content)}
            </div>
          </div>
        `;
        
      default:
        return `
          <div class="custom-block" data-theme-component="${blockType}">
            <div class="block-header">
              <h3>${title || blockType}</h3>
            </div>
            <div class="block-content">
              ${marked(content)}
            </div>
          </div>
        `;
    }
  }
}; 