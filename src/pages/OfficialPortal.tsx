import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, MapPin, Users, Zap, TrendingUp, 
  Building2, BarChart3, Brain, ChevronRight,
  Thermometer, Activity
} from 'lucide-react';
import { delhiHotspots, getNetworkStats } from '@/data/delhiHotspots';
import { HotspotData } from '@/types/energy';
import DelhiHeatmap from '@/components/DelhiHeatmap';
import HotspotDetailModal from '@/components/HotspotDetailModal';

const OfficialPortal = () => {
  const navigate = useNavigate();
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const stats = getNetworkStats();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-energy-useful';
    if (confidence >= 80) return 'text-primary';
    if (confidence >= 70) return 'text-secondary';
    return 'text-energy-medium';
  };

  const getSuitabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-energy-useful bg-energy-useful/10' };
    if (score >= 80) return { grade: 'A', color: 'text-primary bg-primary/10' };
    if (score >= 70) return { grade: 'B', color: 'text-secondary bg-secondary/10' };
    if (score >= 60) return { grade: 'C', color: 'text-energy-medium bg-energy-medium/10' };
    return { grade: 'D', color: 'text-muted-foreground bg-muted' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-secondary" />
            <span className="text-xl font-bold">
              <span className="text-foreground">Urban</span>
              <span className="text-secondary">Pulse</span>
              <span className="text-muted-foreground text-sm ml-2">| Official Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-energy-useful/10 text-energy-useful text-sm">
            <span className="w-2 h-2 rounded-full bg-energy-useful animate-pulse" />
            Live
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalHotspots}</p>
                <p className="text-xs text-muted-foreground">Active Hotspots</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Contributing Users</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-energy-useful/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-energy-useful" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalEnergy.toLocaleString()} J</p>
                <p className="text-xs text-muted-foreground">Total Energy Detected</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.averageConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Delhi Energy Heatmap
                </h2>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-energy-low" />
                    Low
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-energy-medium" />
                    Medium
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-energy-high" />
                    High
                  </div>
                </div>
              </div>
              
              <DelhiHeatmap 
                hotspots={delhiHotspots} 
                onHotspotClick={setSelectedHotspot}
              />
            </div>
          </div>

          {/* Hotspot List */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              Top Hotspots by Suitability
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {[...delhiHotspots]
                .sort((a, b) => b.metrics.suitabilityScore - a.metrics.suitabilityScore)
                .map((hotspot, index) => {
                  const { grade, color } = getSuitabilityGrade(hotspot.metrics.suitabilityScore);
                  
                  return (
                    <button
                      key={hotspot.id}
                      onClick={() => setSelectedHotspot(hotspot)}
                      className="w-full glass p-4 rounded-xl hover:border-primary/30 border border-transparent transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center font-bold text-lg shrink-0`}>
                          {grade}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-foreground truncate">
                              {hotspot.location.name}
                            </p>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{hotspot.location.area}</p>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{hotspot.metrics.totalUsers}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-primary" />
                              <span className="text-primary">{hotspot.metrics.averageEnergy.toFixed(2)} J</span>
                            </div>
                            <div className={`flex items-center gap-1 ${getConfidenceColor(hotspot.metrics.confidence)}`}>
                              <Activity className="w-3 h-3" />
                              <span>{hotspot.metrics.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </main>

      {/* Hotspot Detail Modal */}
      {selectedHotspot && (
        <HotspotDetailModal 
          hotspot={selectedHotspot} 
          onClose={() => setSelectedHotspot(null)} 
        />
      )}
    </div>
  );
};

export default OfficialPortal;
