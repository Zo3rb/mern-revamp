import { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router";

const { Title } = Typography;

const validateEmail = (_, value) => {
  if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return Promise.reject("Email is invalid");
  }
  return Promise.resolve();
};

const validatePassword = (_, value) => {
  if (!value) {
    return Promise.reject("Password is required");
  }
  return Promise.resolve();
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setServerError("");
    try {
      await axios.post("/api/users/login", values);
      // Handle success (e.g., redirect, show notification)
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please try again."
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
        Login
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ validator: validateEmail }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ validator: validatePassword }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter password"
          />
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}

        <span>
          <Link to="/forgot-password">Forgot password?</Link>
        </span>
        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span>
          Don't have an account? <Link to="/register">Register here</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
