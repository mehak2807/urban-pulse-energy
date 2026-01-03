import { HotspotData } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { 
  X, MapPin, Users, Zap, Brain, TrendingUp, Clock, CheckCircle2 
} from 'lucide-react';

interface HotspotDetailModalProps {
  hotspot: HotspotData;
  onClose: () => void;
}

const HotspotDetailModal = ({ hotspot, onClose }: HotspotDetailModalProps) => {
  const getSuitabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'text-energy-useful' };
    if (score >= 80) return { grade: 'A', label: 'Very Good', color: 'text-primary' };
    if (score >= 70) return { grade: 'B', label: 'Good', color: 'text-energy-thermal' };
    return { grade: 'C', label: 'Moderate', color: 'text-muted-foreground' };
  };

  const { grade, color } = getSuitabilityGrade(hotspot.metrics.suitabilityScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <MapPin className="w-3 h-3" />
              <span>{hotspot.location.area}</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{hotspot.location.name}</h2>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className={`text-xl font-bold ${color}`}>{grade}</div>
              <p className="text-[10px] text-muted-foreground">Grade</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-foreground">{hotspot.metrics.confidence}%</div>
              <p className="text-[10px] text-muted-foreground">Confidence</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-foreground">{hotspot.metrics.totalUsers}</div>
              <p className="text-[10px] text-muted-foreground">Users</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-energy-useful">{hotspot.metrics.averageEnergy.toFixed(1)}J</div>
              <p className="text-[10px] text-muted-foreground">Avg Energy</p>
            </div>
          </div>

          {/* AI Insight */}
          {hotspot.geminiInsight && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">AI Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hotspot.geminiInsight}
              </p>
            </div>
          )}

          {/* Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Suitability</span>
                <span className="text-xs font-medium">{hotspot.metrics.suitabilityScore}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${hotspot.metrics.suitabilityScore}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-xs font-medium">{hotspot.metrics.confidence}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-energy-useful rounded-full"
                  style={{ width: `${hotspot.metrics.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded bg-energy-useful/10 border border-energy-useful/20 text-xs">
              <CheckCircle2 className="w-3 h-3 text-energy-useful" />
              <span>Physics Gate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-energy-useful/10 border border-energy-useful/20 text-xs">
              <CheckCircle2 className="w-3 h-3 text-energy-useful" />
              <span>Context Gate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-energy-useful/10 border border-energy-useful/20 text-xs">
              <CheckCircle2 className="w-3 h-3 text-energy-useful" />
              <span>Social Gate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-primary/10 border border-primary/20 text-xs">
              <Brain className="w-3 h-3 text-primary" />
              <span>AI Validated</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Recommendation</h3>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              {hotspot.metrics.suitabilityScore >= 90 ? (
                <>
                  <p>• Priority 1: Deploy piezoelectric tiles</p>
                  <p>• Est. ROI: 2.5-3 years</p>
                </>
              ) : hotspot.metrics.suitabilityScore >= 80 ? (
                <>
                  <p>• Priority 2: Conduct professional audit</p>
                  <p>• Pilot installation recommended</p>
                </>
              ) : (
                <>
                  <p>• Continue data collection</p>
                  <p>• Re-evaluate in 30 days</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {hotspot.lastUpdated.toLocaleDateString()}
          </div>
          
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotspotDetailModal;
