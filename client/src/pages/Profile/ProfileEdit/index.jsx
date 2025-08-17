import React, { useState } from "react";
import { Form, Input, Button, Typography, Upload, Avatar } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title } = Typography;

function ProfileEdit() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy initial values
  const initialValues = {
    username: "Guest",
    email: "guest@example.com",
  };

  const onFinish = async (values) => {
    setLoading(true);
    // TODO: Send PATCH request to /api/users/me
    setLoading(false);
    navigate("/profile");
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
          <Upload
            name="avatar"
            listType="picture"
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Form.Item>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
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
          <Input />
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
