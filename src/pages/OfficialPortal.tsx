import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, MapPin, Users, Zap, TrendingUp, 
  Building2, BarChart3, Brain, ChevronRight,
  Activity, LogOut
} from 'lucide-react';
import { delhiHotspots, getNetworkStats } from '@/data/delhiHotspots';
import { HotspotData } from '@/types/energy';
import DelhiHeatmap from '@/components/DelhiHeatmap';
import HotspotDetailModal from '@/components/HotspotDetailModal';

const OfficialPortal = () => {
  const navigate = useNavigate();
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [loading, setLoading] = useState(true);
  const stats = getNetworkStats();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-energy-useful';
    if (confidence >= 80) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getSuitabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-energy-useful bg-energy-useful/10' };
    if (score >= 80) return { grade: 'A', color: 'text-primary bg-primary/10' };
    if (score >= 70) return { grade: 'B', color: 'text-energy-thermal bg-energy-thermal/10' };
    return { grade: 'C', color: 'text-muted-foreground bg-muted' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">UrbanPulse</span>
            <span className="text-xs text-muted-foreground">Official</span>
          </div>

          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">{stats.totalHotspots}</p>
                <p className="text-xs text-muted-foreground">Hotspots</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-energy-useful/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-energy-useful" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">{stats.totalEnergy.toLocaleString()} J</p>
                <p className="text-xs text-muted-foreground">Energy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">{stats.averageConfidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Delhi Heatmap
                </h2>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-energy-low" />
                    Low
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-energy-medium" />
                    Med
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-energy-high" />
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
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Top Hotspots
            </h2>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {[...delhiHotspots]
                .sort((a, b) => b.metrics.suitabilityScore - a.metrics.suitabilityScore)
                .map((hotspot) => {
                  const { grade, color } = getSuitabilityGrade(hotspot.metrics.suitabilityScore);
                  
                  return (
                    <button
                      key={hotspot.id}
                      onClick={() => setSelectedHotspot(hotspot)}
                      className="w-full bg-background p-3 rounded-lg border border-border hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded ${color} flex items-center justify-center font-semibold text-sm shrink-0`}>
                          {grade}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-foreground truncate">
                              {hotspot.location.name}
                            </p>
                            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{hotspot.location.area}</p>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-muted-foreground">{hotspot.metrics.totalUsers} users</span>
                            <span className="text-primary">{hotspot.metrics.averageEnergy.toFixed(2)} J</span>
                            <span className={getConfidenceColor(hotspot.metrics.confidence)}>{hotspot.metrics.confidence}%</span>
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
