# Registro de Deuda Técnica

Este documento registra tareas pendientes relacionadas con la calidad del código, mantenimiento y actualizaciones que deben abordarse.

## Actualización de Dependencias y Vulnerabilidades (Pendiente - 2024-07-28)

*   **Problema:** El comando `npm audit` reporta 5 vulnerabilidades de severidad moderada.
*   **Dependencias Afectadas:**
    1.  **`esbuild` (via `vite`):** Vulnerabilidad [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99). Afecta a versiones de `vite` < `6.1.5`. La corrección automática (`npm audit fix --force`) requeriría actualizar a `vite@6.3.2` (breaking change).
    2.  **`prismjs` (via `refractor` -> `react-syntax-highlighter`):** Vulnerabilidad [GHSA-x7hr-w5r2-h6wg](https://github.com/advisories/GHSA-x7hr-w5r2-h6wg) (DOM Clobbering). Afecta a `prismjs` < `1.30.0`. La corrección automática (`npm audit fix --force`) requeriría actualizar `react-syntax-highlighter` (breaking change).
*   **Decisión:** Se decidió **posponer** la ejecución de `npm audit fix --force` para evitar introducir cambios incompatibles (`breaking changes`) que podrían romper la funcionalidad actual durante el desarrollo activo de características.
*   **Acción Futura:** Investigar el impacto de las actualizaciones de `vite` y `react-syntax-highlighter` y planificar la actualización de forma segura, preferiblemente antes de finalizar la V2.6 o en una fase dedicada a mantenimiento. 