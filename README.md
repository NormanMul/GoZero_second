# GoZero

**Demo:** [https://gozero.veeda.space](https://gozero.veeda.space)

## Overview

GoZero is a waste management application that helps users properly dispose of waste items, track their environmental impact, and locate recycling centers. The application uses AI to categorize waste items and provide disposal instructions, promoting sustainable waste management practices.

## Features

- **AI-Powered Waste Scanning**: Upload images of waste items to receive AI-based categorization
- **Disposal Instructions**: Get detailed instructions on how to properly dispose of different waste types
- **Environmental Impact Tracking**: Monitor your personal environmental impact score
- **Recycling Center Locator**: Find nearby recycling centers
- **Waste Pickup Service**: Schedule pickups for certain waste types
- **Interactive Chatbot**: Get answers to waste disposal questions
- **Comprehensive Disposal Guides**: Access guides for different types of waste materials

## Technical Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL
- **Image Processing**: Client-side image compression

## Database Structure

The application uses a PostgreSQL database with 5 main tables:

1. `users` - Stores user information including impact scores
2. `waste_categories` - Categorizes waste types with disposal instructions
3. `scans` - Records of waste items scanned by users
4. `recycling_centers` - Information about recycling locations
5. `pickups` - Scheduled waste pickups

## Implementation Notes

- Client-side image compression reduces image resolution to 480px width with JPEG quality of 0.7
- Express server configured with increased payload limits (50MB) to handle image uploads
- Database initially used JSON/JSONB fields that were later changed to TEXT to avoid compatibility issues

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- NPM or Yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up the database using the migration scripts in `/server/migrations`
4. Start the development servers:
   ```bash
   # Start the client
   cd client && npm start
   
   # Start the server
   cd ../server && npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
