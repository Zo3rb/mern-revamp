import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";
import ServerError from "./pages/Error/ServerError";

import { AppContextProvider } from "./context/AppContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary FallbackComponent={ServerError}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ErrorBoundary>
);
