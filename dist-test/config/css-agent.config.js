"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssAgentConfig = void 0;
exports.cssAgentConfig = {
    // Reglas de nomenclatura
    naming: {
        prefix: 'sw-', // Prefijo para clases de SagaWeaver
        component: 'c-', // Prefijo para componentes
        utility: 'u-', // Prefijo para utilidades
        state: 'is-', // Prefijo para estados
        theme: 't-', // Prefijo para temas
    },
    // Estructura de archivos
    fileStructure: {
        base: 'src/styles/base',
        components: 'src/styles/components',
        layouts: 'src/styles/layouts',
        themes: 'src/styles/themes',
        utilities: 'src/styles/utilities',
    },
    // Reglas de estilo
    styleRules: {
        // Selectores
        selectors: {
            maxDepth: 3, // Profundidad máxima de anidamiento
            maxSpecificity: 2, // Especificidad máxima permitida
            avoidId: true, // Evitar selectores por ID
        },
        // Propiedades
        properties: {
            order: [
                'position',
                'display',
                'flex',
                'grid',
                'box-model',
                'typography',
                'visual',
                'misc',
            ],
            shorthand: true, // Usar propiedades shorthand cuando sea posible
        },
        // Valores
        values: {
            units: {
                prefer: 'rem',
                allow: ['rem', 'px', 'em', '%', 'vh', 'vw'],
            },
            colors: {
                format: 'hex', // Formato preferido para colores
                variables: true, // Usar variables CSS para colores
            },
        },
    },
    // Optimización
    optimization: {
        minify: true,
        purge: true,
        autoprefixer: true,
        removeComments: true,
    },
    // Accesibilidad
    accessibility: {
        minContrast: 4.5, // Ratio de contraste mínimo
        fontSize: {
            min: '1rem',
            max: '2.5rem',
        },
        focusVisible: true, // Estilos para focus visible
    },
    // Responsive
    responsive: {
        breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        mobileFirst: true,
    },
    // Linting
    linting: {
        stylelint: {
            extends: ['stylelint-config-standard'],
            rules: {
                'selector-class-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
                'no-descending-specificity': null,
                'no-duplicate-selectors': true,
            },
        },
    },
    // Documentación
    documentation: {
        generate: true,
        format: 'markdown',
        include: [
            'variables',
            'mixins',
            'components',
            'utilities',
        ],
    },
};
