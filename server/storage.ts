import { 
  users, User, InsertUser, 
  wasteCategories, WasteCategory, InsertWasteCategory,
  scans, Scan, InsertScan,
  recyclingCenters, RecyclingCenter, InsertRecyclingCenter,
  pickups, Pickup, InsertPickup
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserImpactScore(userId: number, additionalScore: number): Promise<User | undefined>;

  // Waste Category methods
  getWasteCategory(id: number): Promise<WasteCategory | undefined>;
  getWasteCategoryByName(name: string): Promise<WasteCategory | undefined>;
  getAllWasteCategories(): Promise<WasteCategory[]>;
  createWasteCategory(category: InsertWasteCategory): Promise<WasteCategory>;

  // Scan methods
  getScan(id: number): Promise<Scan | undefined>;
  getUserScans(userId: number): Promise<Scan[]>;
  createScan(scan: InsertScan): Promise<Scan>;
  updateScanStatus(scanId: number, status: string): Promise<Scan | undefined>;

  // Recycling Center methods
  getRecyclingCenter(id: number): Promise<RecyclingCenter | undefined>;
  getAllRecyclingCenters(): Promise<RecyclingCenter[]>;
  getNearbyRecyclingCenters(lat: number, lng: number, radius: number): Promise<RecyclingCenter[]>;
  createRecyclingCenter(center: InsertRecyclingCenter): Promise<RecyclingCenter>;

  // Pickup methods
  getPickup(id: number): Promise<Pickup | undefined>;
  getUserPickups(userId: number): Promise<Pickup[]>;
  createPickup(pickup: InsertPickup): Promise<Pickup>;
  updatePickupStatus(pickupId: number, status: string): Promise<Pickup | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wasteCategories: Map<number, WasteCategory>;
  private scans: Map<number, Scan>;
  private recyclingCenters: Map<number, RecyclingCenter>;
  private pickups: Map<number, Pickup>;
  private currentUserId: number;
  private currentWasteCategoryId: number;
  private currentScanId: number;
  private currentRecyclingCenterId: number;
  private currentPickupId: number;

  constructor() {
    this.users = new Map();
    this.wasteCategories = new Map();
    this.scans = new Map();
    this.recyclingCenters = new Map();
    this.pickups = new Map();
    
    this.currentUserId = 1;
    this.currentWasteCategoryId = 1;
    this.currentScanId = 1;
    this.currentRecyclingCenterId = 1;
    this.currentPickupId = 1;

    // Initialize with default data
    this.initDefaultData();
  }

  private initDefaultData() {
    // Add default waste categories
    const defaultCategories: InsertWasteCategory[] = [
      {
        name: "Plastic - PET (Type 1)",
        description: "Polyethylene terephthalate. Common in water bottles, soda bottles, and food containers.",
        recyclable: 1,
        reusable: 1,
        disposalInstructions: "Rinse, remove cap, crush if possible, place in recycling bin."
      },
      {
        name: "Plastic - HDPE (Type 2)",
        description: "High-density polyethylene. Found in milk jugs, detergent bottles, and toys.",
        recyclable: 1,
        reusable: 1,
        disposalInstructions: "Rinse, remove cap, place in recycling bin."
      },
      {
        name: "Paper/Cardboard",
        description: "Includes newspapers, magazines, office paper, cardboard boxes.",
        recyclable: 1,
        reusable: 1,
        disposalInstructions: "Flatten cardboard, keep dry, remove non-paper attachments."
      },
      {
        name: "Metal - Aluminum",
        description: "Used for cans, foil, and some packaging.",
        recyclable: 1,
        reusable: 0,
        disposalInstructions: "Rinse, crush if possible, place in recycling bin."
      },
      {
        name: "Glass",
        description: "Bottles and jars of various colors.",
        recyclable: 1,
        reusable: 1,
        disposalInstructions: "Rinse, remove caps and lids, place in recycling bin."
      },
      {
        name: "E-Waste",
        description: "Electronic devices, batteries, and accessories.",
        recyclable: 1,
        reusable: 0,
        disposalInstructions: "Take to designated e-waste collection points. Do not place in regular recycling."
      }
    ];

    defaultCategories.forEach(category => this.createWasteCategory(category));

    // Add default recycling centers
    const defaultCenters: InsertRecyclingCenter[] = [
      {
        name: "Green Earth Recycling",
        address: "123 Eco Street, Green City",
        latitude: -6.2088,
        longitude: 106.8456,
        openingHours: "8AM - 6PM",
        acceptedMaterials: ["Plastic", "Paper", "Metal"],
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"
      },
      {
        name: "EcoSmart Recycling",
        address: "456 Nature Avenue, Green City",
        latitude: -6.2145,
        longitude: 106.8642,
        openingHours: "9AM - 5PM",
        acceptedMaterials: ["Plastic", "Paper", "Glass", "Electronics"],
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
      },
      {
        name: "TechRecycle Center",
        address: "789 Circuit Road, Green City",
        latitude: -6.1985,
        longitude: 106.8312,
        openingHours: "10AM - 7PM",
        acceptedMaterials: ["Electronics", "Batteries", "Metals"],
        imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9"
      }
    ];

    defaultCenters.forEach(center => this.createRecyclingCenter(center));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      impactScore: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserImpactScore(userId: number, additionalScore: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      impactScore: (user.impactScore || 0) + additionalScore 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Waste Category methods
  async getWasteCategory(id: number): Promise<WasteCategory | undefined> {
    return this.wasteCategories.get(id);
  }

  async getWasteCategoryByName(name: string): Promise<WasteCategory | undefined> {
    return Array.from(this.wasteCategories.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async getAllWasteCategories(): Promise<WasteCategory[]> {
    return Array.from(this.wasteCategories.values());
  }

  async createWasteCategory(insertCategory: InsertWasteCategory): Promise<WasteCategory> {
    const id = this.currentWasteCategoryId++;
    const category: WasteCategory = { ...insertCategory, id };
    this.wasteCategories.set(id, category);
    return category;
  }

  // Scan methods
  async getScan(id: number): Promise<Scan | undefined> {
    return this.scans.get(id);
  }

  async getUserScans(userId: number): Promise<Scan[]> {
    return Array.from(this.scans.values())
      .filter(scan => scan.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const id = this.currentScanId++;
    const scan: Scan = { 
      ...insertScan, 
      id,
      createdAt: new Date()
    };
    this.scans.set(id, scan);
    return scan;
  }

  async updateScanStatus(scanId: number, status: string): Promise<Scan | undefined> {
    const scan = await this.getScan(scanId);
    if (!scan) return undefined;
    
    const updatedScan = { ...scan, status };
    this.scans.set(scanId, updatedScan);
    return updatedScan;
  }

  // Recycling Center methods
  async getRecyclingCenter(id: number): Promise<RecyclingCenter | undefined> {
    return this.recyclingCenters.get(id);
  }

  async getAllRecyclingCenters(): Promise<RecyclingCenter[]> {
    return Array.from(this.recyclingCenters.values());
  }

  async getNearbyRecyclingCenters(lat: number, lng: number, radius: number): Promise<RecyclingCenter[]> {
    // Simple distance calculation (not accounting for Earth's curvature)
    // In a real app, we would use a proper geospatial library
    const centers = Array.from(this.recyclingCenters.values()).map(center => {
      const dLat = center.latitude - lat;
      const dLng = center.longitude - lng;
      // Simplified distance calculation (not accurate for long distances)
      const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // Approx km per degree
      return { ...center, distance };
    });

    return centers
      .filter(center => center.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  async createRecyclingCenter(insertCenter: InsertRecyclingCenter): Promise<RecyclingCenter> {
    const id = this.currentRecyclingCenterId++;
    const center: RecyclingCenter = { ...insertCenter, id, distance: 0 };
    this.recyclingCenters.set(id, center);
    return center;
  }

  // Pickup methods
  async getPickup(id: number): Promise<Pickup | undefined> {
    return this.pickups.get(id);
  }

  async getUserPickups(userId: number): Promise<Pickup[]> {
    return Array.from(this.pickups.values())
      .filter(pickup => pickup.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createPickup(insertPickup: InsertPickup): Promise<Pickup> {
    const id = this.currentPickupId++;
    // Generate a random order code
    const orderCode = `GZ${Math.floor(10000 + Math.random() * 90000)}`;
    
    const pickup: Pickup = { 
      ...insertPickup, 
      id,
      orderCode,
      createdAt: new Date()
    };
    this.pickups.set(id, pickup);
    return pickup;
  }

  async updatePickupStatus(pickupId: number, status: string): Promise<Pickup | undefined> {
    const pickup = await this.getPickup(pickupId);
    if (!pickup) return undefined;
    
    const updatedPickup = { ...pickup, status };
    this.pickups.set(pickupId, updatedPickup);
    return updatedPickup;
  }
}

export const storage = new MemStorage();
