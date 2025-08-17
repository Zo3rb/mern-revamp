import { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { AppContext } from "../../../context/AppContext";

const { Title } = Typography;

const validateEmail = (_, value) => {
  if (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return Promise.reject("Email is invalid");
  }
  return Promise.resolve();
};

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users/forgot-password", values);
      toast.success(
        res.data?.message ||
          "Password reset instructions have been sent to your email."
      );
      // Redirect to reset-password and pass email via state
      navigate("/reset-password", { state: { email: values.email } });
    } catch (err) {
      toast.error(
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
