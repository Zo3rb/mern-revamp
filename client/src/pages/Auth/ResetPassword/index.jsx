import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

import { AppContext } from "../../../context/AppContext";

const { Title } = Typography;

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && user.isVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  // Get email from router state
  const email = location.state?.email || "";

  const onFinish = async (values) => {
    setLoading(true);
    setServerError("");
    setSuccess("");
    try {
      await axios.post("/api/users/reset-password", {
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      toast.success("Password has been reset successfully.");
      setSuccess("Password has been reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Reset failed. Please try again."
      );
      setServerError(
        err.response?.data?.message || "Reset failed. Please try again."
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
        Reset Password
      </Title>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ email }}>
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
          <Input placeholder="Enter OTP" maxLength={6} />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter new password"
          />
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: 16 }}>{success}</div>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;
