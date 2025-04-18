import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

// Registramos los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// Tipos de datos para las estadísticas de paneles
interface PanelUsageData {
  style: string;
  count: number;
  color: string;
}

interface AnimationUsageData {
  animation: string;
  count: number;
  color: string;
}

interface PerformanceData {
  type: string;
  renderTime: number;
  complexityScore: number;
  color: string;
}

export default function PanelAnalytics() {
  // Datos de ejemplo para estilos de panel
  const panelUsageData: PanelUsageData[] = [
    { style: 'tech', count: 87, color: 'rgba(54, 162, 235, 0.8)' },
    { style: 'fantasy', count: 65, color: 'rgba(153, 102, 255, 0.8)' },
    { style: 'glass', count: 42, color: 'rgba(75, 192, 192, 0.8)' },
    { style: 'neo', count: 38, color: 'rgba(255, 99, 132, 0.8)' },
    { style: 'metal', count: 31, color: 'rgba(255, 159, 64, 0.8)' },
    { style: 'tech-corners', count: 29, color: 'rgba(20, 120, 220, 0.8)' },
    { style: 'cut-corners', count: 26, color: 'rgba(130, 150, 180, 0.8)' },
    { style: 'corner-brackets', count: 22, color: 'rgba(255, 205, 86, 0.8)' },
    { style: 'hologram', count: 21, color: 'rgba(75, 220, 160, 0.8)' },
    { style: 'circuit', count: 18, color: 'rgba(180, 220, 75, 0.8)' },
    { style: 'scroll', count: 15, color: 'rgba(200, 150, 100, 0.8)' },
    { style: 'default', count: 12, color: 'rgba(150, 150, 150, 0.8)' }
  ];

  // Datos de ejemplo para animaciones
  const animationUsageData: AnimationUsageData[] = [
    { animation: 'pulse', count: 54, color: 'rgba(255, 99, 132, 0.8)' },
    { animation: 'glow', count: 48, color: 'rgba(54, 162, 235, 0.8)' },
    { animation: 'fade', count: 32, color: 'rgba(255, 205, 86, 0.8)' },
    { animation: 'rotate', count: 28, color: 'rgba(75, 192, 192, 0.8)' },
    { animation: 'shake', count: 25, color: 'rgba(153, 102, 255, 0.8)' },
    { animation: 'none', count: 119, color: 'rgba(201, 203, 207, 0.8)' }
  ];

  // Datos de ejemplo para rendimiento
  const performanceData: PerformanceData[] = [
    { type: 'tech', renderTime: 28, complexityScore: 65, color: 'rgba(54, 162, 235, 0.8)' },
    { type: 'fantasy', renderTime: 35, complexityScore: 58, color: 'rgba(153, 102, 255, 0.8)' },
    { type: 'glass', renderTime: 42, complexityScore: 72, color: 'rgba(75, 192, 192, 0.8)' },
    { type: 'neo', renderTime: 48, complexityScore: 80, color: 'rgba(255, 99, 132, 0.8)' },
    { type: 'metal', renderTime: 32, complexityScore: 60, color: 'rgba(255, 159, 64, 0.8)' },
    { type: 'hologram', renderTime: 45, complexityScore: 75, color: 'rgba(75, 220, 160, 0.8)' }
  ];

  // Preparar datos para la gráfica de barras
  const barChartData = {
    labels: panelUsageData.map(item => item.style),
    datasets: [
      {
        label: 'Número de usos',
        data: panelUsageData.map(item => item.count),
        backgroundColor: panelUsageData.map(item => item.color),
        borderColor: panelUsageData.map(item => item.color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para la gráfica de dona
  const doughnutChartData = {
    labels: animationUsageData.map(item => item.animation),
    datasets: [
      {
        label: 'Número de usos',
        data: animationUsageData.map(item => item.count),
        backgroundColor: animationUsageData.map(item => item.color),
        borderColor: animationUsageData.map(item => item.color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para el radar chart
  const radarChartData = {
    labels: ['Tiempo de renderizado', 'Complejidad', 'Elementos interactivos', 'Uso de memoria', 'Compatibilidad', 'Personalización'],
    datasets: performanceData.map(item => ({
      label: item.type,
      data: [
        item.renderTime, 
        item.complexityScore, 
        Math.floor(Math.random() * 40) + 40, // Valores aleatorios para demostración
        Math.floor(Math.random() * 30) + 50,
        Math.floor(Math.random() * 20) + 70,
        Math.floor(Math.random() * 25) + 60,
      ],
      backgroundColor: item.color.replace('0.8', '0.2'),
      borderColor: item.color.replace('0.8', '1'),
      borderWidth: 2,
      pointBackgroundColor: item.color,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: item.color,
    })),
  };

  // Opciones para las gráficas
  const barOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Uso de estilos de panel',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Usos: ${context.raw}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Uso de animaciones',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
        }
      }
    },
    maintainAspectRatio: false,
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          backdropColor: 'transparent',
        }
      }
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Comparativa de rendimiento',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Estadísticas de resumen
  const totalPanels = panelUsageData.reduce((sum, item) => sum + item.count, 0);
  const totalAnimations = animationUsageData.reduce((sum, item) => sum + item.count, 0);
  const avgRenderTime = Math.round(performanceData.reduce((sum, item) => sum + item.renderTime, 0) / performanceData.length);
  const mostPopularStyle = [...panelUsageData].sort((a, b) => b.count - a.count)[0];
  const mostPopularAnimation = [...animationUsageData].filter(a => a.animation !== 'none').sort((a, b) => b.count - a.count)[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Panel Analytics - SagaWeaver</title>
        <meta name="description" content="Análisis de uso de paneles y estadísticas de rendimiento" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/Chart.min.css" />
      </Head>

      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
          Panel Analytics Dashboard
        </h1>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-5 shadow-lg border border-cyan-700">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total de Paneles</h3>
            <p className="text-3xl font-bold text-white">{totalPanels}</p>
            <div className="mt-2 text-xs text-cyan-400">Todos los estilos combinados</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5 shadow-lg border border-purple-700">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Estilo Más Popular</h3>
            <p className="text-3xl font-bold text-white">{mostPopularStyle.style}</p>
            <div className="mt-2 text-xs text-purple-400">{mostPopularStyle.count} usos registrados</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5 shadow-lg border border-pink-700">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Animación Preferida</h3>
            <p className="text-3xl font-bold text-white">{mostPopularAnimation.animation}</p>
            <div className="mt-2 text-xs text-pink-400">{mostPopularAnimation.count} aplicaciones</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5 shadow-lg border border-green-700">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Tiempo Medio de Render</h3>
            <p className="text-3xl font-bold text-white">{avgRenderTime}ms</p>
            <div className="mt-2 text-xs text-green-400">Promedio de todos los estilos</div>
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-800">
            <div className="h-80">
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800">
            <div className="h-80">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Gráfica de radar */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-pink-800 mb-8">
          <div className="h-96">
            <Radar data={radarChartData} options={radarOptions} />
          </div>
        </div>

        {/* Tendencias y recomendaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-indigo-800">
            <h3 className="text-xl font-bold mb-4 text-indigo-300">Tendencias de Uso</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="inline-block w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
                <span>Los paneles tech son los más utilizados en documentación técnica</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span>La animación glow está ganando popularidad en narrativas</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                <span>Los paneles neo tienen mayor tiempo de renderizado pero mayor impacto visual</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span>Los paneles con esquinas cortadas tienen buen rendimiento en dispositivos móviles</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-800">
            <h3 className="text-xl font-bold mb-4 text-green-300">Recomendaciones</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-700 rounded-full mr-2 flex-shrink-0 mt-1">
                  <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                </span>
                <span>Considerar la implementación de cache para paneles neo y hologram</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-700 rounded-full mr-2 flex-shrink-0 mt-1">
                  <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                </span>
                <span>Optimizar el efecto glow para reducir impacto en dispositivos de gama baja</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-700 rounded-full mr-2 flex-shrink-0 mt-1">
                  <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                </span>
                <span>Desarrollar nuevos estilos basados en los preferidos por los usuarios</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-700 rounded-full mr-2 flex-shrink-0 mt-1">
                  <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                </span>
                <span>Implementar lazy loading para paneles que están fuera de la vista inicial</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 