import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Typography, Upload, Avatar, Space } from "antd";
import {
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../../context/AppContext";

const { Title } = Typography;

function ProfileEdit() {
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const initialValues = {
    username: user.username,
    email: user.email,
    currentPassword: "",
    newPassword: "",
  };

  const handleAvatarChange = (info) => {
    const fileObj = info.fileList[0]?.originFileObj;
    if (fileObj) {
      setAvatarFile(fileObj);
      setAvatarPreview(URL.createObjectURL(fileObj));
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (values.currentPassword && values.newPassword) {
        formData.append("currentPassword", values.currentPassword);
        formData.append("newPassword", values.newPassword);
      }

      const res = await axios.patch("/api/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setUser(res.data.data);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Title level={3} style={{ textAlign: "center" }}>
        Edit Profile
      </Title>
      <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Form.Item label="Avatar">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              name="avatar"
              listType="picture"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
            <Avatar
              size={64}
              src={avatarPreview || null}
              icon={<UserOutlined />}
            />
          </Space>
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Username is required" },
            { min: 3, max: 30, message: "Username must be 3-30 characters" },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
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
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            {
              validator: (_, value) => {
                // Only require newPassword if currentPassword is entered
                if (value && !value.trim()) {
                  return Promise.reject("Current password is required");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter current password to change password"
          />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          dependencies={["currentPassword"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const currentPassword = getFieldValue("currentPassword");
                if (currentPassword && !value) {
                  return Promise.reject("New password is required");
                }
                if (value && value.length < 6) {
                  return Promise.reject(
                    "Password must be at least 6 characters"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter new password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProfileEdit;
