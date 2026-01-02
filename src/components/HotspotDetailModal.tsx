import { HotspotData } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { 
  X, MapPin, Users, Zap, Activity, Thermometer, 
  Brain, TrendingUp, Clock, CheckCircle2 
} from 'lucide-react';

interface HotspotDetailModalProps {
  hotspot: HotspotData;
  onClose: () => void;
}

const HotspotDetailModal = ({ hotspot, onClose }: HotspotDetailModalProps) => {
  const getSuitabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'text-energy-useful' };
    if (score >= 80) return { grade: 'A', label: 'Very Good', color: 'text-primary' };
    if (score >= 70) return { grade: 'B', label: 'Good', color: 'text-secondary' };
    if (score >= 60) return { grade: 'C', label: 'Moderate', color: 'text-energy-medium' };
    return { grade: 'D', label: 'Low', color: 'text-muted-foreground' };
  };

  const { grade, label, color } = getSuitabilityGrade(hotspot.metrics.suitabilityScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 glass rounded-t-3xl p-6 border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <MapPin className="w-4 h-4" />
              <span>{hotspot.location.area}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{hotspot.location.name}</h2>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-xl text-center">
              <div className={`text-3xl font-bold ${color}`}>{grade}</div>
              <p className="text-xs text-muted-foreground mt-1">Suitability</p>
            </div>
            
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-primary">{hotspot.metrics.confidence}%</div>
              <p className="text-xs text-muted-foreground mt-1">Confidence</p>
            </div>
            
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-secondary">{hotspot.metrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Contributors</p>
            </div>
            
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-energy-useful">{hotspot.metrics.averageEnergy.toFixed(2)} J</div>
              <p className="text-xs text-muted-foreground mt-1">Avg Energy</p>
            </div>
          </div>

          {/* Gemini AI Insight */}
          {hotspot.geminiInsight && (
            <div className="glass p-5 rounded-xl border border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">AI Analysis (Gemini)</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {hotspot.geminiInsight}
              </p>
            </div>
          )}

          {/* Energy Breakdown */}
          <div className="glass p-5 rounded-xl">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Energy Potential Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Suitability Score</span>
                  <span className="text-sm font-medium">{hotspot.metrics.suitabilityScore}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-energy-useful rounded-full transition-all duration-500"
                    style={{ width: `${hotspot.metrics.suitabilityScore}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Data Confidence</span>
                  <span className="text-sm font-medium">{hotspot.metrics.confidence}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${hotspot.metrics.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="glass p-5 rounded-xl">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-energy-useful" />
              Verification Layers Passed
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-energy-useful/10 border border-energy-useful/20">
                <CheckCircle2 className="w-4 h-4 text-energy-useful" />
                <span className="text-sm">Physics Gate</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-energy-useful/10 border border-energy-useful/20">
                <CheckCircle2 className="w-4 h-4 text-energy-useful" />
                <span className="text-sm">Context Gate</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-energy-useful/10 border border-energy-useful/20">
                <CheckCircle2 className="w-4 h-4 text-energy-useful" />
                <span className="text-sm">Social Gate</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm">GenAI Validated</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass p-5 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recommended Action
            </h3>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              {hotspot.metrics.suitabilityScore >= 90 ? (
                <>
                  <p>✅ <strong className="text-foreground">Priority 1:</strong> Deploy piezoelectric floor tiles</p>
                  <p>✅ <strong className="text-foreground">Estimated ROI:</strong> 2.5-3 years</p>
                  <p>✅ <strong className="text-foreground">Recommended Area:</strong> 40-60 sqm installation</p>
                </>
              ) : hotspot.metrics.suitabilityScore >= 80 ? (
                <>
                  <p>✅ <strong className="text-foreground">Priority 2:</strong> Conduct professional audit</p>
                  <p>✅ <strong className="text-foreground">Estimated ROI:</strong> 3-4 years</p>
                  <p>✅ <strong className="text-foreground">Pilot Installation:</strong> Recommended</p>
                </>
              ) : (
                <>
                  <p>📋 <strong className="text-foreground">Monitor:</strong> Continue data collection</p>
                  <p>📋 <strong className="text-foreground">Needs:</strong> More user contributions</p>
                  <p>📋 <strong className="text-foreground">Timeline:</strong> Re-evaluate in 30 days</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 glass rounded-b-3xl p-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Last updated: {hotspot.lastUpdated.toLocaleDateString()}
          </div>
          
          <Button variant="energy" onClick={onClose}>
            Mark for Deployment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotspotDetailModal;
