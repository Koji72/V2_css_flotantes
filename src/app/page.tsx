'use client';

import { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';

export default function Home() {
  const [markdown, setMarkdown] = useState('# Hola Mundo\n\nEste es un editor de Markdown');

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editor de Markdown</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[80vh] border rounded-lg overflow-hidden">
            <MarkdownEditor 
              value={markdown} 
              onChange={setMarkdown} 
            />
          </div>
          <div className="h-[80vh] border rounded-lg p-4 overflow-auto">
            <MarkdownPreview content={markdown} />
          </div>
        </div>
      </div>
    </main>
  );
} 