import React from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import { NotificationProvider, NotificationDemo, useNotifications } from '../components/NotificationSystem';

// Componente principal de demostración
export default function ComponentsDemo() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Demostración de Componentes - SagaWeaver</title>
          <meta name="description" content="Demostración de los componentes avanzados de SagaWeaver" />
        </Head>

        <NavigationBar />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
            Componentes Avanzados
          </h1>

          <div className="grid grid-cols-1 gap-8">
            {/* Resumen de Componentes */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-800">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Resumen de Componentes</h2>
              <p className="text-gray-300 mb-6">
                SagaWeaver incluye una serie de componentes avanzados para mejorar la experiencia de usuario
                en aplicaciones narrativas y juegos de rol. A continuación se muestran ejemplos de cada uno.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ComponentCard
                  title="Panel Analytics"
                  description="Visualización de datos de uso de paneles y estadísticas de rendimiento."
                  link="/panel-analytics"
                  color="from-blue-800 to-cyan-900"
                />
                <ComponentCard
                  title="Editor de Paneles"
                  description="Herramienta visual para crear paneles personalizados con vista previa en tiempo real."
                  link="/panel-editor"
                  color="from-purple-800 to-blue-900"
                />
                <ComponentCard
                  title="Creador de Temas"
                  description="Sistema para crear y guardar temas visuales completos para la aplicación."
                  link="/theme-creator"
                  color="from-pink-800 to-purple-900"
                />
                <ComponentCard
                  title="Biblioteca de Iconos"
                  description="Colección de iconos temáticos para RPG con filtros y búsqueda."
                  link="/icon-library"
                  color="from-green-800 to-blue-900"
                />
                <ComponentCard
                  title="Sistema de Notificaciones"
                  description="Sistema de alertas temáticas con diferentes estilos y animaciones."
                  color="from-yellow-800 to-red-900"
                  isDemo={true}
                />
                <ComponentCard
                  title="Tablas Avanzadas"
                  description="Tablas con estilos temáticos para mostrar datos de juego."
                  link="/advanced-elements-demo"
                  color="from-red-800 to-orange-900"
                  fragment="tables"
                />
              </div>
            </div>

            {/* Demo de Notificaciones */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-yellow-800">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Sistema de Notificaciones</h2>
              <p className="text-gray-300 mb-6">
                El sistema de notificaciones permite mostrar alertas con diferentes estilos visuales, 
                basados en los mismos temas de paneles. Puedes configurar el tipo, posición, animación y más.
              </p>

              <NotificationDemo />
            </div>

            {/* Integración de componentes */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-800">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Integración y API</h2>
              <p className="text-gray-300 mb-4">
                Todos los componentes están diseñados para integrarse perfectamente entre sí, compartiendo
                los mismos estilos visuales y sistema de temas.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-white">Uso con React</h3>
                  <pre className="bg-gray-900 p-3 rounded text-sm text-green-300 overflow-auto">
{`// Importar componentes
import { 
  NotificationProvider, 
  useNotifications 
} from '../components/NotificationSystem';

// Envolver aplicación con provider
<NotificationProvider>
  <App />
</NotificationProvider>

// Usar en cualquier componente
const { addNotification } = useNotifications();
addNotification({
  title: 'Éxito',
  message: 'Operación completada',
  type: 'success',
  style: 'tech'
});`}
                  </pre>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-white">Integración con Temas</h3>
                  <pre className="bg-gray-900 p-3 rounded text-sm text-purple-300 overflow-auto">
{`// Aplicar tema personalizado
import { ThemeProvider } from '../contexts/ThemeContext';

// Envolver componentes con el proveedor de temas
<ThemeProvider theme="fantasy">
  <FloatingElement style="inherit">
    Este panel usará el tema 'fantasy'
  </FloatingElement>
  
  <Button variant="inherit">
    Este botón coincidirá con el tema
  </Button>
</ThemeProvider>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

// Componente para las tarjetas de navegación
const ComponentCard: React.FC<{
  title: string;
  description: string;
  link?: string;
  color: string;
  isDemo?: boolean;
  fragment?: string;
}> = ({ title, description, link, color, isDemo, fragment }) => {
  const { addNotification } = useNotifications();

  const handleShowDemo = () => {
    addNotification({
      title: 'Demo de Notificación',
      message: `Esta es una demostración de la notificación para el componente "${title}"`,
      type: 'info',
      style: 'tech',
      animation: 'slide',
      actions: [
        {
          label: 'Aceptar',
          onClick: () => {},
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className={`rounded-lg p-6 bg-gradient-to-br ${color} shadow-lg transition-transform hover:scale-105`}>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-100 text-sm mb-4">{description}</p>
      
      {isDemo ? (
        <button
          onClick={handleShowDemo}
          className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-white text-sm transition-colors"
        >
          Ver Demo
        </button>
      ) : (
        <a
          href={`${link}${fragment ? `#${fragment}` : ''}`}
          className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-white text-sm transition-colors inline-block"
        >
          Explorar
        </a>
      )}
    </div>
  );
}; 