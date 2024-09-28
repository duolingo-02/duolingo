// ==============================
// Import Statements
// ==============================

// React and ReactDOM for rendering components
import ReactDOM from "react-dom/client";

// Redux for state management
import { Provider } from "react-redux";

// React Router for client-side routing
import { BrowserRouter as Router } from "react-router-dom";

// (Optional) Helmet for managing document head
// import { HelmetProvider, Helmet } from 'react-helmet-async';

// Application-specific imports
import App from "./App"; // Main App component
import { store } from "./redux/store/store"; // Redux store instance

// Global styles
import "./index.css"; // Import global CSS

// ==============================
// Initialize Root Element
// ==============================

/**
 * Initializes the root element for rendering the React application.
 * It targets the HTML element with the ID 'root' and prepares it for React rendering.
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// ==============================
// Render Application
// ==============================

/**
 * Renders the React application into the root element.
 * The application is wrapped with Redux Provider for state management
 * and React Router's Router for handling client-side routing.
 *
 * Uncomment the HelmetProvider and Helmet components if you intend to manage the document head.
 */
root.render(
  <Provider store={store}>
    <Router>
      {/* 
        <HelmetProvider>
          <Helmet>
            <title>Your App Title</title>
            <meta name="description" content="Your app description." />
            <!-- Add more head elements as needed -->
          </Helmet>
          <App />
        </HelmetProvider>
      */}
      <App />
    </Router>
  </Provider>
);


