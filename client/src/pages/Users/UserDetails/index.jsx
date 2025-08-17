import React, { useEffect, useState, useContext } from "react";
import { Card, Typography, Avatar, Tag, Button, Space, Spin } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";

const { Title, Paragraph, Text } = Typography;

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!id || id === "undefined") {
        navigate("/users", { replace: true });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch user details."
        );
        navigate("/users");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, navigate]);

  // Handle delete user
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      toast.success("User deleted successfully.");
      navigate("/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  // Handle update user
  const handleUpdate = () => {
    navigate(`/users/${id}/edit`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!id || id === "undefined") return null;
  if (!user) return null;

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        textAlign: "center",
        borderRadius: 8,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
      variant="outlined"
    >
      <Avatar
        size={80}
        src={user.avatar ? user.avatar : null}
        icon={<UserOutlined />}
        style={{ marginBottom: 16 }}
      />
      <Title level={3}>{user.username}</Title>
      <Paragraph>
        <Text strong>Email:</Text> {user.email}
      </Paragraph>
      <Paragraph>
        <Text strong>Role:</Text>{" "}
        <Tag
          color={
            user.role === "admin"
              ? "red"
              : user.role === "moderator"
              ? "blue"
              : "green"
          }
        >
          {user.role}
        </Tag>
      </Paragraph>
      <Paragraph>
        <Text strong>Status:</Text>{" "}
        {user.isVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="orange">Not Verified</Tag>
        )}
      </Paragraph>
      <Paragraph>
        <Text strong>Bio:</Text> {user.bio || "No bio provided."}
      </Paragraph>
      <Paragraph>
        <Text strong>Joined:</Text>{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown"}
      </Paragraph>
      <Space style={{ marginTop: 16 }}>
        {currentUser?.role === "admin" && (
          <>
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Space>
    </Card>
  );
}

export default UserDetails;
