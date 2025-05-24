import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Route, Router } from "wouter";

// Add FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, faHistory, faCamera, faMapMarkedAlt, faUser, faBell,
  faTimes, faImage, faArrowLeft, faPlus, faReceipt, faCheck,
  faFilter, faLocationArrow, faDirections, faMotorcycle, 
  faMapMarkerAlt, faClock, faLeaf, faBottleWater, faMinus,
  faRobot, faCommentAlt, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
  faHome, faHistory, faCamera, faMapMarkedAlt, faUser, faBell,
  faTimes, faImage, faArrowLeft, faPlus, faReceipt, faCheck,
  faFilter, faLocationArrow, faDirections, faMotorcycle, 
  faMapMarkerAlt, faClock, faLeaf, faBottleWater, faMinus,
  faRobot, faCommentAlt, faPaperPlane
);

// Create a location base with empty path (useful for static deployments)
const locationBase = "";

createRoot(document.getElementById("root")!).render(
  <Router base={locationBase}>
    <App />
  </Router>
);
