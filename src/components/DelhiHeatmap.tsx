import { HotspotData } from '@/types/energy';
import { MapPin } from 'lucide-react';

interface DelhiHeatmapProps {
  hotspots: HotspotData[];
  onHotspotClick: (hotspot: HotspotData) => void;
}

const DelhiHeatmap = ({ hotspots, onHotspotClick }: DelhiHeatmapProps) => {
  // Delhi map boundaries (approximate)
  const mapBounds = {
    minLat: 28.40,
    maxLat: 28.85,
    minLng: 76.85,
    maxLng: 77.55,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getHotspotColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-energy-high', glow: 'shadow-[0_0_20px_hsl(0_75%_55%/0.6)]' };
    if (score >= 80) return { bg: 'bg-secondary', glow: 'shadow-[0_0_18px_hsl(35_95%_55%/0.5)]' };
    if (score >= 70) return { bg: 'bg-primary', glow: 'shadow-[0_0_15px_hsl(175_84%_50%/0.5)]' };
    return { bg: 'bg-energy-low', glow: 'shadow-[0_0_12px_hsl(200_60%_40%/0.4)]' };
  };

  const getHotspotSize = (users: number) => {
    if (users >= 200) return 'w-8 h-8';
    if (users >= 100) return 'w-6 h-6';
    if (users >= 50) return 'w-5 h-5';
    return 'w-4 h-4';
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden border border-border">
      {/* Delhi outline SVG */}
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified Delhi boundary */}
        <path
          d="M20,10 Q30,5 50,8 Q70,5 80,15 Q90,25 85,40 Q88,55 80,65 Q65,72 50,70 Q35,72 20,65 Q10,55 12,40 Q8,25 20,10 Z"
          fill="hsl(var(--muted))"
          fillOpacity="0.3"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
        />
        
        {/* Grid lines */}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="75"
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
            strokeDasharray="2,2"
            opacity="0.5"
          />
        ))}
        {[15, 30, 45, 60].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
            strokeDasharray="2,2"
            opacity="0.5"
          />
        ))}
      </svg>

      {/* Region labels */}
      <div className="absolute top-[15%] left-[25%] text-[10px] text-muted-foreground/50">North Delhi</div>
      <div className="absolute top-[15%] right-[20%] text-[10px] text-muted-foreground/50">East Delhi</div>
      <div className="absolute bottom-[20%] left-[25%] text-[10px] text-muted-foreground/50">South Delhi</div>
      <div className="absolute top-[40%] left-[15%] text-[10px] text-muted-foreground/50">West Delhi</div>
      <div className="absolute top-[40%] left-[45%] text-[10px] text-muted-foreground/50">Central</div>

      {/* Hotspots */}
      {hotspots.map((hotspot) => {
        const pos = getPosition(hotspot.location.lat, hotspot.location.lng);
        const { bg, glow } = getHotspotColor(hotspot.metrics.suitabilityScore);
        const size = getHotspotSize(hotspot.metrics.totalUsers);

        return (
          <button
            key={hotspot.id}
            onClick={() => onHotspotClick(hotspot)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${size} ${bg} ${glow} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-150 hover:z-20 cursor-pointer group animate-pulse`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={hotspot.location.name}
          >
            {/* Pulse ring effect */}
            <span className={`absolute inset-0 ${bg} rounded-full animate-ping opacity-30`} />
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
              <div className="glass px-3 py-2 rounded-lg text-xs whitespace-nowrap">
                <p className="font-semibold text-foreground">{hotspot.location.name}</p>
                <p className="text-muted-foreground">{hotspot.metrics.totalUsers} users • {hotspot.metrics.confidence}% conf</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 glass px-3 py-2 rounded-lg text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>Click hotspot for details</span>
        </div>
      </div>
    </div>
  );
};

export default DelhiHeatmap;
