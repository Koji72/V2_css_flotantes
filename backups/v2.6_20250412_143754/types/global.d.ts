// src/types/global.d.ts

// Añadir tipos para la File System Access API
// Referencia: https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
  // Añadir otras propiedades/métodos si son necesarios
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | string): Promise<void>;
  close(): Promise<void>;
  // Añadir otras propiedades/métodos si son necesarios
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept?: Record<string, string[]>;
  }>;
}

declare global {
  interface Window {
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
  }
}

// Export vacío para asegurar que sea tratado como un módulo
export {}; 