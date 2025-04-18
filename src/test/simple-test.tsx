import React, { useState } from 'react';
import '../styles/test.css';

interface TestProps {
  title?: string;
  description?: string;
  codeExample?: string;
}

export const SimpleTest: React.FC<TestProps> = ({
  title = 'Componente de Prueba',
  description = 'Este es un componente simple para demostrar estilos y funcionalidad básica.',
  codeExample = `const example = {
  name: 'Test Component',
  styles: ['CSS Modules', 'Variables'],
  features: ['Responsive', 'Theme Support']
};`
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="simple-test-container">
      <div className="test-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '0.5rem 1rem',
            marginTop: '1rem',
            background: 'var(--accent-color, #0066cc)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? 'Ocultar código' : 'Mostrar código'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="raw-content">
          <h3>Ejemplo de Código</h3>
          <pre>{codeExample}</pre>
        </div>
      )}
    </div>
  );
}; 