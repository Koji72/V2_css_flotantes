import React from 'react';

interface ToolbarProps {
  onFormat: (format: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFormat }) => {
  const buttons = [
    { icon: 'B', format: '**', title: 'Negrita (Ctrl+B)', type: 'wrap' },
    { icon: 'I', format: '*', title: 'Cursiva (Ctrl+I)', type: 'wrap' },
    { icon: 'H1', format: '# ', title: 'Título 1 (Ctrl+1)', type: 'line' },
    { icon: 'H2', format: '## ', title: 'Título 2 (Ctrl+2)', type: 'line' },
    { icon: '•', format: '- ', title: 'Lista (Ctrl+L)', type: 'line' },
    { icon: '❝', format: '> ', title: 'Cita (Ctrl+Q)', type: 'line' },
    { icon: '`', format: '`', title: 'Código (Ctrl+`)', type: 'wrap' },
    { icon: '🔗', format: '[](url)', title: 'Enlace (Ctrl+K)', type: 'insert' }
  ];

  const handleClick = (format: string, type: string) => {
    console.log('Button clicked:', { format, type }); // Debug log
    const formatInfo = `${format}|${type}`;
    console.log('Sending format info:', formatInfo); // Debug log
    onFormat(formatInfo);
  };

  return (
    <div className="flex gap-2">
      {buttons.map((button) => (
        <button
          key={button.format}
          onClick={() => handleClick(button.format, button.type)}
          className="toolbar-button"
          title={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default Toolbar; 