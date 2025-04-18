import { processLayoutElements } from '../processLayoutElements';

describe('processLayoutElements', () => {
  it('should process any div with a class correctly', () => {
    const markdown = `
      <div class="custom-panel">
        <div class="panel-header">
          <h3>Test Panel</h3>
        </div>
        <div class="panel-content">
          Test content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('custom-panel');
    expect(result).toContain('Test Panel');
    expect(result).toContain('Test content');
  });

  it('should handle floating panels correctly', () => {
    const markdown = `
      <div class="panel-style--tech-corners" data-layout="float-left">
        <div class="panel-header">
          <h3>Floating Panel</h3>
        </div>
        <div class="panel-content">
          Floating content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-layout="float-left"');
    expect(result).toContain('Floating Panel');
  });

  it('should handle split columns correctly', () => {
    const markdown = `
      <div class="panel-style--tech-corners" data-layout="split-columns">
        <div class="panel-header">
          <h3>Split Columns</h3>
        </div>
        <div class="panel-content">
          <div class="column">
            Left column
          </div>
          <div class="column">
            Right column
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-layout="split-columns"');
    expect(result).toContain('column');
  });

  it('should handle nested panels correctly', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Parent Panel</h3>
        </div>
        <div class="panel-content">
          <div class="panel-style--hologram">
            <div class="panel-header">
              <h3>Nested Panel</h3>
            </div>
            <div class="panel-content">
              Nested content
            </div>
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('panel-style--tech-corners');
    expect(result).toContain('panel-style--hologram');
    expect(result).toContain('Nested Panel');
  });

  it('should handle panels with custom styles', () => {
    const markdown = `
      <div class="panel-style--tech-corners" data-styles="background: #123456; color: white;">
        <div class="panel-header">
          <h3>Styled Panel</h3>
        </div>
        <div class="panel-content">
          Styled content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-styles="background: #123456; color: white;"');
  });

  it('should process multiple attributes correctly', () => {
    const markdown = `
      <div class="panel-style--tech-corners" 
           data-layout="float-left" 
           data-styles="background: #123456; color: white;"
           data-classes="custom-class"
           data-animation="glow">
        <div class="panel-header">
          <h3>Multi-Attribute Panel</h3>
        </div>
        <div class="panel-content">
          Test content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-layout="float-left"');
    expect(result).toContain('data-styles="background: #123456; color: white;"');
    expect(result).toContain('data-classes="custom-class"');
    expect(result).toContain('data-animation="glow"');
  });

  it('should handle missing attributes gracefully', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Simple Panel</h3>
        </div>
        <div class="panel-content">
          Test content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).not.toContain('data-layout');
    expect(result).not.toContain('data-styles');
    expect(result).not.toContain('data-classes');
    expect(result).not.toContain('data-animation');
  });

  it('should preserve existing classes', () => {
    const markdown = `
      <div class="panel-style--tech-corners custom-class another-class">
        <div class="panel-header">
          <h3>Class Test Panel</h3>
        </div>
        <div class="panel-content">
          Test content
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('panel-style--tech-corners');
    expect(result).toContain('custom-class');
    expect(result).toContain('another-class');
  });

  it('should handle nested panels with different layouts', () => {
    const markdown = `
      <div class="panel-style--tech-corners" data-layout="float-left">
        <div class="panel-header">
          <h3>Parent Panel</h3>
        </div>
        <div class="panel-content">
          <div class="panel-style--hologram" data-layout="float-right">
            <div class="panel-header">
              <h3>Nested Panel</h3>
            </div>
            <div class="panel-content">
              Nested content
            </div>
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-layout="float-left"');
    expect(result).toContain('data-layout="float-right"');
    expect(result).toContain('panel-style--tech-corners');
    expect(result).toContain('panel-style--hologram');
  });

  it('should handle deeply nested panels', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Level 1</h3>
        </div>
        <div class="panel-content">
          <div class="panel-style--hologram">
            <div class="panel-header">
              <h3>Level 2</h3>
            </div>
            <div class="panel-content">
              <div class="panel-style--neo-frame">
                <div class="panel-header">
                  <h3>Level 3</h3>
                </div>
                <div class="panel-content">
                  Deep content
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('panel-style--tech-corners');
    expect(result).toContain('panel-style--hologram');
    expect(result).toContain('panel-style--neo-frame');
    expect(result).toContain('Level 1');
    expect(result).toContain('Level 2');
    expect(result).toContain('Level 3');
  });

  it('should handle nested panels with different styles', () => {
    const markdown = `
      <div class="panel-style--tech-corners" data-styles="background: #123456;">
        <div class="panel-header">
          <h3>Parent Panel</h3>
        </div>
        <div class="panel-content">
          <div class="panel-style--hologram" data-styles="background: #654321;">
            <div class="panel-header">
              <h3>Nested Panel</h3>
            </div>
            <div class="panel-content">
              Nested content
            </div>
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('data-styles="background: #123456;"');
    expect(result).toContain('data-styles="background: #654321;"');
  });

  it('should handle panels with missing header', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-content">
          Content without header
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('Content without header');
    expect(result).not.toContain('panel-header');
  });

  it('should handle panels with missing content', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Header without content</h3>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('Header without content');
    expect(result).not.toContain('panel-content');
  });

  it('should handle panels with malformed structure', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Malformed Panel</h3>
        </div>
        <div class="wrong-class">
          Wrong content class
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('Malformed Panel');
    expect(result).toContain('wrong-class');
  });

  it('should handle nested panels with invalid structure', () => {
    const markdown = `
      <div class="panel-style--tech-corners">
        <div class="panel-header">
          <h3>Parent Panel</h3>
        </div>
        <div class="panel-content">
          <div class="panel-style--hologram">
            <div class="panel-header">
              <h3>Invalid Nested Panel</h3>
            </div>
            <div class="wrong-class">
              Invalid content
            </div>
          </div>
        </div>
      </div>
    `;

    const result = processLayoutElements(markdown);
    expect(result).toContain('Parent Panel');
    expect(result).toContain('panel-content');
    expect(result).toContain('Invalid Nested Panel');
    expect(result).toContain('wrong-class');
  });

  describe('Performance and Caching', () => {
    it('should cache and reuse processed panels', () => {
      const panel = `
        <div class="panel-style--tech-corners">
          <div class="panel-header">
            <h3>Test Panel</h3>
          </div>
          <div class="panel-content">
            Test content
          </div>
        </div>
      `;

      // Primera ejecución - debe procesar el panel
      const firstResult = processLayoutElements(panel);
      
      // Segunda ejecución - debe usar la caché
      const startTime = performance.now();
      const secondResult = processLayoutElements(panel);
      const endTime = performance.now();
      
      expect(secondResult).toBe(firstResult);
      expect(endTime - startTime).toBeLessThan(5); // La caché debe ser muy rápida
    });

    it('should cache complete markdown documents', () => {
      const document = `
        # Título
        <div class="panel-1">Panel 1</div>
        Texto intermedio
        <div class="panel-2">Panel 2</div>
      `;

      // Primera ejecución - debe procesar todo
      const firstResult = processLayoutElements(document);
      
      // Segunda ejecución - debe usar la caché del documento completo
      const startTime = performance.now();
      const secondResult = processLayoutElements(document);
      const endTime = performance.now();
      
      expect(secondResult).toBe(firstResult);
      expect(endTime - startTime).toBeLessThan(5);
    });

    it('should validate panel structure before processing', () => {
      const invalidPanel = `
        <div class="panel-style--tech-corners">
          <div class="invalid-header">
            <h3>Invalid Panel</h3>
          </div>
          <span class="panel-content">
            Invalid content structure
          </span>
        </div>
      `;

      const result = processLayoutElements(invalidPanel);
      expect(result).toContain('invalid-header'); // Debe preservar la estructura original
      expect(result).not.toContain('data-processed="true"'); // No debe marcar como procesado
    });
  });

  describe('Enhanced Animations and Responsiveness', () => {
    it('should handle multiple animations', () => {
      const markdown = `
        <div class="panel-style--tech-corners" data-animation="glow,shake">
          <div class="panel-header">
            <h3>Multi-Animation Panel</h3>
          </div>
          <div class="panel-content">
            Content with multiple animations
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('data-animation="glow,shake"');
      expect(result).toContain('glow-animation');
      expect(result).toContain('shake-animation');
    });

    it('should handle responsive layouts', () => {
      const markdown = `
        <div class="panel-style--tech-corners" data-responsive="stack-mobile">
          <div class="panel-header">
            <h3>Responsive Panel</h3>
          </div>
          <div class="panel-content">
            Content that stacks on mobile
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('data-responsive="stack-mobile"');
      expect(result).toContain('stack-mobile-layout');
    });
  });

  describe('Content Interaction', () => {
    it('should handle markdown content within panels', () => {
      const markdown = `
        <div class="panel-style--tech-corners">
          <div class="panel-header">
            <h3>Markdown Panel</h3>
          </div>
          <div class="panel-content">
            **Bold text** and *italic text*
            - List item 1
            - List item 2
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('**Bold text**');
      expect(result).toContain('*italic text*');
      expect(result).toContain('- List item 1');
    });

    it('should handle code blocks within panels', () => {
      const markdown = `
        <div class="panel-style--tech-corners">
          <div class="panel-header">
            <h3>Code Panel</h3>
          </div>
          <div class="panel-content">
            \`\`\`javascript
            const test = "Hello World";
            console.log(test);
            \`\`\`
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('```javascript');
      expect(result).toContain('const test = "Hello World"');
    });
  });

  describe('Style Validation', () => {
    it('should validate and sanitize CSS styles', () => {
      const markdown = `
        <div class="panel-style--tech-corners" data-styles="background: #123456; color: white; invalid: property;">
          <div class="panel-header">
            <h3>Style Panel</h3>
          </div>
          <div class="panel-content">
            Styled content
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('background: #123456');
      expect(result).toContain('color: white');
      expect(result).not.toContain('invalid: property');
    });

    it('should handle CSS variables', () => {
      const markdown = `
        <div class="panel-style--tech-corners" data-styles="--custom-color: #123456; color: var(--custom-color);">
          <div class="panel-header">
            <h3>CSS Variables Panel</h3>
          </div>
          <div class="panel-content">
            Variable content
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('--custom-color: #123456');
      expect(result).toContain('color: var(--custom-color)');
    });
  });

  describe('Dynamic Content', () => {
    it('should handle dynamic class names', () => {
      const markdown = `
        <div class="panel-style--tech-corners dynamic-class-${Date.now()}">
          <div class="panel-header">
            <h3>Dynamic Panel</h3>
          </div>
          <div class="panel-content">
            Dynamic content
          </div>
        </div>
      `;

      const result = processLayoutElements(markdown);
      expect(result).toContain('dynamic-class-');
      expect(result).toContain('Dynamic Panel');
    });

    it('should handle dynamic content updates', () => {
      const initialContent = `
        <div class="panel-style--tech-corners">
          <div class="panel-header">
            <h3>Initial Panel</h3>
          </div>
          <div class="panel-content">
            Initial content
          </div>
        </div>
      `;

      const updatedContent = `
        <div class="panel-style--tech-corners">
          <div class="panel-header">
            <h3>Updated Panel</h3>
          </div>
          <div class="panel-content">
            Updated content
          </div>
        </div>
      `;

      const initialResult = processLayoutElements(initialContent);
      const updatedResult = processLayoutElements(updatedContent);

      expect(initialResult).toContain('Initial Panel');
      expect(updatedResult).toContain('Updated Panel');
      expect(initialResult).not.toBe(updatedResult);
    });
  });
}); 