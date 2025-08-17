import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button, Typography, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const { Title, Paragraph } = Typography;

function VerifyEmail() {
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // Redirect guest user to "/"
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Timer for resend button
  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  // Handle OTP input change
  const handleOtpChange = (value, idx) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Focus next input
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
    // Focus previous input on backspace
    if (!value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      // Focus last input
      inputsRef.current[5]?.focus();
    }
  };

  // Submit OTP
  const onFinish = async () => {
    if (otp.some((digit) => digit === "")) {
      setServerError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setServerError("");
    setSuccess("");
    try {
      await axios.post("/api/users/verify-otp", {
        email: user.email,
        otp: otp.join(""),
      });
      const { data } = await axios.get("/api/users/me");
      setUser(data.data);
      toast.success("Your email has been verified!");
      setSuccess("Your email has been verified!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Verification failed. Please try again."
      );
      setServerError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    setResendDisabled(true);
    try {
      await axios.post("/api/users/resend-otp", { email: user.email });
      toast.success("OTP has been resent to your email.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
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
      <Paragraph style={{ textAlign: "center" }}>
        Enter the 6-digit OTP sent to <b>{user?.email}</b>
      </Paragraph>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                style={{
                  width: 40,
                  height: 40,
                  fontSize: 24,
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </Form.Item>
        {serverError && (
          <div style={{ color: "red", marginBottom: 16 }}>{serverError}</div>
        )}
        {success && (
          <div style={{ color: "green", marginBottom: 16 }}>{success}</div>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={otp.some((digit) => digit === "")}
          >
            Verify Email
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Button type="link" disabled={resendDisabled} onClick={handleResend}>
          Resend OTP
        </Button>
        {resendDisabled && (
          <span style={{ color: "#888" }}>
            {" "}
            ({Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")})
          </span>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
