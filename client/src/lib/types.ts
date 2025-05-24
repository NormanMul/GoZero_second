export interface ImpactSummary {
  userId: number;
  username: string;
  impactScore: number;
  progressPercentage: number;
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  itemsRecycled: number;
  treesSaved: number;
}

export interface Scan {
  id: number;
  userId?: number;
  imageUrl?: string;
  itemName: string;
  categoryId?: number;
  co2Saved?: number;
  waterSaved?: number;
  energySaved?: number;
  recyclable?: number;
  reusable?: number;
  aiResponse?: any;
  status?: string;
  createdAt?: Date;
}

export interface WasteCategory {
  id: number;
  name: string;
  description?: string;
  recyclable?: number;
  reusable?: number;
  disposalInstructions?: string;
}

export interface RecyclingCenter {
  id: number;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  acceptedMaterials?: string[];
  imageUrl?: string;
  distance?: number;
}

export interface Pickup {
  id: number;
  userId?: number;
  scanIds?: number[];
  pickupDate: string;
  pickupTimeSlot: string;
  address: string;
  notes?: string;
  status?: string;
  driverName?: string;
  driverRating?: number;
  orderCode?: string;
  createdAt?: Date;
}

export interface RecognitionResult {
  itemName: string;
  category: string;
  recyclable: boolean;
  reusable: boolean;
  materialType: string;
  disposalInstructions: string;
  environmentalImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
    description: string;
  };
}
