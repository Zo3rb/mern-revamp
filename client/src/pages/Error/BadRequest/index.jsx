import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router";

function BadRequest() {
  const navigate = useNavigate();
  return (
    <Result
      status="error"
      title="400"
      subTitle="Bad request. Please check your input and try again."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
}

export default BadRequest;
