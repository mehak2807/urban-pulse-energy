import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Building2, Users, Activity, MapPin, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<'user' | 'official' | null>(null);

  return (
    <div className="min-h-screen bg-background energy-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-12 h-12 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Urban</span>
              <span className="text-primary glow-text">Pulse</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crowdsourced Urban Energy Intelligence Platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Turning invisible vibrations into harvestable power
          </p>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          {/* Stats bar */}
          <div className="glass rounded-2xl p-6 mb-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users className="w-5 h-5" />
                <span className="text-2xl font-bold">1,427</span>
              </div>
              <p className="text-xs text-muted-foreground">Active Scanners</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <MapPin className="w-5 h-5" />
                <span className="text-2xl font-bold">10</span>
              </div>
              <p className="text-xs text-muted-foreground">Delhi Hotspots</p>
            </div>
            <div className="flex items-center gap-2 text-energy-useful mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold">2.8 MWh</span>
            </div>
            <p className="text-xs text-muted-foreground">Energy Discovered</p>
          </div>

          {/* Role selection */}
          <h2 className="text-2xl font-semibold text-foreground mb-8">Select Your Role</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* User Card */}
            <button
              onClick={() => navigate('/user')}
              onMouseEnter={() => setHoveredRole('user')}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group relative glass rounded-3xl p-8 text-left transition-all duration-500 border-2 ${
                hoveredRole === 'user' ? 'border-primary shadow-[0_0_40px_hsl(175_84%_50%/0.3)]' : 'border-border'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">I'm a Citizen</h3>
                <p className="text-muted-foreground mb-6">
                  Contribute to Delhi's energy map by scanning vibrations around you. Your phone becomes a sensor.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    📱 Scan Energy
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    🎯 Earn Points
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    🌱 Go Green
                  </span>
                </div>
              </div>
            </button>

            {/* Official Card */}
            <button
              onClick={() => navigate('/official')}
              onMouseEnter={() => setHoveredRole('official')}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group relative glass rounded-3xl p-8 text-left transition-all duration-500 border-2 ${
                hoveredRole === 'official' ? 'border-secondary shadow-[0_0_40px_hsl(35_95%_55%/0.3)]' : 'border-border'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-secondary" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">I'm an Official</h3>
                <p className="text-muted-foreground mb-6">
                  Access the intelligence dashboard. View heatmaps, hotspots, and actionable insights for policy.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    🗺️ Heatmaps
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    📊 Analytics
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    🤖 AI Insights
                  </span>
                </div>
              </div>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Zero Hardware Cost • Privacy-First • Powered by Citizen Science
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
