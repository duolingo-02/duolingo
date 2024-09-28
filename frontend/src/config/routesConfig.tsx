// // ==============================
// // Import Statements
// // ==============================

// Import game-related components
import Lobby from "../components/games/LobbyLanguage";
import Play from "../components/games/Play";
import StageListWrapper from "../components/games/StageListWrapper";
import MultipleChoiceQuiz from "../components/games/MultipleChoiceQuiz"; // Fixed import statement

// Import page components
// import AchievementsPage from "../pages/achievements/Achievements";
// import AdminDashboard from "../pages/admin/AdminDashboard";
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/signup";
import Home from "../pages/index";
// import Terme from "../pages/home/Termes";
// import UserProfile from "../pages/profile/UserProfile";
import HeroWelcome from "../pages/welcome";


// Import type definitions
import { RouteConfig } from "../types/RouteConfig";

// // ==============================
// // Route Configuration
// // ==============================

// /**
//  * Defines the application's routing structure.
//  * Each route includes its path, the component to render,
//  * and various configuration flags for access control and layout.
//  */
export const ROUTES: RouteConfig[] = [
  {
    path: "/",
    component: <HeroWelcome />,
    isProtected: false,
    withNavbar: false,
    // Landing page without navigation bar
  },
  {
    path: "/login",
    component: <Login />,
    isProtected: false,
    withNavbar: false,
    // User login page without navigation bar
  },
  {
    path: "/register",
    component: <SignUp />,
    isProtected: false,
    withNavbar: false,
    // User registration page without navigation bar
  },
  // {
  //   path: "/home",
  //   component: <Home />,
  //   isProtected: true,
  //   withNavbar: true,
  //   // Main dashboard accessible after user authentication
  // },
  // {
  //   path: "/terms",
  //   component: <Terme />,
  //   isProtected: false,
  //   withNavbar: false,
  //   // Terms and Conditions without navigation bar
  // },
  // {
  //   path: "/admin-dashboard",
  //   component: <AdminDashboard />,
  //   isProtected: true,
  //   forAdmin: true,
  //   withNavbar: true,
  //   // Administrative dashboard restricted to admin users
  // // },
  // {
  //   path: "/profile",
  //   component: <UserProfile />,
  //   isProtected: true,
  //   withNavbar: true,
  //   // User profile page for managing personal information
  // },
  // {
  //   path: "/achievements",
  //   component: <AchievementsPage />,
  //   isProtected: true,
  //   withNavbar: true,
  //   // Page displaying user achievements and milestones
  // },
  {
    path: "/lobby",
    component: <Lobby />,
    isProtected: true,
    withNavbar: true,
    // Game lobby for selecting and initiating games
  },
  {
    path: "/language/:languageId/stages",
    component: <StageListWrapper />,
    isProtected: true,
    withNavbar: true,
    useGameLayout: true,
    // Lists all stages for a specific language selection
  },
  {
    path: "/language/:languageId/stages/:stageId/play",
    component: <Play />,
    isProtected: true,
    withNavbar: true,
    useGameLayout: true,
    // Interface for playing a specific stage within a language
  },
  {
    path: "/language/:languageId/stages",
    component: <StageListWrapper />,
    isProtected: true,
    withNavbar: true,
    useGameLayout: true,
  },
 
];