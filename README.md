# CSS Flotantes v2.6

Editor de paneles flotantes con estilos CSS personalizados para crear documentos interactivos y atractivos.

## Características principales

- **Editor de código Markdown** con vista previa en tiempo real
- **Plantillas CSS predefinidas** con estilos listos para usar
- **Paneles flotantes** para organizar mejor la información
- **Temas claro/oscuro** para diferentes preferencias visuales
- **Interfaz intuitiva** para edición rápida y eficiente

## Tecnologías

- React
- TypeScript
- Tailwind CSS
- Vite
- CodeMirror (editor de código)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/V2_css_flotantes.git

# Entrar al directorio
cd V2_css_flotantes

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

1. Selecciona una plantilla de la lista disponible
2. Edita el código Markdown en el panel izquierdo
3. Visualiza los cambios en tiempo real en el panel derecho
4. Usa la barra de herramientas para aplicar estilos y añadir bloques

## Estructura de carpetas

- `/src` - Código fuente de la aplicación
- `/public/templates` - Plantillas CSS disponibles
- `/src/components` - Componentes React
- `/src/utils` - Utilidades y lógica de negocio
- `/src/styles` - Estilos CSS y definiciones

## Ejemplos de paneles

```markdown
::: panel
## Título del panel

Contenido del panel con **markdown** y *estilos*
:::

::: panel layout=float-right width=40%
## Panel flotante a la derecha

Este panel flota a la derecha con un ancho del 40%
:::
```

## Licencia

MIT 