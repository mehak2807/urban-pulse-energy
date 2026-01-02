import { HotspotData } from '@/types/energy';

// Delhi hotspot locations with simulated energy data
export const delhiHotspots: HotspotData[] = [
  {
    id: 'hs-001',
    location: {
      lat: 28.6328,
      lng: 77.2197,
      name: 'Rajiv Chowk Metro Station',
      area: 'Connaught Place',
    },
    metrics: {
      totalUsers: 127,
      averageEnergy: 2.45,
      confidence: 94,
      suitabilityScore: 89,
    },
    readings: [],
    geminiInsight: 'High-frequency 12Hz vibrations detected from metro trains. Excellent candidate for piezoelectric floor tiles. Estimated 450 kWh/month harvestable energy with 40 sqm installation.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-002',
    location: {
      lat: 28.5562,
      lng: 77.1000,
      name: 'IGI Airport Terminal 3',
      area: 'Aerocity',
    },
    metrics: {
      totalUsers: 89,
      averageEnergy: 3.12,
      confidence: 91,
      suitabilityScore: 92,
    },
    readings: [],
    geminiInsight: 'Consistent foot traffic patterns with 15Hz dominant frequency. Premium location for energy harvesting tiles. ROI estimated at 3.2 years with current energy prices.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-003',
    location: {
      lat: 28.6542,
      lng: 77.2373,
      name: 'Chandni Chowk',
      area: 'Old Delhi',
    },
    metrics: {
      totalUsers: 203,
      averageEnergy: 1.87,
      confidence: 88,
      suitabilityScore: 76,
    },
    readings: [],
    geminiInsight: 'Variable vibration patterns due to mixed traffic. Suitable for hybrid thermal-kinetic harvesting. Recommend pilot installation near main market crossing.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-004',
    location: {
      lat: 28.6280,
      lng: 77.0688,
      name: 'DND Flyway',
      area: 'Noida Border',
    },
    metrics: {
      totalUsers: 67,
      averageEnergy: 4.56,
      confidence: 96,
      suitabilityScore: 95,
    },
    readings: [],
    geminiInsight: 'Heavy vehicle traffic creating sustained 8-10Hz infrastructure vibrations. Highest energy density in the network. Priority location for piezoelectric bridge sensors.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-005',
    location: {
      lat: 28.5921,
      lng: 77.2200,
      name: 'Select Citywalk Mall',
      area: 'Saket',
    },
    metrics: {
      totalUsers: 156,
      averageEnergy: 2.89,
      confidence: 92,
      suitabilityScore: 88,
    },
    readings: [],
    geminiInsight: 'HVAC systems generating consistent thermal signatures. Combined foot traffic creates ideal conditions for multi-source harvesting. 320 kWh/month potential.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-006',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      name: 'India Gate',
      area: 'Central Delhi',
    },
    metrics: {
      totalUsers: 312,
      averageEnergy: 1.23,
      confidence: 85,
      suitabilityScore: 71,
    },
    readings: [],
    geminiInsight: 'Tourist foot traffic peaks in evening hours. Lower energy density but high symbolic value for green initiative demonstration. Suitable for awareness installation.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-007',
    location: {
      lat: 28.6692,
      lng: 77.4538,
      name: 'Akshardham Temple',
      area: 'East Delhi',
    },
    metrics: {
      totalUsers: 178,
      averageEnergy: 2.01,
      confidence: 89,
      suitabilityScore: 82,
    },
    readings: [],
    geminiInsight: 'Religious gathering patterns create periodic high-density energy windows. Water features add thermal harvesting potential. Cultural sensitivity required in implementation.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-008',
    location: {
      lat: 28.6419,
      lng: 77.0878,
      name: 'Dwarka Sector 21 Metro',
      area: 'Dwarka',
    },
    metrics: {
      totalUsers: 94,
      averageEnergy: 2.67,
      confidence: 93,
      suitabilityScore: 87,
    },
    readings: [],
    geminiInsight: 'Metro interchange station with consistent 14Hz vibration pattern. Office commuter traffic creates predictable energy curves. Excellent pilot project location.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-009',
    location: {
      lat: 28.5274,
      lng: 77.2191,
      name: 'Nehru Place',
      area: 'South Delhi',
    },
    metrics: {
      totalUsers: 145,
      averageEnergy: 1.94,
      confidence: 86,
      suitabilityScore: 79,
    },
    readings: [],
    geminiInsight: 'IT market foot traffic concentrated during business hours. Electronics waste heat adds thermal harvesting opportunity. Mixed-use installation recommended.',
    lastUpdated: new Date(),
  },
  {
    id: 'hs-010',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      name: 'Rohini Sector 3',
      area: 'North Delhi',
    },
    metrics: {
      totalUsers: 56,
      averageEnergy: 1.45,
      confidence: 78,
      suitabilityScore: 65,
    },
    readings: [],
    geminiInsight: 'Residential area with moderate foot traffic. Lower priority but suitable for community-scale demonstration project. Focus on public parks and markets.',
    lastUpdated: new Date(),
  },
];

// Get hotspot by ID
export function getHotspotById(id: string): HotspotData | undefined {
  return delhiHotspots.find(h => h.id === id);
}

// Get all hotspots sorted by suitability
export function getHotspotsBySuitability(): HotspotData[] {
  return [...delhiHotspots].sort((a, b) => b.metrics.suitabilityScore - a.metrics.suitabilityScore);
}

// Calculate total network statistics
export function getNetworkStats() {
  const totalUsers = delhiHotspots.reduce((sum, h) => sum + h.metrics.totalUsers, 0);
  const totalEnergy = delhiHotspots.reduce((sum, h) => sum + h.metrics.averageEnergy * h.metrics.totalUsers, 0);
  const avgConfidence = delhiHotspots.reduce((sum, h) => sum + h.metrics.confidence, 0) / delhiHotspots.length;
  
  return {
    totalHotspots: delhiHotspots.length,
    totalUsers,
    totalEnergy: Math.round(totalEnergy * 100) / 100,
    averageConfidence: Math.round(avgConfidence),
  };
}
