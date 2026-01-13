
import React, { useEffect, useState } from 'react';
import { X, ExternalLink, RefreshCw, MapPin } from 'lucide-react';
import { getRegionInsights } from '../services/geminiService';

interface InfoOverlayProps {
  location: string | null;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ location, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      setLoading(true);
      setInsight(null);
      getRegionInsights(location)
        .then(res => setInsight(res))
        .catch(() => setInsight("Failed to retrieve insights for this region."))
        .finally(() => setLoading(false));
    }
  }, [location]);

  if (!location) return null;

  return (
    <div className="absolute top-24 right-6 w-full max-w-sm z-50 animate-in slide-in-from-right-10 duration-500">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white tracking-tight">{location}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-sm text-white/40 animate-pulse">Consulting Gaia AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-invert prose-sm">
                <p className="text-white/80 leading-relaxed italic">
                  "{insight || "No data available."}"
                </p>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Explore More
                </button>
                <button className="p-2 border border-white/10 hover:bg-white/5 rounded-lg transition-all">
                  <RefreshCw className="w-3 h-3 text-white/40" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
