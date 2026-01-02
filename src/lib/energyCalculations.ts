import { SensorData, EnergyCalculation, FFTResult, VerificationResult } from '@/types/energy';

// Physics constants
const PIEZO_EFFICIENCY = 0.15; // 15% conversion efficiency
const THERMAL_COEFFICIENT = 0.04; // 4% thermal conversion
const HUMAN_MASS = 70; // Average human mass in kg

/**
 * Calculate RMS magnitude from accelerometer data
 */
export function calculateRMS(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Simulate FFT analysis on accelerometer data
 * Returns dominant frequency and harmonic classification
 */
export function performFFT(accelerometerData: { x: number; y: number; z: number }[]): FFTResult {
  // Simulate FFT - in production, this would use actual FFT algorithm
  const magnitudes = accelerometerData.map(d => calculateRMS(d.x, d.y, d.z));
  const avgMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  
  // Simulate frequency detection (infrastructure vibrations typically 5-25 Hz)
  const dominantFrequency = 8 + Math.random() * 15;
  
  // Harmonic check - infrastructure has consistent patterns
  const variance = magnitudes.reduce((sum, m) => sum + Math.pow(m - avgMagnitude, 2), 0) / magnitudes.length;
  const isHarmonic = variance < avgMagnitude * 0.3; // Low variance = harmonic
  
  const confidence = isHarmonic ? 0.7 + Math.random() * 0.25 : 0.2 + Math.random() * 0.3;
  
  return {
    dominantFrequency,
    isHarmonic,
    confidence,
    spectrum: Array.from({ length: 50 }, (_, i) => {
      const freq = i + 1;
      const peak = Math.abs(freq - dominantFrequency) < 3 ? avgMagnitude * (1 - Math.abs(freq - dominantFrequency) / 5) : 0;
      return peak + Math.random() * 0.1;
    }),
  };
}

/**
 * Calculate kinetic energy from accelerometer data
 * E_kinetic = 0.5 * m * v^2 (approximated from acceleration)
 */
export function calculateKineticEnergy(rms: number, duration: number): number {
  // Convert acceleration to velocity estimate (integration approximation)
  const velocity = rms * duration * 0.01; // Simplified model
  const kineticEnergy = 0.5 * HUMAN_MASS * velocity * velocity;
  return Math.round(kineticEnergy * 1000) / 1000; // Joules
}

/**
 * Calculate thermal energy from temperature delta
 * E_thermal = m * c * ΔT (simplified for phone battery approximation)
 */
export function calculateThermalEnergy(tempDelta: number, duration: number): number {
  // Phone battery has ~50g mass, specific heat ~0.9 J/g°C
  const batteryMass = 50; // grams
  const specificHeat = 0.9;
  const thermalEnergy = batteryMass * specificHeat * Math.abs(tempDelta);
  return Math.round(thermalEnergy * 100) / 100; // Joules
}

/**
 * Calculate useful harvestable energy
 * Useful = Kinetic - Thermal losses
 */
export function calculateUsefulEnergy(kinetic: number, thermal: number): number {
  const useful = kinetic * PIEZO_EFFICIENCY - thermal * THERMAL_COEFFICIENT;
  return Math.max(0, Math.round(useful * 1000) / 1000);
}

/**
 * Full energy calculation pipeline
 */
export function calculateEnergy(sensorData: SensorData): EnergyCalculation {
  const kineticEnergy = calculateKineticEnergy(sensorData.accelerometer.rms, sensorData.duration);
  const thermalEnergy = calculateThermalEnergy(sensorData.thermal.delta, sensorData.duration);
  const usefulEnergy = calculateUsefulEnergy(kineticEnergy, thermalEnergy);
  
  const efficiency = kineticEnergy > 0 ? (usefulEnergy / kineticEnergy) * 100 : 0;
  
  return {
    kineticEnergy,
    thermalEnergy,
    usefulEnergy,
    efficiency: Math.round(efficiency * 10) / 10,
  };
}

/**
 * Four-layer verification system
 */
export function verifyReading(
  sensorData: SensorData,
  fftResult: FFTResult,
  speed: number = 0,
  gridHistory: { users: number; readings: number } = { users: 0, readings: 0 }
): VerificationResult {
  // Layer 1: Physics Gate
  const RMS_THRESHOLD = 0.5;
  const rmsCheck = sensorData.accelerometer.rms >= RMS_THRESHOLD;
  const fftCheck = fftResult.isHarmonic && fftResult.confidence > 0.5;
  const physicsGatePassed = rmsCheck && fftCheck;
  
  // Layer 2: Context Gate
  const MIN_DURATION = 10; // seconds
  const MAX_SPEED = 15; // km/h
  const durationCheck = sensorData.duration >= MIN_DURATION;
  const speedCheck = speed <= MAX_SPEED;
  const contextGatePassed = durationCheck && speedCheck;
  
  // Layer 3: Social Gate
  const MIN_UNIQUE_USERS = 3;
  const socialGatePassed = gridHistory.users >= MIN_UNIQUE_USERS;
  
  // Calculate overall confidence
  let confidence = 0;
  if (physicsGatePassed) confidence += 35;
  if (contextGatePassed) confidence += 25;
  if (socialGatePassed) confidence += 30;
  confidence += fftResult.confidence * 10;
  
  // Bonus for high grid frequency
  if (gridHistory.readings > 10) confidence += 5;
  
  return {
    physicsGate: {
      passed: physicsGatePassed,
      rmsCheck,
      fftCheck,
      dominantFreq: fftResult.dominantFrequency,
    },
    contextGate: {
      passed: contextGatePassed,
      durationCheck,
      speedCheck,
      duration: sensorData.duration,
    },
    socialGate: {
      passed: socialGatePassed,
      gridFrequency: gridHistory.readings,
      uniqueUsers: gridHistory.users,
    },
    overallConfidence: Math.min(99, Math.round(confidence)),
  };
}

/**
 * Generate simulated sensor data for demo
 */
export function generateSimulatedSensorData(duration: number): SensorData {
  const baseX = 0.3 + Math.random() * 0.7;
  const baseY = 0.2 + Math.random() * 0.5;
  const baseZ = 9.8 + Math.random() * 0.3; // Gravity + vibration
  
  const x = baseX + (Math.random() - 0.5) * 0.2;
  const y = baseY + (Math.random() - 0.5) * 0.2;
  const z = baseZ + (Math.random() - 0.5) * 0.1;
  
  const rms = calculateRMS(x, y, z);
  
  const baseTemp = 25 + Math.random() * 10;
  const currentTemp = baseTemp + 2 + Math.random() * 5;
  
  return {
    accelerometer: { x, y, z, rms },
    thermal: {
      temperature: currentTemp,
      baseline: baseTemp,
      delta: currentTemp - baseTemp,
    },
    timestamp: Date.now(),
    duration,
  };
}
