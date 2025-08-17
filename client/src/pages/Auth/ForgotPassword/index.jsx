import { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router";

const { Title } = Typography;

const validateEmail = (_, value) => {
  if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return Promise.reject("Email is invalid");
  }
  return Promise.resolve();
};

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setServerError("");
    setSuccess("");
    try {
      await axios.post("/api/users/forgot-password", values);
      setSuccess("Password reset instructions have been sent to your email.");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Request failed. Please try again."
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
        Forgot Password
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ validator: validateEmail }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: 16 }}>{success}</div>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span>
          Remembered your password? <Link to="/login">Log in here</Link>
        </span>
      </div>
    </div>
  );
}

export default ForgotPassword;
