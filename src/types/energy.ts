export interface SensorData {
  accelerometer: {
    x: number;
    y: number;
    z: number;
    rms: number;
  };
  thermal: {
    temperature: number;
    baseline: number;
    delta: number;
  };
  timestamp: number;
  duration: number;
}

export interface EnergyCalculation {
  kineticEnergy: number;
  thermalEnergy: number;
  usefulEnergy: number;
  efficiency: number;
}

export interface FFTResult {
  dominantFrequency: number;
  isHarmonic: boolean;
  confidence: number;
  spectrum: number[];
}

export interface VerificationResult {
  physicsGate: {
    passed: boolean;
    rmsCheck: boolean;
    fftCheck: boolean;
    dominantFreq: number;
  };
  contextGate: {
    passed: boolean;
    durationCheck: boolean;
    speedCheck: boolean;
    duration: number;
  };
  socialGate: {
    passed: boolean;
    gridFrequency: number;
    uniqueUsers: number;
  };
  overallConfidence: number;
}

export interface HotspotData {
  id: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    area: string;
  };
  metrics: {
    totalUsers: number;
    averageEnergy: number;
    confidence: number;
    suitabilityScore: number;
  };
  readings: ScanReading[];
  geminiInsight?: string;
  lastUpdated: Date;
}

export interface ScanReading {
  id: string;
  userId: string;
  timestamp: Date;
  sensorData: SensorData;
  energy: EnergyCalculation;
  verification: VerificationResult;
}

export interface UserProfile {
  id: string;
  role: 'user' | 'official';
  scansCompleted: number;
  totalEnergyDiscovered: number;
}

export interface GeminiAnalysis {
  suitabilityScore: number;
  recommendation: string;
  harvestingMethod: string;
  estimatedYield: string;
  confidence: number;
}
