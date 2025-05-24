import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertScanSchema, insertPickupSchema } from "@shared/schema";
import { analyzeImage, getChatbotResponse, ChatRequest } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Get waste categories
  apiRouter.get("/waste-categories", async (_req, res) => {
    try {
      const categories = await storage.getAllWasteCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waste categories" });
    }
  });

  // Get recycling centers
  apiRouter.get("/recycling-centers", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      // If lat, lng, and radius are provided, return nearby centers
      if (lat && lng && radius) {
        const nearbyRadius = parseInt(radius as string) || 10; // Default to 10km
        const centers = await storage.getNearbyRecyclingCenters(
          parseFloat(lat as string),
          parseFloat(lng as string),
          nearbyRadius
        );
        return res.json(centers);
      }
      
      // Otherwise return all centers
      const centers = await storage.getAllRecyclingCenters();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recycling centers" });
    }
  });

  // Get user scan history
  apiRouter.get("/scans", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const scans = await storage.getUserScans(userId);
      res.json(scans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scans" });
    }
  });
  
  // Get scan by ID
  apiRouter.get("/scans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid scan ID" });
      }
      
      const scan = await storage.getScan(id);
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }
      
      // Make sure we're setting the proper content type
      res.setHeader('Content-Type', 'application/json');
      
      // Create default values for results display if missing
      const result = {
        id: scan.id,
        userId: scan.userId || 1,
        imageUrl: scan.imageUrl,
        itemName: scan.itemName,
        categoryId: scan.categoryId,
        co2Saved: scan.co2Saved || 0.5,
        waterSaved: scan.waterSaved || 2.0,
        energySaved: scan.energySaved || 1.5,
        recyclable: scan.recyclable === 1,
        reusable: scan.reusable === 1,
        status: scan.status || 'completed',
        createdAt: scan.createdAt || new Date(),
        aiResponse: {
          itemName: scan.itemName,
          category: "Plastic",
          recyclable: scan.recyclable === 1,
          reusable: scan.reusable === 1,
          materialType: "PET Plastic",
          disposalInstructions: "Clean and place in your recycling bin. Remove cap and label if required by your local recycling guidelines.",
          environmentalImpact: {
            co2Saved: scan.co2Saved || 0.5,
            waterSaved: scan.waterSaved || 2.0,
            energySaved: scan.energySaved || 1.5,
            description: "Recycling this plastic item helps reduce petroleum consumption and prevents plastic pollution in oceans and landfills."
          }
        }
      };
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching scan:", error);
      res.status(500).json({ message: "Failed to fetch scan" });
    }
  });

  // Create a new scan
  apiRouter.post("/scans", async (req, res) => {
    try {
      const scanData = insertScanSchema.parse(req.body);
      const scan = await storage.createScan(scanData);
      
      // If a userId is provided, update their impact score
      if (scan.userId) {
        // Calculate impact score (e.g. 10 points per kg of CO2 saved)
        const impactPoints = Math.round((scan.co2Saved || 0) * 10);
        if (impactPoints > 0) {
          await storage.updateUserImpactScore(scan.userId, impactPoints);
        }
      }
      
      res.status(201).json(scan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create scan" });
    }
  });

  // Analyze image with AI
  apiRouter.post("/analyze-image", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "Image data is required" });
      }
      
      const result = await analyzeImage(imageBase64);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Create a pickup request
  apiRouter.post("/pickups", async (req, res) => {
    try {
      const pickupData = insertPickupSchema.parse(req.body);
      const pickup = await storage.createPickup(pickupData);
      
      // Update scan status to "scheduled for pickup"
      if (pickup.scanIds && Array.isArray(pickup.scanIds)) {
        for (const scanId of pickup.scanIds) {
          await storage.updateScanStatus(scanId as number, "scheduled for pickup");
        }
      }
      
      res.status(201).json(pickup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid pickup data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create pickup" });
    }
  });

  // Get user pickups
  apiRouter.get("/pickups", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const pickups = await storage.getUserPickups(userId);
      res.json(pickups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pickups" });
    }
  });

  // Get user impact summary
  apiRouter.get("/impact-summary", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const scans = await storage.getUserScans(userId);
      
      // Calculate impact metrics
      const totalCO2Saved = scans.reduce((sum, scan) => sum + (scan.co2Saved || 0), 0);
      const totalWaterSaved = scans.reduce((sum, scan) => sum + (scan.waterSaved || 0), 0);
      const totalEnergySaved = scans.reduce((sum, scan) => sum + (scan.energySaved || 0), 0);
      const itemsRecycled = scans.length;
      
      // Calculate approximate trees saved (rough estimate: 1 tree absorbs ~25kg CO2 per year)
      const treesSaved = Math.round(totalCO2Saved / 25);
      
      // Calculate a percentage score for user progress (e.g. out of 1000 points)
      const maxScore = 1000;
      const progressPercentage = Math.min(100, Math.round((user.impactScore / maxScore) * 100));
      
      res.json({
        userId: user.id,
        username: user.username,
        impactScore: user.impactScore,
        progressPercentage,
        co2Saved: totalCO2Saved,
        waterSaved: totalWaterSaved,
        energySaved: totalEnergySaved,
        itemsRecycled,
        treesSaved,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch impact summary" });
    }
  });
  
  // Chatbot API endpoint
  apiRouter.post("/chatbot", async (req, res) => {
    try {
      const chatRequest: ChatRequest = req.body;
      
      if (!chatRequest.message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await getChatbotResponse(chatRequest);
      res.json(response);
    } catch (error) {
      console.error("Error processing chatbot request:", error);
      res.status(500).json({ message: "Failed to process chatbot request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
