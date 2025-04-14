import React from 'react';
import { validatePanel } from '../utils/panelValidator';

interface ValidationWarningsProps {
  html: string;
}

export const PanelValidationWarnings: React.FC<ValidationWarningsProps> = ({ html }) => {
  // Omitir validación si es un elemento flotante generado por el nuevo procesador
  if (html.includes('floating-element')) {
    return null; // No mostrar errores para elementos flotantes nuevos
  }

  const validationResult = validatePanel(html);

  if (validationResult.isValid && validationResult.warnings.length === 0) {
    return null;
  }

  return (
    <div className="panel-validation-warnings">
      {validationResult.errors.length > 0 && (
        <div className="validation-errors">
          <h4>Errors</h4>
          <ul>
            {validationResult.errors.map((error, index) => (
              <li key={index} className="error-item">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {validationResult.warnings.length > 0 && (
        <div className="validation-warnings">
          <h4>Warnings</h4>
          <ul>
            {validationResult.warnings.map((warning, index) => (
              <li key={index} className="warning-item">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 