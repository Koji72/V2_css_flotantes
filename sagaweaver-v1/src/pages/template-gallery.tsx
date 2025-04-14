import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import FloatingElement from '../components/FloatingElement';
import { IconName } from '../components/IconsInline';

// Estilos CSS para la galería
const styles = {
  gallery: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6',
  templateCard: 'bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer border border-gray-700',
  cardTitle: 'text-xl font-bold text-center py-3 bg-gray-700',
  cardPreview: 'h-48 flex items-center justify-center p-4 relative',
  cardDescription: 'p-4 text-sm text-gray-300',
  cardTags: 'flex flex-wrap gap-2 px-4 pb-4',
  tag: 'text-xs bg-gray-600 text-white px-2 py-1 rounded-full',
  filterContainer: 'mb-6 p-4 bg-gray-800 rounded-lg',
  filterTitle: 'text-lg font-bold mb-3',
  filterOptions: 'flex flex-wrap gap-3',
  filterBtn: 'px-3 py-1 rounded-full text-sm transition-colors',
  activeFilter: 'bg-cyan-600 text-white',
  inactiveFilter: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
};

// Definición de los tipos para plantillas
interface Template {
  id: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  categories: string[];
  tags: string[];
}

const TemplateGallery: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Categorías disponibles
  const categories = [
    'all', 'combat', 'narrative', 'character', 'world', 'quest'
  ];
  
  // Definición de las plantillas
  const templates: Template[] = [
    {
      id: 'combat-tracker',
      title: 'Rastreador de Combate',
      description: 'Una plantilla para gestionar turnos de combate, iniciativa y estado de los combatientes.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-red-900 text-white p-2 font-bold rounded-t-lg">Combate</div>
          <div className="flex-1 p-2">
            <FloatingElement 
              position="left"
              style="tech"
              title="Iniciativa"
              animation="none"
              width="100%"
              icon="Shield"
            >
              <div className="text-sm">Lista de turnos</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['combat'],
      tags: ['iniciativa', 'combate', 'turnos']
    },
    {
      id: 'character-sheet',
      title: 'Hoja de Personaje',
      description: 'Plantilla para mostrar las estadísticas, habilidades y equipamiento de un personaje.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-blue-900 text-white p-2 font-bold rounded-t-lg">Personaje</div>
          <div className="flex-1 p-2 grid grid-cols-2 gap-2">
            <FloatingElement 
              position="left"
              style="fantasy"
              title="Estadísticas"
              animation="none"
              width="100%"
              icon="Shield"
            >
              <div className="text-sm">Atributos</div>
            </FloatingElement>
            <FloatingElement 
              position="right"
              style="fantasy"
              title="Equipamiento"
              animation="none"
              width="100%"
              icon="Sword"
            >
              <div className="text-sm">Armas y objetos</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['character'],
      tags: ['personaje', 'stats', 'equipamiento']
    },
    {
      id: 'world-map',
      title: 'Mapa del Mundo',
      description: 'Una plantilla para mostrar mapas interactivos con localizaciones importantes y notas.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-green-900 text-white p-2 font-bold rounded-t-lg">Mapa</div>
          <div className="flex-1 p-2">
            <FloatingElement 
              position="center"
              style="glass" 
              title="Territorios"
              animation="none"
              width="100%"
              icon="Map"
            >
              <div className="text-sm text-center">Mapa Interactivo</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['world'],
      tags: ['mapa', 'localizaciones', 'geografia']
    },
    {
      id: 'story-journal',
      title: 'Diario de Aventura',
      description: 'Plantilla para registrar los eventos importantes de la campaña y seguir la narrativa.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-purple-900 text-white p-2 font-bold rounded-t-lg">Historia</div>
          <div className="flex-1 p-2">
            <FloatingElement 
              position="left"
              style="scroll" 
              title="Crónica"
              animation="none" 
              width="100%"
              icon="Scroll"
            >
              <div className="text-sm">Entradas del diario</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['narrative'],
      tags: ['historia', 'journal', 'eventos']
    },
    {
      id: 'quest-tracker',
      title: 'Gestor de Misiones',
      description: 'Una plantilla para seguir misiones activas, recompensas y objetivos de la campaña.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-yellow-900 text-white p-2 font-bold rounded-t-lg">Misiones</div>
          <div className="flex-1 p-2 grid grid-cols-1 gap-2">
            <FloatingElement 
              position="left"
              style="tech-corners"
              title="Misión Principal"
              animation="none"
              width="100%"
              icon="Star"
            >
              <div className="text-sm">Objetivos principales</div>
            </FloatingElement>
            <FloatingElement 
              position="right"
              style="tech-corners"
              title="Misiones Secundarias"
              animation="none"
              width="100%"
              icon="Scroll"
            >
              <div className="text-sm">Tareas opcionales</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['quest'],
      tags: ['misiones', 'objetivos', 'recompensas']
    },
    {
      id: 'npc-gallery',
      title: 'Galería de NPCs',
      description: 'Plantilla para organizar y visualizar los personajes no jugadores de la campaña.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-cyan-900 text-white p-2 font-bold rounded-t-lg">NPCs</div>
          <div className="flex-1 p-2 grid grid-cols-2 gap-2">
            <FloatingElement 
              position="left"
              style="metal"
              title="Aliados"
              animation="none"
              width="100%"
              icon="Shield"
            >
              <div className="text-sm">Contactos y aliados</div>
            </FloatingElement>
            <FloatingElement 
              position="right"
              style="metal"
              title="Antagonistas"
              animation="none"
              width="100%"
              icon="Sword"
            >
              <div className="text-sm">Villanos y enemigos</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['character', 'narrative'],
      tags: ['npcs', 'personajes', 'contactos']
    },
    {
      id: 'journal-template',
      title: 'Página de Diario',
      description: 'Una plantilla elegante para escribir y presentar notas personales del jugador.',
      preview: (
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col">
          <div className="bg-indigo-900 text-white p-2 font-bold rounded-t-lg">Diario</div>
          <div className="flex-1 p-2">
            <FloatingElement 
              position="center"
              style="scroll"
              title="Notas"
              animation="none"
              width="100%"
              icon="Scroll"
            >
              <div className="text-sm italic">Mis pensamientos...</div>
            </FloatingElement>
          </div>
        </div>
      ),
      categories: ['narrative', 'character'],
      tags: ['notas', 'diario', 'reflexiones']
    }
  ];
  
  // Filtrar plantillas según la categoría activa
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(template => template.categories.includes(activeCategory));
  
  // Función para navegar a la página de detalle de plantilla (simulada)
  const handleTemplateClick = (templateId: string) => {
    // En una implementación real, podría navegar a una página dedicada
    console.log(`Plantilla seleccionada: ${templateId}`);
    // router.push(`/templates/${templateId}`);
    alert(`Has seleccionado la plantilla: ${templateId}`);
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>Galería de Plantillas - SagaWeaver</title>
        <meta name="description" content="Galería de plantillas predefinidas para juegos de rol" />
      </Head>

      <NavigationBar />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Galería de Plantillas</h1>
        
        {/* Filtros de categoría */}
        <div className={styles.filterContainer}>
          <h3 className={styles.filterTitle}>Categorías</h3>
          <div className={styles.filterOptions}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${activeCategory === category ? styles.activeFilter : styles.inactiveFilter}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Galería de plantillas */}
        <div className={styles.gallery}>
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className={styles.templateCard}
              onClick={() => handleTemplateClick(template.id)}
            >
              <div className={styles.cardTitle}>{template.title}</div>
              <div className={styles.cardPreview}>
                {template.preview}
              </div>
              <div className={styles.cardDescription}>{template.description}</div>
              <div className={styles.cardTags}>
                {template.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <p className="text-xl text-gray-400">No se encontraron plantillas para esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery; 