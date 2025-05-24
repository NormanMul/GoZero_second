import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Scanner from "@/pages/scanner";
import Result from "@/pages/result";
import Pickup from "@/pages/pickup";
import PickupConfirmation from "@/pages/pickup-confirmation";
import Map from "@/pages/map";
import { useState, useEffect } from "react";

// Mock current user for demo purposes
const DEMO_USER_ID = 1;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/result/:scanId?" component={Result} />
      <Route path="/pickup/:scanId?" component={Pickup} />
      <Route path="/pickup-confirmation/:pickupId?" component={PickupConfirmation} />
      <Route path="/map" component={Map} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [currentUserId, setCurrentUserId] = useState<number>(DEMO_USER_ID);
  
  // Set userId in localStorage for persistence
  useEffect(() => {
    localStorage.setItem('currentUserId', currentUserId.toString());
  }, [currentUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
