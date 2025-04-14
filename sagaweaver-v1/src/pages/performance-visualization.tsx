import React, { useState, useEffect } from 'react';
import { processLayoutElements } from '../utils/processLayoutElements';
import { NextPage } from 'next';

interface PerformanceResult {
  name: string;
  totalTime: number;
  averageTime: number;
  operations: number;
  cacheHitRatio?: number;
}

const PerformanceVisualization: NextPage = () => {
  const [results, setResults] = useState<PerformanceResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const newResults: PerformanceResult[] = [];
    const totalTests = 5;
    let completedTests = 0;

    // Test 1: Cache hit performance
    const simplePanel = `
      :::float[left]{style=tech width=30%}
      Contenido simple
      :::
    `;
    
    const startTime1 = performance.now();
    for (let i = 0; i < 1000; i++) {
      processLayoutElements(simplePanel);
    }
    const endTime1 = performance.now();
    const totalTime1 = endTime1 - startTime1;
    
    newResults.push({
      name: 'Cache hit',
      totalTime: totalTime1,
      averageTime: totalTime1 / 1000,
      operations: 1000,
    });
    
    completedTests++;
    setProgress((completedTests / totalTests) * 100);
    setResults([...newResults]);
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa para actualizar UI

    // Test 2: Style variations
    const styles = ['tech', 'fantasy', 'alert', 'hologram', 'neo-frame'];
    const resultSet = new Set();
    
    const startTime2 = performance.now();
    for (let i = 0; i < 100; i++) {
      const style = styles[i % styles.length];
      const panel = `:::float[left]{style=${style} width=30%}\nPanel con estilo ${style}\n:::`;
      const result = processLayoutElements(panel);
      resultSet.add(result);
    }
    const endTime2 = performance.now();
    const totalTime2 = endTime2 - startTime2;
    
    newResults.push({
      name: 'Style variations',
      totalTime: totalTime2,
      averageTime: totalTime2 / 100,
      operations: 100,
      cacheHitRatio: ((100 - resultSet.size) / 100) * 100
    });
    
    completedTests++;
    setProgress((completedTests / totalTests) * 100);
    setResults([...newResults]);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test 3: Nested panels
    const nestedPanel = `
      :::float[left]{style=tech width=30%}
      Contenido exterior
      :::float[right]{style=fantasy width=60%}
      Contenido interior
      :::
      :::
    `;
    
    const startTime3 = performance.now();
    for (let i = 0; i < 100; i++) {
      processLayoutElements(nestedPanel);
    }
    const endTime3 = performance.now();
    const totalTime3 = endTime3 - startTime3;
    
    newResults.push({
      name: 'Nested panels',
      totalTime: totalTime3,
      averageTime: totalTime3 / 100,
      operations: 100
    });
    
    completedTests++;
    setProgress((completedTests / totalTests) * 100);
    setResults([...newResults]);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test 4: Real-world document
    const document = `
      # Documento de ejemplo
      
      Contenido introductorio con **formato** y [enlaces](https://example.com).
      
      :::float[left]{style=tech width=30%}
      ## Panel informativo
      - Lista de elementos
      - Con formato
      - Y enlaces
      
      > Cita importante
      :::
      
      Más contenido con \`código\` y **formato**.
      
      :::float[right]{style=fantasy animation=glow width=40%}
      ### Panel destacado
      1. Lista numerada
      2. Con diferentes niveles
         - Sublista
         - Con más elementos
      :::
    `;
    
    const startTime4 = performance.now();
    for (let i = 0; i < 20; i++) {
      processLayoutElements(document);
    }
    const endTime4 = performance.now();
    const totalTime4 = endTime4 - startTime4;
    
    newResults.push({
      name: 'Real-world document',
      totalTime: totalTime4,
      averageTime: totalTime4 / 20,
      operations: 20
    });
    
    completedTests++;
    setProgress((completedTests / totalTests) * 100);
    setResults([...newResults]);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test 5: Cache warmup comparison
    const pages = [
      `# Página 1\n\n:::float[left]{style=tech width=30%}\nPanel 1\n:::\n\nContenido 1.`,
      `# Página 2\n\n:::float[right]{style=fantasy width=40%}\nPanel 2\n:::\n\nContenido 2.`,
      `# Página 3\n\n:::float[center]{style=alert width=50%}\nPanel 3\n:::\n\nContenido 3.`
    ];
    
    // Cold cache
    const startTimeCold = performance.now();
    for (const page of pages) {
      processLayoutElements(page);
    }
    const endTimeCold = performance.now();
    const totalTimeCold = endTimeCold - startTimeCold;
    
    // Warm cache
    const startTimeWarm = performance.now();
    for (const page of pages) {
      processLayoutElements(page);
    }
    const endTimeWarm = performance.now();
    const totalTimeWarm = endTimeWarm - startTimeWarm;
    
    const improvement = ((totalTimeCold - totalTimeWarm) / totalTimeCold) * 100;
    
    newResults.push({
      name: 'Cache warmup',
      totalTime: totalTimeWarm,
      averageTime: totalTimeWarm / pages.length,
      operations: pages.length,
      cacheHitRatio: improvement
    });
    
    completedTests++;
    setProgress((completedTests / totalTests) * 100);
    setResults([...newResults]);

    setIsRunning(false);
  };

  const getBarWidth = (value: number, maxValue: number, scale = 100) => {
    return Math.max(5, Math.min(100, (value / maxValue) * scale));
  };

  const getBarColor = (averageTime: number) => {
    if (averageTime < 1) return 'bg-green-500';
    if (averageTime < 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTime = (time: number) => {
    if (time < 1) return `${(time * 1000).toFixed(3)} μs`;
    return `${time.toFixed(2)} ms`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Visualización de rendimiento</h1>
      <p className="mb-4">Esta página ejecuta pruebas de rendimiento y muestra los resultados de forma visual.</p>
      
      <button
        onClick={runTests}
        disabled={isRunning}
        className={`px-4 py-2 mb-6 rounded ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold`}
      >
        {isRunning ? 'Ejecutando pruebas...' : 'Ejecutar pruebas'}
      </button>

      {isRunning && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>Progreso: {Math.round(progress)}%</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Resultados</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Tiempo promedio por operación</h3>
            <div className="space-y-4">
              {results.map((result, index) => {
                const maxTime = Math.max(...results.map(r => r.averageTime));
                const barWidth = getBarWidth(result.averageTime, maxTime);
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-40 text-right pr-4">{result.name}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(result.averageTime)} flex items-center pl-2`}
                          style={{ width: `${barWidth}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            {formatTime(result.averageTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right pl-2">
                      {formatTime(result.averageTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Tiempo total</h3>
            <div className="space-y-4">
              {results.map((result, index) => {
                const maxTime = Math.max(...results.map(r => r.totalTime));
                const barWidth = getBarWidth(result.totalTime, maxTime);
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-40 text-right pr-4">{result.name}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-blue-500 flex items-center pl-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            {result.totalTime.toFixed(2)} ms
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right pl-2">
                      {result.totalTime.toFixed(2)} ms
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {results.some(r => r.cacheHitRatio !== undefined) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Tasa de aciertos del caché</h3>
              <div className="space-y-4">
                {results
                  .filter(r => r.cacheHitRatio !== undefined)
                  .map((result, index) => {
                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-40 text-right pr-4">{result.name}</div>
                        <div className="flex-1">
                          <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-green-500 flex items-center pl-2"
                              style={{ width: `${result.cacheHitRatio}%` }}
                            >
                              <span className="text-white text-sm font-medium">
                                {result.cacheHitRatio?.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-20 text-right pl-2">
                          {result.cacheHitRatio?.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          
          <div className="bg-gray-100 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold mb-2">Detalles completos</h3>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Prueba</th>
                  <th className="border px-4 py-2">Tiempo total (ms)</th>
                  <th className="border px-4 py-2">Tiempo promedio</th>
                  <th className="border px-4 py-2">Operaciones</th>
                  <th className="border px-4 py-2">Tasa de aciertos</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-4 py-2">{result.name}</td>
                    <td className="border px-4 py-2">{result.totalTime.toFixed(2)} ms</td>
                    <td className="border px-4 py-2">{formatTime(result.averageTime)}</td>
                    <td className="border px-4 py-2">{result.operations}</td>
                    <td className="border px-4 py-2">
                      {result.cacheHitRatio !== undefined ? `${result.cacheHitRatio.toFixed(2)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceVisualization; 