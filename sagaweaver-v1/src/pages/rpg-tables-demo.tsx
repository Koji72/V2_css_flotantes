import React from 'react';
import Head from 'next/head';
import { EnhancedTable, TableColumn, TableRow, TableStyle } from '../components/EnhancedTable';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
// Los estilos globales ya están importados en _app.tsx

const tableData = {
  heroes: {
    columns: [
      { key: 'name', header: 'Nombre' },
      { key: 'class', header: 'Clase' },
      { key: 'level', header: 'Nivel' },
      { key: 'specialAbility', header: 'Habilidad Especial' }
    ],
    rows: [
      { id: '1', name: 'Aelyn', class: 'Mago', level: '12', specialAbility: 'Manipulación del Tiempo' },
      { id: '2', name: 'Thorn', class: 'Guerrero', level: '10', specialAbility: 'Furia Implacable' },
      { id: '3', name: 'Lyra', class: 'Ladrona', level: '8', specialAbility: 'Invisibilidad' },
      { id: '4', name: 'Kael', class: 'Clérigo', level: '9', specialAbility: 'Resurrección' }
    ] as TableRow[]
  },
  monsters: {
    columns: [
      { key: 'name', header: 'Criatura' },
      { key: 'type', header: 'Tipo' },
      { key: 'cr', header: 'Desafío' },
      { key: 'habitat', header: 'Hábitat' }
    ],
    rows: [
      { id: '1', name: 'Dragón Antiguo', type: 'Dragón', cr: '20', habitat: 'Montañas' },
      { id: '2', name: 'Troll de las Cavernas', type: 'Gigante', cr: '8', habitat: 'Subterráneo' },
      { id: '3', name: 'Elemental de Fuego', type: 'Elemental', cr: '6', habitat: 'Volcanes' },
      { id: '4', name: 'Lich', type: 'No-muerto', cr: '15', habitat: 'Ruinas' }
    ] as TableRow[]
  },
  treasures: {
    columns: [
      { key: 'name', header: 'Objeto' },
      { key: 'type', header: 'Tipo' },
      { key: 'rarity', header: 'Rareza' },
      { key: 'effect', header: 'Efecto' }
    ],
    rows: [
      { id: '1', name: 'Espada de Llamas', type: 'Arma', rarity: 'Raro', effect: '+2d6 daño de fuego' },
      { id: '2', name: 'Pergamino de Invisibilidad', type: 'Consumible', rarity: 'Poco común', effect: 'Invisibilidad por 1 hora' },
      { id: '3', name: 'Amuleto de Protección', type: 'Accesorio', rarity: 'Muy raro', effect: '+2 a todas las tiradas de salvación' },
      { id: '4', name: 'Tomo del Conocimiento', type: 'Maravilloso', rarity: 'Legendario', effect: '+2 a Inteligencia' }
    ] as TableRow[]
  }
};

const markdownContent = `
# Demostración de Tablas RPG

Este ejemplo muestra la integración de las tablas mejoradas dentro del diseño de paneles RPG con columnas.

## Características

- Múltiples estilos de tabla (cyber, arcane, ancient, etc.)
- Diseño responsive de dos columnas para paneles RPG
- Integración perfecta entre componentes
- Efectos visuales como filas alternas y resaltado

:::panel
### Registro de Héroes
En este panel encontrarás información sobre los héroes disponibles para tu aventura.

:::split-columns
:::column
#### Lista de Héroes
Aquí tienes un registro de los héroes más valientes del reino, junto con sus habilidades especiales y niveles de experiencia.

:::table-heroes

#### Reclutamiento
Para reclutar a estos héroes, debes visitar la Taberna del Dragón Dorado en la Ciudad Capital. El costo base es de 100 monedas de oro por nivel del héroe.
:::column
#### Reglas de Compañeros
Los héroes pueden unirse a tu grupo bajo las siguientes condiciones:

1. Máximo 3 compañeros a la vez
2. Debes ser al menos de nivel 5
3. Tu alineamiento debe ser compatible
4. Debes completar una misión de lealtad

#### Beneficios
- Acceso a nuevas misiones
- Bonificación de grupo
- Compartir experiencia
- Habilidades complementarias
:::
:::

:::panel cyber
### Bestias y Monstruos
Este registro contiene información crucial sobre las criaturas más peligrosas que podrás encontrar.

:::split-columns
:::column
#### Catálogo de Amenazas
Estas son las criaturas más temidas en las tierras conocidas. Estudia bien sus características antes de enfrentarlas.

:::table-monsters

#### Recompensas
Las autoridades locales ofrecen recompensas por la captura o eliminación de estas amenazas. Consulta con el Gremio de Cazadores para más detalles.
:::column
#### Consejos de Combate

**Dragones**: Evita sus ataques de aliento. Usa hechizos de frío contra dragones de fuego.

**Trolls**: Usa fuego o ácido para prevenir regeneración.

**Elementales**: Utiliza el elemento contrario (agua contra fuego).

**No-muertos**: Efectivos los ataques sagrados y la luz solar.

![Monstruo](https://via.placeholder.com/180x120?text=Monstruo)
:::
:::

:::panel ancient
### Tesoros y Reliquias
En este registro encontrarás los objetos mágicos más codiciados del mundo.

:::split-columns
:::column
#### Artefactos Legendarios
Estos son algunos de los objetos mágicos más poderosos que existen. Muchos aventureros han perdido la vida intentando conseguirlos.

:::table-treasures

#### Ubicaciones
Estos tesoros están dispersos por todo el mundo, algunos escondidos en mazmorras antiguas, otros custodiados por poderosos monstruos.
:::column
#### Identificación de Objetos

Para identificar objetos mágicos desconocidos, puedes:

- Visitar a un mago en cualquier ciudad grande
- Usar el hechizo "Identificar" (nivel 1)
- Probar el objeto (método arriesgado)
- Consultar la biblioteca arcana

El costo de identificación es aproximadamente 100 monedas de oro por objeto, dependiendo de su complejidad.
:::
:::
`;

export default function RPGTablesDemo() {
  const renderTableComponent = (type: string) => {
    const tableInfo = tableData[type as keyof typeof tableData];
    if (!tableInfo) return null;
    
    const tableStyle = type === 'monsters' ? 'cyber' : 
                       type === 'treasures' ? 'ancient' : 'rpg';
    
    return (
      <EnhancedTable 
        columns={tableInfo.columns}
        data={tableInfo.rows}
        style={tableStyle as TableStyle}
        hover
        zebra
        bordered={tableStyle !== 'cyber'}
        compact={type === 'treasures'}
      />
    );
  };

  // Definimos el renderizador de paneles personalizado
  const handlePanelRender = (panelHtml: string) => {
    // Buscar marcadores especiales en el HTML del panel
    if (panelHtml.includes('table-heroes')) {
      return renderTableComponent('heroes');
    } else if (panelHtml.includes('table-monsters')) {
      return renderTableComponent('monsters');
    } else if (panelHtml.includes('table-treasures')) {
      return renderTableComponent('treasures');
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Demo de Tablas RPG | SagaWeaver</title>
        <meta name="description" content="Demostración de integración de tablas mejoradas en paneles RPG" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <MarkdownRenderer 
          markdown={markdownContent} 
          onPanelRender={handlePanelRender}
        />
      </main>
    </>
  );
} 