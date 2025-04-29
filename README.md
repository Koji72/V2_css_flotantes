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

## 🎨 Decoraciones de Esquinas y Bordes en Paneles

### Sintaxis Correcta

Utiliza siempre **doble dos puntos** (`::`) para las directivas de esquina y borde:

```markdown
::corner[pos=top-left type=2 offset=4]
::T-edge[type=2 span=40% offset=2]
::B-edge[type=1 span=30]
::L-edge[type=1]
::R-edge[type=2 offset=3]
```

> ⚠️ **No uses triple dos puntos (`:::`)**  
> Ejemplo incorrecto: `:::corner`  
> Ejemplo correcto: `::corner`

---

### Atributos Disponibles

- **corner**
  - `pos`: `top-left`, `top-right`, `bottom-left`, `bottom-right`
  - `type`: Variante visual (ej. `type="2"`)
  - `offset`: Desplazamiento en píxeles (ej. `offset="4"`)
  - `flipH`, `flipV`: Reflejo horizontal/vertical (`true`/`false`)

- **T-edge, B-edge, L-edge, R-edge**
  - `type`: Variante visual (ej. `type="1"`)
  - `offset`: Desplazamiento en píxeles
  - `span`: Longitud del borde (ej. `span="40%"` o `span="30"`)

---

### Ejemplo Completo

```markdown
:::panel
Panel con decoraciones

::corner[pos=top-left type=2 offset=4]
::corner[pos=bottom-right type=1]

::T-edge[type=2 span=40% offset=2]
::B-edge[type=1 span=30]
::L-edge[type=1]
::R-edge[type=2 offset=3]
:::
```

---

### Notas Técnicas

- El parser convierte estas directivas en `<div>` con clases como `.panel-corner.corner-pos--top-left.corner-type-2`.
- Los estilos están definidos en `src/styles/components/all-panel-styles.css`.
- Si una decoración no aparece, revisa la sintaxis y asegúrate de que los estilos CSS estén correctamente importados. 