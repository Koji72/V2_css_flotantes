import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NavigationBar from '../components/NavigationBar';
import FloatingElement from '../components/FloatingElement';

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>SagaWeaver - Sistema Avanzado para Juegos de Rol</title>
        <meta name="description" content="SagaWeaver es un sistema para crear y presentar contenido para juegos de rol con una interfaz moderna y atractiva." />
      </Head>

      <NavigationBar />
      
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
              SagaWeaver
            </h1>
            <p className="text-xl mb-6 text-gray-300">
              El sistema definitivo para crear y presentar contenido para tus juegos de rol con estilo y funcionalidad.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/style-selector" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Probar Editor
              </Link>
              <Link 
                href="/template-gallery" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Ver Plantillas
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              <div className="relative bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
                <FloatingElement 
                  position="right" 
                  style="tech-corners" 
                  title="Panel de Tecnología" 
                  width="55%" 
                  icon="Shield"
                  animation="glow"
                >
                  Panel con efectos visuales avanzados y animaciones para tus descripciones de tecnología futurista.
                </FloatingElement>
                <FloatingElement 
                  position="left" 
                  style="scroll" 
                  title="Pergamino Antiguo" 
                  width="45%"
                  icon="Scroll"
                  animation="none"
                >
                  Estilo clásico para presentar textos antiguos, profecías y manuscritos mágicos.
                </FloatingElement>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <div className="text-cyan-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Editor Interactivo</h2>
            <p className="text-gray-300 mb-4">
              Un selector visual que te permite configurar y previsualizar tus elementos con facilidad antes de usarlos.
            </p>
            <Link href="/style-selector" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center">
              Probar Editor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <div className="text-cyan-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Plantillas Predefinidas</h2>
            <p className="text-gray-300 mb-4">
              Colección de plantillas listas para usar en diferentes contextos: personajes, ubicaciones, objetos y más.
            </p>
            <Link href="/template-gallery" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center">
              Explorar Plantillas
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <div className="text-cyan-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Biblioteca de Iconos</h2>
            <p className="text-gray-300 mb-4">
              Una amplia selección de iconos temáticos para enriquecer tus descripciones y paneles informativos.
            </p>
            <Link href="/icon-library" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center">
              Ver Iconos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Funcionalidades Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { feature: 'Elementos Flotantes', href: '/floating-elements-demo' },
              { feature: 'Elementos Avanzados', href: '/advanced-elements-demo' },
              { feature: 'Tablas RPG', href: '/rpg-tables-demo' },
              { feature: 'Componentes UI', href: '/components-demo' },
              { feature: 'Sistema de Animaciones', href: '/style-selector' },
              { feature: 'Markdown Mejorado', href: '/floating-elements-demo' },
              { feature: 'Tema Personalizable', href: '/theme-creator' },
              { feature: 'Biblioteca de Iconos', href: '/icon-library' }
            ].map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors"
              >
                {item.feature}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-900 to-indigo-900 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            SagaWeaver es completamente gratuito y de código abierto. Utilízalo en tus juegos de rol y sesiones narrativas para crear experiencias únicas y memorables.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/style-selector" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Construir Panel
            </Link>
            <Link 
              href="/template-gallery" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explorar Plantillas
            </Link>
            <Link 
              href="https://github.com/Koji72/V2_css_flotantes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p>SagaWeaver v1.0 - Sistema Avanzado para Juegos de Rol</p>
          <p className="mt-2">Creado con ❤️ para la comunidad de jugadores de rol</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 