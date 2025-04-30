"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelDebugger = void 0;
const previewManager_1 = require("../previewManager");
class PanelDebugger {
    constructor() {
        this.previewManager = previewManager_1.PreviewManager.getInstance();
    }
    static getInstance() {
        if (!PanelDebugger.instance) {
            PanelDebugger.instance = new PanelDebugger();
        }
        return PanelDebugger.instance;
    }
    async debugPanelRendering(markdown) {
        console.group('Panel Debugging');
        try {
            // Debug basic panel
            console.log('Debugging basic panel...');
            const basicPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '# Test Panel\nContent');
            console.log('Basic panel HTML:', basicPanel);
            // Debug panel with buttons
            console.log('Debugging panel with buttons...');
            const buttonPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '::button{action="test" style="primary"}Test Button::');
            console.log('Button panel HTML:', buttonPanel);
            // Debug panel with cut corners
            console.log('Debugging panel with cut corners...');
            const cornerPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="cut-corner cut-corner-md"', 'Content');
            console.log('Corner panel HTML:', cornerPanel);
            // Debug panel with custom border
            console.log('Debugging panel with custom border...');
            const borderPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="border-primary"', 'Content');
            console.log('Border panel HTML:', borderPanel);
            // Debug panel with shadow
            console.log('Debugging panel with shadow...');
            const shadowPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="shadow-lg"', 'Content');
            console.log('Shadow panel HTML:', shadowPanel);
            // Debug panel with pattern
            console.log('Debugging panel with pattern...');
            const patternPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="pattern-grid"', 'Content');
            console.log('Pattern panel HTML:', patternPanel);
            // Debug button states
            console.log('Debugging button states...');
            const statePanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '::button{action="test" style="primary" disabled="true"}Disabled::\n::button{action="test" style="primary" loading="true"}Loading::');
            console.log('State panel HTML:', statePanel);
            // Debug button sizes
            console.log('Debugging button sizes...');
            const sizePanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '::button{action="test" style="primary" class="small"}Small::\n::button{action="test" style="primary" class="large"}Large::');
            console.log('Size panel HTML:', sizePanel);
            // Debug accessibility
            console.log('Debugging accessibility...');
            const accessiblePanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '::button{action="test" style="primary" aria-label="Test Button" role="button"}Accessible::');
            console.log('Accessible panel HTML:', accessiblePanel);
            // Debug multiple classes
            console.log('Debugging multiple classes...');
            const multiClassPanel = await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="floating hoverable shadow-lg"', 'Content');
            console.log('Multi-class panel HTML:', multiClassPanel);
        }
        catch (error) {
            console.error('Error during panel debugging:', error);
        }
        console.groupEnd();
    }
    async checkMemoryUsage() {
        console.group('Memory Usage Check');
        // Check for potential memory leaks
        const initialMemory = performance.memory?.usedJSHeapSize || 0;
        // Create multiple panels to test memory usage
        for (let i = 0; i < 100; i++) {
            await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', `Test Panel ${i}`);
        }
        const finalMemory = performance.memory?.usedJSHeapSize || 0;
        const memoryDiff = finalMemory - initialMemory;
        console.log('Initial memory:', initialMemory);
        console.log('Final memory:', finalMemory);
        console.log('Memory difference:', memoryDiff);
        if (memoryDiff > 1000000) { // 1MB threshold
            console.warn('Potential memory leak detected!');
        }
        console.groupEnd();
    }
    async checkPerformance() {
        console.group('Performance Check');
        // Measure rendering time for different panel types
        const startTime = performance.now();
        // Test basic panel
        await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass"', '# Test Panel\nContent');
        const basicTime = performance.now() - startTime;
        // Test complex panel
        const complexStart = performance.now();
        await this.previewManager['renderSinglePanelHtml']('panel', 'style="glass" class="floating hoverable shadow-lg"', '::button{action="test" style="primary" class="large"}Test Button::');
        const complexTime = performance.now() - complexStart;
        console.log('Basic panel render time:', basicTime, 'ms');
        console.log('Complex panel render time:', complexTime, 'ms');
        if (basicTime > 50 || complexTime > 100) {
            console.warn('Performance issues detected!');
        }
        console.groupEnd();
    }
}
exports.PanelDebugger = PanelDebugger;
PanelDebugger.instance = null;
