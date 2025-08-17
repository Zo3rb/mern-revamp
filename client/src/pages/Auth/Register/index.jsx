import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router";

const { Title } = Typography;

const validateUsername = (_, value) => {
  if (!value || value.trim().length < 3 || value.trim().length > 30) {
    return Promise.reject("Username must be 3-30 characters");
  }
  return Promise.resolve();
};

const validateEmail = (_, value) => {
  if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return Promise.reject("Email is invalid");
  }
  return Promise.resolve();
};

const validatePassword = (_, value) => {
  if (!value || value.length < 6) {
    return Promise.reject("Password must be at least 6 characters");
  }
  return Promise.resolve();
};

const validateConfirmPassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || value === getFieldValue("password")) {
      return Promise.resolve();
    }
    return Promise.reject("Passwords do not match");
  },
});

function Register() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setServerError("");
    try {
      await axios.post("/api/users", values);
      // Handle success (e.g., redirect, show notification)
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please try again."
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
        Register
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ validator: validateUsername }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter username" />
        </Form.Item>
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
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[validateConfirmPassword]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
          />
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span>
          Already have an account? <Link to="/login">Log in here</Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
