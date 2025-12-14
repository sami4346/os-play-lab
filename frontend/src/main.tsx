import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";
import "./styles/responsive.css";

// Note: Web Vitals tracking can be added by installing the web-vitals package:
// npm install web-vitals
// Then uncomment the code below to enable performance monitoring in development

createRoot(document.getElementById("root")!).render(<App />);
