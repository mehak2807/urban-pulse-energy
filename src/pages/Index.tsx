import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Building2, Users, Activity, MapPin } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<'user' | 'official' | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">
              UrbanPulse
            </h1>
          </div>
          <p className="text-muted-foreground">
            Crowdsourced Urban Energy Intelligence
          </p>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>1,427 Scanners</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>10 Hotspots</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>2.8 MWh Discovered</span>
            </div>
          </div>

          {/* Role selection */}
          <h2 className="text-lg font-medium text-foreground mb-6">Select Your Role</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
            {/* User Card */}
            <button
              onClick={() => navigate('/user')}
              onMouseEnter={() => setHoveredRole('user')}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group rounded-xl p-6 text-left transition-all border bg-card ${
                hoveredRole === 'user' ? 'border-primary shadow-sm' : 'border-border'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-1">Citizen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan vibrations and contribute to Delhi's energy map.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                  Scan Energy
                </span>
                <span className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                  Earn Points
                </span>
              </div>
            </button>

            {/* Official Card */}
            <button
              onClick={() => navigate('/auth')}
              onMouseEnter={() => setHoveredRole('official')}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group rounded-xl p-6 text-left transition-all border bg-card ${
                hoveredRole === 'official' ? 'border-primary shadow-sm' : 'border-border'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-1">Official</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access heatmaps, analytics, and AI insights.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                  Heatmaps
                </span>
                <span className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                  Analytics
                </span>
              </div>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-xs text-muted-foreground">
            Zero Hardware • Privacy-First • Citizen Science
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
