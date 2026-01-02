import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, ArrowLeft, Activity, Thermometer, 
  CheckCircle2, Wifi
} from 'lucide-react';
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

  // Simulate live accelerometer readings
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
    
    // Phase 1: Connecting to sensors
    await new Promise(r => setTimeout(r, 1500));
    setPhase('scanning');
    
    // Phase 2: Scanning (simulated 15 seconds compressed to 4)
    const scanDuration = 4000;
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / scanDuration) * 60, 60);
      setProgress(p);
    }, 100);
    
    await new Promise(r => setTimeout(r, scanDuration));
    clearInterval(progressInterval);
    
    // Generate sensor data
    const data = generateSimulatedSensorData(15);
    setSensorData(data);
    
    setPhase('processing');
    setProgress(70);
    
    // Phase 3: FFT Analysis
    await new Promise(r => setTimeout(r, 1000));
    const fft = performFFT([
      { x: data.accelerometer.x, y: data.accelerometer.y, z: data.accelerometer.z },
      { x: data.accelerometer.x * 0.9, y: data.accelerometer.y * 1.1, z: data.accelerometer.z },
      { x: data.accelerometer.x * 1.1, y: data.accelerometer.y * 0.95, z: data.accelerometer.z * 1.02 },
    ]);
    setFftResult(fft);
    setProgress(85);
    
    // Phase 4: Energy Calculation
    await new Promise(r => setTimeout(r, 800));
    const energy = calculateEnergy(data);
    setEnergyCalc(energy);
    setProgress(95);
    
    // Phase 5: Verification
    await new Promise(r => setTimeout(r, 600));
    const verif = verifyReading(data, fft, 2, { users: 8, readings: 23 });
    setVerification(verif);
    setProgress(100);
    
    setPhase('complete');
    
    // Show toast notification
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
    <div className="min-h-screen bg-background energy-grid relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">
              <span className="text-foreground">Urban</span>
              <span className="text-primary">Pulse</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Citizen Mode</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          {phase === 'idle' && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Energy Scanner</h1>
              <p className="text-muted-foreground mb-12 max-w-md">
                Place your phone on any surface to detect harvestable vibration energy. 
                Hold steady for 15 seconds during scan.
              </p>
              
              <button
                onClick={startScan}
                className="relative group"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-[0_0_60px_hsl(175_84%_50%/0.4)] group-hover:shadow-[0_0_80px_hsl(175_84%_50%/0.6)] transition-all group-hover:scale-105 active:scale-95">
                  <div className="w-44 h-44 rounded-full bg-card flex flex-col items-center justify-center">
                    <Zap className="w-12 h-12 text-primary mb-2" />
                    <span className="text-lg font-bold text-foreground">START SCAN</span>
                  </div>
                </div>
                
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" style={{ animationDelay: '-0.5s' }} />
              </button>
            </div>
          )}

          {(phase === 'connecting' || phase === 'scanning' || phase === 'processing') && (
            <div className="text-center w-full max-w-lg">
              <div className="relative w-48 h-48 mx-auto mb-8">
                {/* Scan animation circle */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * progress) / 100}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--energy-useful))" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{Math.round(progress)}%</span>
                  <span className="text-sm text-muted-foreground capitalize">{phase}</span>
                </div>
              </div>

              {/* Live sensor readings */}
              {phase === 'scanning' && (
                <div className="glass rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Live Accelerometer Data</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-primary">
                        {liveAccel.x.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">X-Axis (m/s²)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-secondary">
                        {liveAccel.y.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">Y-Axis (m/s²)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-accent">
                        {liveAccel.z.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">Z-Axis (m/s²)</div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground">
                {phase === 'connecting' && 'Initializing device sensors...'}
                {phase === 'scanning' && 'Capturing vibration data. Hold steady...'}
                {phase === 'processing' && 'Analyzing frequency spectrum with ML...'}
              </p>
            </div>
          )}

          {phase === 'complete' && sensorData && energyCalc && fftResult && (
            <div className="w-full max-w-lg space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Scan Complete</h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-energy-useful/10 text-energy-useful">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Energy Detected</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Kinetic Energy */}
                <div className="glass rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Kinetic Energy</p>
                      <p className="text-2xl font-bold text-primary">{energyCalc.kineticEnergy.toFixed(3)} J</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      FFT @ {fftResult.dominantFrequency.toFixed(1)} Hz
                    </div>
                  </div>
                </div>

                {/* Thermal Energy */}
                <div className="glass rounded-2xl p-6 border border-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Thermal Energy</p>
                      <p className="text-2xl font-bold text-secondary">{energyCalc.thermalEnergy.toFixed(3)} J</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      ΔT = {sensorData.thermal.delta.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                {/* Useful Energy */}
                <div className="glass rounded-2xl p-6 border border-energy-useful/20 bg-energy-useful/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-energy-useful/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-energy-useful" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Useful Energy</p>
                      <p className="text-2xl font-bold text-energy-useful">{energyCalc.usefulEnergy.toFixed(3)} J</p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {energyCalc.efficiency}% efficient
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Again button */}
              <div className="flex justify-center mt-8">
                <Button variant="energy" onClick={resetScan} className="px-8">
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
