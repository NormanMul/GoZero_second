// Calculate impact values for scanned items
// These are rough estimates for demonstration purposes

export function calculateCO2Saved(itemType: string, weight = 1): number {
  // CO2 savings in kg
  const co2Factors: Record<string, number> = {
    'Plastic': 0.5,
    'PET': 0.5,
    'HDPE': 0.4,
    'Paper': 0.9,
    'Cardboard': 1.2,
    'Metal': 1.8,
    'Aluminum': 2.1,
    'Steel': 1.6,
    'Glass': 0.3,
    'Electronics': 1.5,
    'E-Waste': 1.5,
    'Organic': 0.2
  };
  
  // Find the matching factor or default to 0.1
  const factor = Object.entries(co2Factors).find(([key]) => 
    itemType.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0.1;
  
  return Number((factor * weight).toFixed(1));
}

export function calculateWaterSaved(itemType: string, weight = 1): number {
  // Water savings in liters
  const waterFactors: Record<string, number> = {
    'Plastic': 3,
    'PET': 3,
    'HDPE': 2.5,
    'Paper': 6,
    'Cardboard': 7,
    'Metal': 10,
    'Aluminum': 15,
    'Steel': 8,
    'Glass': 0.5,
    'Electronics': 12,
    'E-Waste': 12,
    'Organic': 1
  };
  
  const factor = Object.entries(waterFactors).find(([key]) => 
    itemType.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 1;
  
  return Number((factor * weight).toFixed(1));
}

export function calculateEnergySaved(itemType: string, weight = 1): number {
  // Energy savings in kWh
  const energyFactors: Record<string, number> = {
    'Plastic': 1.2,
    'PET': 1.2,
    'HDPE': 1.0,
    'Paper': 0.8,
    'Cardboard': 1.0,
    'Metal': 2.5,
    'Aluminum': 3.0,
    'Steel': 2.0,
    'Glass': 0.6,
    'Electronics': 5.0,
    'E-Waste': 5.0,
    'Organic': 0.3
  };
  
  const factor = Object.entries(energyFactors).find(([key]) => 
    itemType.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0.5;
  
  return Number((factor * weight).toFixed(1));
}

export function getImpactFact(itemType: string): string {
  const facts: Record<string, string[]> = {
    'Plastic': [
      'Recycling one plastic bottle saves enough energy to power a 60-watt light bulb for 6 hours.',
      'It takes 500-1000 years for plastic to degrade in a landfill.',
      'Recycling plastic uses 88% less energy than making it from raw materials.'
    ],
    'Paper': [
      'Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 380 gallons of oil.',
      'Paper can be recycled 5-7 times before the fibers become too short to be reused.',
      'Making recycled paper uses 65% less energy than making new paper.'
    ],
    'Metal': [
      'Recycling one aluminum can saves enough energy to run a TV for three hours.',
      'Aluminum can be recycled indefinitely without losing quality.',
      'Recycling aluminum saves 95% of the energy needed to make new aluminum from raw materials.'
    ],
    'Glass': [
      'Glass can be recycled indefinitely without losing quality or purity.',
      'Recycling one glass bottle saves enough energy to light a 100-watt bulb for four hours.',
      'Recycled glass reduces related air pollution by 20% and water pollution by 50%.'
    ],
    'Electronics': [
      'E-waste contains valuable materials like gold, silver, copper, and platinum that can be recovered.',
      'Recycling one million laptops saves the energy equivalent to electricity used by 3,657 homes in a year.',
      'For every million cell phones recycled, 35,000 pounds of copper, 772 pounds of silver, and 75 pounds of gold can be recovered.'
    ],
    'Organic': [
      'Composting organic waste reduces methane emissions from landfills.',
      'Compost improves soil health and reduces the need for chemical fertilizers.',
      'Food waste that goes to landfill produces methane, a greenhouse gas 25 times more potent than CO2.'
    ]
  };
  
  // Find matching facts for the item type
  for (const [key, factList] of Object.entries(facts)) {
    if (itemType.toLowerCase().includes(key.toLowerCase())) {
      return factList[Math.floor(Math.random() * factList.length)];
    }
  }
  
  // Default fact if no match found
  return 'Recycling helps conserve natural resources, reduce waste, and save energy.';
}
