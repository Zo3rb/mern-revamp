import { RouterProvider, createBrowserRouter } from "react-router";
import { Layout } from "antd";

import MainLayout from "./components/Layout";

// Import your pages
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import BadRequest from "./pages/Error/BadRequest";
import ServerError from "./pages/Error/ServerError";
import ProfileView from "./pages/Profile/ProfileView";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import UsersList from "./pages/Users/UserList";
import UserDetails from "./pages/Users/UserDetails";
import UserEdit from "./pages/Users/UserEdit";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "profile", element: <ProfileView /> },
      { path: "profile/edit", element: <ProfileEdit /> },
      { path: "users", element: <UsersList /> },
      { path: "users/:id", element: <UserDetails /> },
      { path: "users/:id/edit", element: <UserEdit /> },
      { path: "400", element: <BadRequest /> },
      { path: "500", element: <ServerError /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
