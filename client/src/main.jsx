import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";

import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "./pages/Error/ServerError";

import { AppContextProvider } from "./context/AppContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary FallbackComponent={ServerError}>
    <AppContextProvider>
      <ToastContainer position="top-right" />
      <App />
    </AppContextProvider>
  </ErrorBoundary>
);
