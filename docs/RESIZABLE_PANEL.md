# Panel Redimensionable - Documentación Técnica

## Descripción
Implementación minimalista y eficiente de un panel redimensionable para el editor Universal Scribe. Esta solución proporciona una interfaz dividida con un editor y un preview, permitiendo al usuario ajustar el tamaño de ambos paneles mediante un divisor arrastrable.

## Características Principales

### 1. Estructura Base
```tsx
<div className="app">
  <div className="editor-container">
    <textarea className="editor" />
  </div>
  <div className="divider" />
  <div className="preview" />
</div>
```

### 2. Estado
```typescript
const [leftWidth, setLeftWidth] = useState(50);     // Ancho del panel izquierdo en %
const [isResizing, setIsResizing] = useState(false); // Estado de redimensionamiento
const [content, setContent] = useState('');         // Contenido del editor
```

### 3. Gestión del Redimensionamiento
- **Inicio del redimensionamiento**: Se activa al hacer mouseDown en el divisor
- **Durante el redimensionamiento**: Calcula el nuevo ancho basado en la posición del cursor
- **Límites de redimensionamiento**: Mínimo 20%, máximo 80%
- **Limpieza de eventos**: Elimina los event listeners al finalizar

## Implementación CSS

```css
.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.editor-container {
  height: 100%;
}

.divider {
  width: 1%;
  background: #333;
  cursor: col-resize;
  transition: background-color 0.2s;
}

.preview {
  height: 100%;
  overflow: auto;
}
```

## Ventajas de esta Implementación

1. **Simplicidad**: 
   - Sin dependencias externas
   - Código mínimo y mantenible
   - Fácil de entender y modificar

2. **Rendimiento**:
   - Sin re-renders innecesarios
   - Uso eficiente de event listeners
   - Transiciones suaves

3. **UX Mejorada**:
   - Feedback visual durante el redimensionamiento
   - Límites de tamaño para mantener usabilidad
   - Cursor contextual apropiado

## Uso

```typescript
// 1. Importar los estilos necesarios
import './App.css';

// 2. Implementar el componente
const App: React.FC = () => {
  // ... código del componente ...
};

// 3. Usar el componente
<App />
```

## Consideraciones Técnicas

### Eventos del Mouse
- `mousedown`: Inicia el redimensionamiento
- `mousemove`: Actualiza las dimensiones
- `mouseup`: Finaliza el redimensionamiento

### Cálculo de Dimensiones
```typescript
const newWidth = (e.clientX / window.innerWidth) * 100;
if (newWidth > 20 && newWidth < 80) {
  setLeftWidth(newWidth);
}
```

### Limpieza de Eventos
```typescript
useEffect(() => {
  if (isResizing) {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
  }
  return () => {
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResizing);
  };
}, [isResizing]);
```

## Mejoras Futuras Posibles

1. **Soporte para Temas**:
   - Implementar variables CSS para colores
   - Añadir temas claro/oscuro

2. **Funcionalidades Adicionales**:
   - Redimensionamiento mediante teclado
   - Botón para colapsar/expandir paneles
   - Memoria de último tamaño usado

3. **Optimizaciones**:
   - Debounce en el redimensionamiento
   - Memoización de componentes
   - Virtualización para documentos largos 