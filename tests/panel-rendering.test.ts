import { PreviewManager } from '../src/utils/previewManager';
import { marked } from 'marked';

describe('Panel Rendering Tests', () => {
    let previewManager: PreviewManager;

    beforeEach(() => {
        previewManager = PreviewManager.getInstance();
    });

    // Test basic panel rendering
    test('should render basic glass panel', async () => {
        const markdown = '::panel{style="glass"}\n# Test Panel\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass"', '# Test Panel\nContent');
        expect(result).toContain('class="panel glass"');
        expect(result).toContain('Test Panel');
    });

    // Test panel with buttons
    test('should render panel with buttons', async () => {
        const markdown = '::panel{style="glass"}\n::button{action="test" style="primary"}Test Button::\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass"', '::button{action="test" style="primary"}Test Button::');
        expect(result).toContain('class="panel-button primary"');
        expect(result).toContain('data-action="test"');
    });

    // Test panel with cut corners
    test('should render panel with cut corners', async () => {
        const markdown = '::panel{style="glass" class="cut-corner cut-corner-md"}\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass" class="cut-corner cut-corner-md"', 'Content');
        expect(result).toContain('class="panel glass cut-corner cut-corner-md"');
    });

    // Test panel with custom border
    test('should render panel with custom border', async () => {
        const markdown = '::panel{style="glass" class="border-primary"}\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass" class="border-primary"', 'Content');
        expect(result).toContain('class="panel glass border-primary"');
    });

    // Test panel with shadow
    test('should render panel with shadow', async () => {
        const markdown = '::panel{style="glass" class="shadow-lg"}\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass" class="shadow-lg"', 'Content');
        expect(result).toContain('class="panel glass shadow-lg"');
    });

    // Test panel with pattern
    test('should render panel with pattern', async () => {
        const markdown = '::panel{style="glass" class="pattern-grid"}\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass" class="pattern-grid"', 'Content');
        expect(result).toContain('class="panel glass pattern-grid"');
    });

    // Test button states
    test('should render button with different states', async () => {
        const markdown = '::panel{style="glass"}\n::button{action="test" style="primary" disabled="true"}Disabled::\n::button{action="test" style="primary" loading="true"}Loading::\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass"', '::button{action="test" style="primary" disabled="true"}Disabled::\n::button{action="test" style="primary" loading="true"}Loading::');
        expect(result).toContain('disabled');
        expect(result).toContain('loading');
    });

    // Test button sizes
    test('should render buttons with different sizes', async () => {
        const markdown = '::panel{style="glass"}\n::button{action="test" style="primary" class="small"}Small::\n::button{action="test" style="primary" class="large"}Large::\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass"', '::button{action="test" style="primary" class="small"}Small::\n::button{action="test" style="primary" class="large"}Large::');
        expect(result).toContain('class="panel-button primary small"');
        expect(result).toContain('class="panel-button primary large"');
    });

    // Test accessibility
    test('should render accessible buttons', async () => {
        const markdown = '::panel{style="glass"}\n::button{action="test" style="primary" aria-label="Test Button" role="button"}Accessible::\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass"', '::button{action="test" style="primary" aria-label="Test Button" role="button"}Accessible::');
        expect(result).toContain('aria-label="Test Button"');
        expect(result).toContain('role="button"');
    });

    // Test panel with multiple classes
    test('should render panel with multiple classes', async () => {
        const markdown = '::panel{style="glass" class="floating hoverable shadow-lg"}\nContent\n::';
        const result = await previewManager.renderSinglePanelHtml('panel', 'style="glass" class="floating hoverable shadow-lg"', 'Content');
        expect(result).toContain('class="panel glass floating hoverable shadow-lg"');
    });
}); 