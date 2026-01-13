
import React, { useState, useCallback } from 'react';
import EarthScene from './components/EarthScene';
import Sidebar from './components/Sidebar';
import InfoOverlay from './components/InfoOverlay';
import { Globe, Info, Zap, Search } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGlobeClick = useCallback((locationName: string) => {
    setSelectedLocation(locationName);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <EarthScene onLocationClick={handleGlobeClick} />

      {/* UI Overlays */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <Globe className="text-blue-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tighter text-white">GAIA<span className="text-blue-400">SPHERE</span></h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </nav>

      {/* Main Info Display */}
      <InfoOverlay 
        location={selectedLocation} 
        onClose={() => setSelectedLocation(null)} 
      />

      {/* Sidebar for Advanced Features */}
      {isSidebarOpen && (
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Footer Controls / Status */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto max-w-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">
            <Zap className="w-3 h-3" /> System Active
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Drag to rotate. Scroll to zoom. High-fidelity rendering with NASA Blue Marble textures and atmospheric refraction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
