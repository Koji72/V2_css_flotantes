export const readCSSFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.match('text/css')) {
            reject(new Error('Archivo inválido o no CSS.'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                resolve(event.target.result);
            } else {
                reject(new Error('No se pudo leer CSS.'));
            }
        };
        
        reader.onerror = (event) => {
            console.error("FileReader Error:", event);
            reject(new Error('Error al leer CSS.'));
        };
        
        reader.readAsText(file);
    });
};

export {}; 