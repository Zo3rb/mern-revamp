import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Avatar,
  Space,
  Spin,
} from "antd";
import { UserOutlined, UploadOutlined, MailOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";

const { Title } = Typography;
const { Option } = Select;

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Protect route: only admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      toast.error("Unauthorized: Only admins can edit users.");
      navigate("/users");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data.data);
        setAvatarPreview(res.data.data.avatar || null);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch user details."
        );
        navigate("/users");
      }
      setLoading(false);
    };
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const initialValues = user
    ? {
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        bio: user.bio,
      }
    : {};

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
      formData.append("role", values.role);
      formData.append("isVerified", values.isVerified);
      formData.append("bio", values.bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      await axios.patch(`/api/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("User updated successfully!");
      navigate(`/users/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    }
    setLoading(false);
  };

  if (loading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

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
        Edit User
      </Title>
      <Form
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        key={user.id}
      >
        <Form.Item label="Avatar">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Avatar
              size={64}
              src={avatarPreview || null}
              icon={<UserOutlined />}
            />
            <Input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />
            <Button
              icon={<UploadOutlined />}
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              Upload Avatar
            </Button>
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
          label="Role"
          name="role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="moderator">Moderator</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Verified"
          name="isVerified"
          rules={[
            { required: true, message: "Verification status is required" },
          ]}
        >
          <Select>
            <Option value={true}>Verified</Option>
            <Option value={false}>Not Verified</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} maxLength={500} placeholder="User bio..." />
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

export default UserEdit;
