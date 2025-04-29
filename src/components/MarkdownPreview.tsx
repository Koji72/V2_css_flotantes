'use client';

import React from 'react';
// Comentado temporalmente para arreglar el build
/*
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { SyntaxHighlighter } from 'react-syntax-highlighter'; // Comentado temporalmente
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Comentado temporalmente
*/

const MarkdownPreview: React.FC = () => {
  return (
    <div className="markdown-preview p-4 overflow-auto h-full border border-dashed border-red-500">
      <p className="text-red-500">[Previsualización temporalmente deshabilitada para corregir errores de build]</p>
    </div>
  );
};

/*
// Contenido original comentado
const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="markdown-preview p-4 overflow-auto h-full">
      <div className="h-full flex flex-col">
        <div className="p-2 border-b bg-gray-50 dark:bg-gray-800">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Previsualización</h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-slate dark:prose-invert max-w-none"
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />, 
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4" {...props} />
              ),
              code({ node, inline, className, children, ...props }) {
                //const match = /language-(\w+)/.exec(className || '');
                //if (!inline && match) {
                //  return (
                //    <SyntaxHighlighter
                //      style={atomDark}
                //      language={match[1]}
                //      PreTag="div"
                //      {...props}
                //    >
                //      {String(children).replace(/\n$/, '')}
                //    </SyntaxHighlighter>
                //  );
                //} 
                //return (
                //  <code className={className} {...props}>
                //    {children}
                //  </code>
                //);
                 return (
                  <code className="block whitespace-pre overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded" {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto" {...props} /> 
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
*/

export default MarkdownPreview; 