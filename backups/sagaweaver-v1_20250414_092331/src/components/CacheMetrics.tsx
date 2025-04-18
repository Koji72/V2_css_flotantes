import React, { useEffect, useState } from 'react';
import { CacheManager } from '../utils/cacheManager';

interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: number;
  hitRate: number;
}

export const CacheMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hits: 0,
    misses: 0,
    size: 0,
    lastCleanup: 0,
    hitRate: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const cacheManager = CacheManager.getInstance();
      const newMetrics = cacheManager.getMetrics();
      setMetrics({
        ...newMetrics,
        hitRate: newMetrics.hits / (newMetrics.hits + newMetrics.misses) || 0
      });
    };

    // Actualizar métricas cada 5 segundos
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Actualizar inmediatamente

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="cache-metrics">
      <h3>Cache Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-label">Hit Rate:</span>
          <span className="metric-value">{(metrics.hitRate * 100).toFixed(2)}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Hits:</span>
          <span className="metric-value">{metrics.hits}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Misses:</span>
          <span className="metric-value">{metrics.misses}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Cache Size:</span>
          <span className="metric-value">{formatBytes(metrics.size)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Last Cleanup:</span>
          <span className="metric-value">{formatTime(metrics.lastCleanup)}</span>
        </div>
      </div>
    </div>
  );
}; 