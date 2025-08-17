import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router";

const { Title } = Typography;

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setServerError("");
    setSuccess("");
    try {
      await axios.post("/api/users/verify-otp", values);
      setSuccess("Your email has been verified!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        Verify Email
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            {
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Email is invalid",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="OTP"
          name="otp"
          rules={[
            { required: true, message: "OTP is required" },
            { len: 6, message: "OTP must be 6 digits" },
          ]}
        >
          <Input placeholder="Enter OTP" />
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: 16 }}>{success}</div>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Verify Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default VerifyEmail;
