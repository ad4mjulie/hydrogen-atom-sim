import { useEffect, useRef } from 'react';
import { WavefunctionVisualizer } from './visualizer';
import { setupUI } from './ui';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<WavefunctionVisualizer | null>(null);

  useEffect(() => {
    if (containerRef.current && !visualizerRef.current) {
      const visualizer = new WavefunctionVisualizer(containerRef.current);
      visualizerRef.current = visualizer;
      visualizer.animate();

      setupUI(visualizer);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div id="info" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.5)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#646cff' }}>Quantum Hydrogen</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
          Real-time Schrödinger Equation Visualization
        </p>
      </div>
    </div>
  );
}

export default App;
