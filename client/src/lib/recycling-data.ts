// Default data for the application

import { RecyclingCenter } from "./types";

export const wasteCategories = [
  {
    id: 1,
    name: "Plastic - PET (Type 1)",
    description: "Polyethylene terephthalate. Common in water bottles, soda bottles, and food containers.",
    recyclable: 1,
    reusable: 1,
    disposalInstructions: "Rinse, remove cap, crush if possible, place in recycling bin."
  },
  {
    id: 2,
    name: "Plastic - HDPE (Type 2)",
    description: "High-density polyethylene. Found in milk jugs, detergent bottles, and toys.",
    recyclable: 1,
    reusable: 1,
    disposalInstructions: "Rinse, remove cap, place in recycling bin."
  },
  {
    id: 3,
    name: "Paper/Cardboard",
    description: "Includes newspapers, magazines, office paper, cardboard boxes.",
    recyclable: 1,
    reusable: 1,
    disposalInstructions: "Flatten cardboard, keep dry, remove non-paper attachments."
  },
  {
    id: 4,
    name: "Metal - Aluminum",
    description: "Used for cans, foil, and some packaging.",
    recyclable: 1,
    reusable: 0,
    disposalInstructions: "Rinse, crush if possible, place in recycling bin."
  },
  {
    id: 5,
    name: "Glass",
    description: "Bottles and jars of various colors.",
    recyclable: 1,
    reusable: 1,
    disposalInstructions: "Rinse, remove caps and lids, place in recycling bin."
  },
  {
    id: 6,
    name: "E-Waste",
    description: "Electronic devices, batteries, and accessories.",
    recyclable: 1,
    reusable: 0,
    disposalInstructions: "Take to designated e-waste collection points. Do not place in regular recycling."
  }
];

export const recyclingCenters: RecyclingCenter[] = [
  {
    id: 1,
    name: "Green Earth Recycling",
    address: "123 Eco Street, Green City",
    latitude: -6.2088,
    longitude: 106.8456,
    openingHours: "8AM - 6PM",
    acceptedMaterials: ["Plastic", "Paper", "Metal"],
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    distance: 2.3
  },
  {
    id: 2,
    name: "EcoSmart Recycling",
    address: "456 Nature Avenue, Green City",
    latitude: -6.2145,
    longitude: 106.8642,
    openingHours: "9AM - 5PM",
    acceptedMaterials: ["Plastic", "Paper", "Glass", "Electronics"],
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    distance: 3.8
  },
  {
    id: 3,
    name: "TechRecycle Center",
    address: "789 Circuit Road, Green City",
    latitude: -6.1985,
    longitude: 106.8312,
    openingHours: "10AM - 7PM",
    acceptedMaterials: ["Electronics", "Batteries", "Metals"],
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9",
    distance: 5.1
  }
];

export const recyclingTips = [
  "Recycling one aluminum can saves enough energy to run a TV for three hours.",
  "The average person generates over 4 pounds of trash every day.",
  "Plastic bags can take 500-1,000 years to degrade in a landfill.",
  "Glass can be recycled indefinitely without losing quality or purity.",
  "Making recycled paper uses 65% less energy than making new paper.",
  "Recycling one ton of plastic saves the equivalent of 1,000–2,000 gallons of gasoline.",
  "A modern glass bottle would take 4,000 years or more to decompose.",
  "Recycling helps reduce the pollution caused by waste.",
  "Americans throw away 25 billion styrofoam coffee cups every year.",
  "The energy saved by recycling one plastic bottle can power a computer for 25 minutes.",
  "70% less energy is required to recycle paper compared with making it from raw materials."
];

// Default dates for pickup options
export function getPickupDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return [
    {
      label: "Today",
      value: today.toISOString().split('T')[0],
      display: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    {
      label: "Tomorrow",
      value: tomorrow.toISOString().split('T')[0],
      display: tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    {
      label: "Custom",
      value: dayAfterTomorrow.toISOString().split('T')[0],
      display: "Select"
    }
  ];
}

export const pickupTimeSlots = [
  {
    label: "Morning",
    value: "morning",
    display: "9AM - 12PM"
  },
  {
    label: "Afternoon",
    value: "afternoon",
    display: "1PM - 5PM"
  },
  {
    label: "Evening",
    value: "evening",
    display: "6PM - 9PM"
  }
];
