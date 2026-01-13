
import React from 'react';
import { X, Search, Settings, Shield, Compass, Layers } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-[60] shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" /> Control Panel
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="space-y-8 flex-1 overflow-y-auto pr-2">
          {/* Search Section */}
          <div>
            <label className="text-xs font-bold uppercase text-white/40 mb-3 block">Global Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Find a city or landmark..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Visualization Settings */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-white/40 block">Visual Layers</label>
            
            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">Atmosphere</span>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">Topography</span>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400/40" />
                <span className="text-sm font-medium text-white/40 text-left">Political Boundaries</span>
              </div>
              <div className="w-10 h-5 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
            GaiaSphere v1.0.4 • Engine: Three.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
