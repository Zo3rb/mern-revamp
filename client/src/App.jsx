import { useState, useEffect } from "react";
import { DatePicker } from "antd";

function App() {
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((data) => setApiResponse(data))
      .catch((err) => setApiResponse({ success: false, message: err.message }));
  }, []);

  console.log(apiResponse);
  return (
    <div style={{ padding: "2rem" }}>
      <DatePicker />
      <h1>React + Vite Home Page</h1>
      <h2>API Test</h2>
      {apiResponse ? (
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      ) : (
        <p>Loading API response...</p>
      )}
    </div>
  );
}

export default App;
