import { useState } from 'react';
import Head from 'next/head';
import EnhancedTable, { TableColumn } from '../components/EnhancedTable';
import StatBlock from '../components/StatBlock';
import { Shield, Wand2, Map, Skull } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';

export default function AdvancedElementsDemo() {
  const [activeTab, setActiveTab] = useState<'tables' | 'statblocks'>('tables');

  // Datos para las tablas de ejemplo
  const tableColumns: TableColumn[] = [
    { key: 'name', header: 'Nombre', width: '25%', highlight: true },
    { key: 'type', header: 'Tipo', width: '15%' },
    { key: 'power', header: 'Poder', width: '15%', align: 'center' },
    { key: 'rarity', header: 'Rareza', width: '15%', align: 'center' },
    { key: 'description', header: 'Descripción', width: '30%' },
  ];

  const tableData = [
    { id: 1, name: 'Espada de Fuego', type: 'Arma', power: 85, rarity: 'Raro', description: 'Una espada envuelta en llamas eternas', highlight: true },
    { id: 2, name: 'Amuleto de Protección', type: 'Accesorio', power: 60, rarity: 'Común', description: 'Reduce el daño recibido en un 15%' },
    { id: 3, name: 'Grimorio Arcano', type: 'Tomo', power: 95, rarity: 'Épico', description: 'Contiene hechizos de gran poder ancestral' },
    { id: 4, name: 'Poción de Invisibilidad', type: 'Consumible', power: 70, rarity: 'Poco común', description: 'Vuelve invisible al usuario durante 3 minutos' },
    { id: 5, name: 'Botas de Velocidad', type: 'Armadura', power: 65, rarity: 'Poco común', description: 'Aumenta la velocidad de movimiento en un 30%' },
    { id: 6, name: 'Corona del Rey Caído', type: 'Accesorio', power: 100, rarity: 'Legendario', description: 'Otorga autoridad sobre los no-muertos', highlight: true },
  ];

  // Datos para los stat blocks
  const characterStats = {
    mainStats: [
      { name: 'FUE', value: 16 },
      { name: 'DES', value: 14 },
      { name: 'CON', value: 15 },
      { name: 'INT', value: 12 },
      { name: 'SAB', value: 10 },
      { name: 'CAR', value: 8 }
    ],
    secondaryStats: [
      { name: 'PV', value: '45/45' },
      { name: 'CA', value: 16 },
      { name: 'Iniciativa', value: '+2' },
      { name: 'Velocidad', value: '9m' }
    ],
    abilities: [
      { name: 'Ataque múltiple', description: 'Realiza dos ataques con su espada larga.' },
      { name: 'Furia', description: 'Entra en estado de furia, ganando ventaja en ataques pero recibiendo más daño.' }
    ]
  };

  const monsterStats = {
    mainStats: [
      { name: 'FUE', value: 20 },
      { name: 'DES', value: 8 },
      { name: 'CON', value: 18 },
      { name: 'INT', value: 7 },
      { name: 'SAB', value: 12 },
      { name: 'CAR', value: 10 }
    ],
    secondaryStats: [
      { name: 'PV', value: '95/95' },
      { name: 'CA', value: 17 },
      { name: 'Resistencia', value: 'Fuego' },
      { name: 'Vulnerabilidad', value: 'Frío' }
    ],
    abilities: [
      { name: 'Golpe devastador', description: 'Realiza un poderoso ataque que causa 3d10+5 de daño contundente.' },
      { name: 'Rugido atemorizante', description: 'Las criaturas en un radio de 9m deben superar una tirada de SAB CD 15 o quedan asustadas durante 1 minuto.' }
    ]
  };

  const itemStats = {
    mainStats: [
      { name: 'Daño', value: '1d8+2' },
      { name: 'Tipo', value: 'Cortante' },
      { name: 'Bonus', value: '+2' }
    ],
    secondaryStats: [
      { name: 'Peso', value: '1.5 kg' },
      { name: 'Propiedad', value: 'Versatil' },
      { name: 'Requiere', value: 'FUE 13' }
    ],
    abilities: [
      { name: 'Filo helado', description: 'Añade 1d6 de daño por frío en cada impacto.' },
      { name: 'Rompe-escudos', description: 'Los escudos golpeados por esta arma tienen desventaja en su siguiente tirada de salvación.' }
    ]
  };

  const spellStats = {
    mainStats: [
      { name: 'Nivel', value: '5' },
      { name: 'Escuela', value: 'Evocación' },
      { name: 'Tiempo', value: '1 acción' }
    ],
    secondaryStats: [
      { name: 'Alcance', value: '18m' },
      { name: 'Duración', value: 'Instantáneo' },
      { name: 'Componentes', value: 'V, S, M' }
    ],
    abilities: [
      { name: 'A niveles superiores', description: 'Al lanzar este hechizo usando un espacio de nivel 6 o superior, el daño aumenta en 1d8 por cada nivel por encima de 5.' },
      { name: 'Efecto base', description: 'Un relámpago forma una línea de 30m de largo y 1.5m de ancho que causa 8d6 de daño eléctrico.' }
    ]
  };

  const locationStats = {
    mainStats: [
      { name: 'Tipo', value: 'Fortaleza' },
      { name: 'Tamaño', value: 'Grande' },
      { name: 'Edad', value: '450 años' }
    ],
    secondaryStats: [
      { name: 'Clima', value: 'Frío' },
      { name: 'Terreno', value: 'Montañoso' },
      { name: 'Población', value: '150' }
    ],
    abilities: [
      { name: 'Barrera mágica', description: 'La fortaleza está protegida por una barrera mágica que impide la teleportación y el vuelo cerca de sus murallas.' },
      { name: 'Catacumbas antiguas', description: 'Bajo la fortaleza se extiende un laberinto de túneles y cámaras llenas de tesoros y peligros.' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Elementos Avanzados - SagaWeaver</title>
        <meta name="description" content="Demostración de elementos visuales avanzados para SagaWeaver" />
      </Head>

      <NavigationBar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
          Elementos Visuales Avanzados
        </h1>
        
        <div className="mb-8 flex justify-center">
          <div className="tabs tabs-boxed bg-gray-800 inline-flex">
            <button 
              className={`tab px-6 py-3 ${activeTab === 'tables' ? 'bg-cyan-700 text-white' : 'text-gray-300'}`}
              onClick={() => setActiveTab('tables')}
            >
              Tablas Avanzadas
            </button>
            <button 
              className={`tab px-6 py-3 ${activeTab === 'statblocks' ? 'bg-cyan-700 text-white' : 'text-gray-300'}`}
              onClick={() => setActiveTab('statblocks')}
            >
              Bloques de Estadísticas
            </button>
          </div>
        </div>

        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 gap-16">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">Tablas con Estilos Visuales</h2>
              <p className="text-gray-300 mb-8">
                Estas tablas presentan información con estilos visuales impactantes y diferentes temáticas.
                Soportan varias características como filas destacadas, efectos al pasar el ratón, y distintos modos de presentación.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns} 
                    data={tableData}
                    style="cyber"
                    title="Inventario Tecnológico"
                    caption="Artefactos del futuro con propiedades especiales"
                    glowing={true}
                  />
                </div>
                
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns} 
                    data={tableData}
                    style="arcane"
                    title="Grimorio Arcano"
                    caption="Objetos mágicos de poder ancestral"
                    glowing={true}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 text-yellow-500">Variantes de Estilo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns} 
                    data={tableData.slice(0, 4)}
                    style="ancient"
                    title="Pergaminos Antiguos"
                    compact={true}
                  />
                </div>
                
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns} 
                    data={tableData.slice(0, 4)}
                    style="shadowy"
                    title="Artefactos Sombríos"
                    compact={true}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Opciones de Configuración</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns.slice(0, 3)} 
                    data={tableData.filter(item => parseInt(item.power.toString()) > 70)}
                    style="modern"
                    title="Objetos de Alto Poder"
                    zebra={false}
                    bordered={true}
                    highlightRows={true}
                    compact={true}
                  />
                </div>
                
                <div className="relative">
                  <EnhancedTable 
                    columns={tableColumns.filter(col => col.key !== 'power' && col.key !== 'description')} 
                    data={tableData}
                    style="cyber"
                    title="Referencia Rápida"
                    bordered={false}
                    compact={true}
                    highlightRows={true}
                    glowing={true}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'statblocks' && (
          <div className="grid grid-cols-1 gap-16">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">Bloques de Estadísticas para Personajes y Criaturas</h2>
              <p className="text-gray-300 mb-8">
                Los bloques de estadísticas presentan información de juego con diseños temáticos según el tipo de entidad.
                Son perfectos para mostrar características de personajes, monstruos, objetos y más.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative">
                  <StatBlock 
                    name="Thorne el Guardián"
                    type="character"
                    level="Guerrero Nivel 5"
                    description="Un veterano guardián de la ciudadela, conocido por su lealtad inquebrantable y su férrea disciplina en combate."
                    mainStats={characterStats.mainStats}
                    secondaryStats={characterStats.secondaryStats}
                    abilities={characterStats.abilities}
                    icon={Shield}
                    iconProps={{ size: 32 }}
                  />
                </div>
                
                <div className="relative">
                  <StatBlock 
                    name="Ogro de las Cavernas"
                    type="creature"
                    level="Monstruo CR 3"
                    description="Una criatura brutal que habita en las profundidades de cavernas olvidadas, atacando a cualquier intruso que ose perturbar su territorio."
                    mainStats={monsterStats.mainStats}
                    secondaryStats={monsterStats.secondaryStats}
                    abilities={monsterStats.abilities}
                    icon={Skull}
                    iconProps={{ size: 32 }}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 text-purple-400">Bloques para Objetos y Hechizos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative">
                  <StatBlock 
                    name="Espada de Hielo Eterno"
                    type="item"
                    level="Objeto Mágico Raro"
                    description="Una espada forjada con hielo del plano elemental del agua, mantiene su filo helado incluso en los climas más cálidos."
                    mainStats={itemStats.mainStats}
                    secondaryStats={itemStats.secondaryStats}
                    abilities={itemStats.abilities}
                    icon={Shield}
                    iconProps={{ size: 32 }}
                  />
                </div>
                
                <div className="relative">
                  <StatBlock 
                    name="Relámpago"
                    type="spell"
                    level="Conjuro de Evocación"
                    description="Un relámpago que parte el aire con un estruendo ensordecedor, causando daño eléctrico a todo lo que encuentre en su camino."
                    mainStats={spellStats.mainStats}
                    secondaryStats={spellStats.secondaryStats}
                    abilities={spellStats.abilities}
                    icon={Wand2}
                    iconProps={{ size: 32 }}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Bloques para Lugares</h2>
              
              <div className="relative max-w-2xl mx-auto">
                <StatBlock 
                  name="Fortaleza de Piedragélida"
                  type="location"
                  level="Lugar de Interés"
                  description="Una imponente fortaleza construida en la cima de una montaña helada, sus torres se elevan hacia el cielo como dedos congelados."
                  mainStats={locationStats.mainStats}
                  secondaryStats={locationStats.secondaryStats}
                  abilities={locationStats.abilities}
                  icon={Map}
                  iconProps={{ size: 32 }}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
} 