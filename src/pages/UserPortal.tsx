import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Zap, ArrowLeft, Activity, Thermometer, CheckCircle2 } from 'lucide-react';
import { 
  generateSimulatedSensorData, 
  performFFT, 
  calculateEnergy, 
  verifyReading 
} from '@/lib/energyCalculations';
import { SensorData, EnergyCalculation, FFTResult, VerificationResult } from '@/types/energy';

type ScanPhase = 'idle' | 'connecting' | 'scanning' | 'processing' | 'complete';

const UserPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [fftResult, setFftResult] = useState<FFTResult | null>(null);
  const [energyCalc, setEnergyCalc] = useState<EnergyCalculation | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [liveAccel, setLiveAccel] = useState({ x: 0, y: 0, z: 9.8 });

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setLiveAccel({
          x: 0.3 + Math.random() * 0.8 * Math.sin(Date.now() / 200),
          y: 0.2 + Math.random() * 0.5 * Math.cos(Date.now() / 300),
          z: 9.8 + Math.random() * 0.4 * Math.sin(Date.now() / 150),
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const startScan = useCallback(async () => {
    setPhase('connecting');
    setProgress(0);
    
    await new Promise(r => setTimeout(r, 1500));
    setPhase('scanning');
    
    const scanDuration = 4000;
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / scanDuration) * 60, 60);
      setProgress(p);
    }, 100);
    
    await new Promise(r => setTimeout(r, scanDuration));
    clearInterval(progressInterval);
    
    const data = generateSimulatedSensorData(15);
    setSensorData(data);
    
    setPhase('processing');
    setProgress(70);
    
    await new Promise(r => setTimeout(r, 1000));
    const fft = performFFT([
      { x: data.accelerometer.x, y: data.accelerometer.y, z: data.accelerometer.z },
      { x: data.accelerometer.x * 0.9, y: data.accelerometer.y * 1.1, z: data.accelerometer.z },
      { x: data.accelerometer.x * 1.1, y: data.accelerometer.y * 0.95, z: data.accelerometer.z * 1.02 },
    ]);
    setFftResult(fft);
    setProgress(85);
    
    await new Promise(r => setTimeout(r, 800));
    const energy = calculateEnergy(data);
    setEnergyCalc(energy);
    setProgress(95);
    
    await new Promise(r => setTimeout(r, 600));
    const verif = verifyReading(data, fft, 2, { users: 8, readings: 23 });
    setVerification(verif);
    setProgress(100);
    
    setPhase('complete');
    
    toast({
      title: "Submitted to Network",
      description: "Your scan data has been sent to the UrbanPulse network.",
    });
  }, [toast]);

  const resetScan = () => {
    setPhase('idle');
    setProgress(0);
    setSensorData(null);
    setFftResult(null);
    setEnergyCalc(null);
    setVerification(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">UrbanPulse</span>
          </div>

          <span className="text-xs text-muted-foreground">Citizen</span>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          {phase === 'idle' && (
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Energy Scanner</h1>
              <p className="text-sm text-muted-foreground mb-10 max-w-sm">
                Place your phone on any surface to detect harvestable vibration energy.
              </p>
              
              <button
                onClick={startScan}
                className="relative group"
              >
                <div className="w-40 h-40 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-all group-hover:scale-105 active:scale-95">
                  <div className="w-36 h-36 rounded-full bg-card border border-border flex flex-col items-center justify-center">
                    <Zap className="w-10 h-10 text-primary mb-2" />
                    <span className="text-sm font-medium text-foreground">START SCAN</span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {(phase === 'connecting' || phase === 'scanning' || phase === 'processing') && (
            <div className="text-center w-full max-w-sm">
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    className="transition-all duration-300"
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-foreground">{Math.round(progress)}%</span>
                  <span className="text-xs text-muted-foreground capitalize">{phase}</span>
                </div>
              </div>

              {phase === 'scanning' && (
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                  <p className="text-xs text-muted-foreground mb-3">Live Accelerometer</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-mono font-medium text-foreground">{liveAccel.x.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">X</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono font-medium text-foreground">{liveAccel.y.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Y</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono font-medium text-foreground">{liveAccel.z.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Z</div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {phase === 'connecting' && 'Initializing sensors...'}
                {phase === 'scanning' && 'Capturing data. Hold steady...'}
                {phase === 'processing' && 'Analyzing with ML...'}
              </p>
            </div>
          )}

          {phase === 'complete' && sensorData && energyCalc && fftResult && (
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-energy-useful/10 text-energy-useful text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Energy Detected</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Kinetic Energy</p>
                      <p className="text-lg font-semibold text-foreground">{energyCalc.kineticEnergy.toFixed(3)} J</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{fftResult.dominantFrequency.toFixed(1)} Hz</span>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-energy-thermal/10 flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-energy-thermal" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Thermal Energy</p>
                      <p className="text-lg font-semibold text-foreground">{energyCalc.thermalEnergy.toFixed(3)} J</p>
                    </div>
                    <span className="text-xs text-muted-foreground">ΔT {sensorData.thermal.delta.toFixed(1)}°C</span>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-primary/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-energy-useful/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-energy-useful" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Useful Energy</p>
                      <p className="text-lg font-semibold text-energy-useful">{energyCalc.usefulEnergy.toFixed(3)} J</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{energyCalc.efficiency}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={resetScan} className="w-full">
                  Scan Again
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserPortal;
