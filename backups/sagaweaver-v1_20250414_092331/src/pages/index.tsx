import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Grid, Layers, Table2, BookOpen } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      title: 'Elementos Flotantes',
      description: 'Componentes que flotan a la izquierda, derecha o centro con múltiples estilos visuales y animaciones.',
      path: '/floating-elements-demo',
      icon: <Layers size={24} />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'Paneles RPG',
      description: 'Paneles de estilo RPG con diseño de dos columnas, perfectos para hojas de personaje y documentación de juegos.',
      path: '/rpg-tables-demo',
      icon: <Grid size={24} />,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    {
      title: 'Tablas Mejoradas',
      description: 'Sistema de tablas con múltiples estilos visuales, efectos interactivos y opciones de personalización.',
      path: '/enhanced-tables-demo',
      icon: <Table2 size={24} />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'Documentación',
      description: 'Guías detalladas sobre cómo usar e integrar todos los componentes en tus proyectos.',
      path: '/documentation',
      icon: <BookOpen size={24} />,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>SagaWeaver - Sistema Avanzado de Layouts</title>
        <meta name="description" content="Sistema avanzado para la gestión de layouts en documentos markdown" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SagaWeaver v1</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="px-4 py-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Sistema Avanzado de <span className="text-indigo-600">Layouts Dinámicos</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Crea documentos visualmente impactantes con nuestros componentes de diseño avanzado.
              Elementos flotantes, columnas, paneles RPG y más.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/floating-elements-demo" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Ver demostración
              </Link>
              <Link href="/documentation" className="ml-4 px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600">
                Documentación
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-10 px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Componentes Disponibles</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <Link 
                  key={index} 
                  href={feature.path}
                  className="block group"
                >
                  <div className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
                    <div className={`${feature.color} h-3`}></div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3 text-indigo-600">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                        </div>
                        <p className="mt-3 text-base text-gray-500">{feature.description}</p>
                      </div>
                      <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-800">
                        <span className="font-medium">Explorar</span>
                        <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Comienza a mejorar tus documentos hoy mismo
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-indigo-100">
              SagaWeaver transforma la forma en que creas y presentas tus contenidos, combinando
              la simplicidad del markdown con la potencia del diseño avanzado.
            </p>
            <Link href="https://github.com/usuario/sagaweaver" className="mt-8 inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
              Ver en GitHub
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SagaWeaver. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 