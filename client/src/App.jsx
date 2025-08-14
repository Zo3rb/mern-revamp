import { RouterProvider, createBrowserRouter } from "react-router";
import { Layout } from "antd";
import AppBar from "./components/AppBar";
import AppFooter from "./components/Footer";

// Import your pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppBar />
      <Layout.Content style={{ padding: "24px" }}>
        <RouterProvider router={router} />
      </Layout.Content>
      <AppFooter />
    </Layout>
  );
}

export default App;
