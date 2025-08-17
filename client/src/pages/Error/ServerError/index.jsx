import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router";

function ServerError() {
  const navigate = useNavigate();
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong on our end."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
}

export default ServerError;
