import React, { useContext, useEffect } from "react";
import { Card, Typography, Avatar, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { AppContext } from "../../../context/AppContext";

const { Title, Paragraph, Text } = Typography;

function ProfileView() {
  const { user } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Card
      style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}
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
        <Text strong>Bio:</Text> {user.bio || "No bio provided."}
      </Paragraph>

      <Paragraph>{user.email}</Paragraph>
      <Paragraph>
        Status:{" "}
        <span style={{ color: user.isVerified ? "green" : "red" }}>
          {user.isVerified ? "Verified" : "Not Verified"}
        </span>
      </Paragraph>
      <Paragraph>
        <Text strong>Member since:</Text>{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown"}
      </Paragraph>
      <Space>
        <Button type="primary" onClick={() => navigate("/profile/edit")}>
          Edit Profile
        </Button>
        {!user.isVerified && (
          <Button onClick={() => navigate("/verify-email")}>
            Verify Your Account
          </Button>
        )}
      </Space>
    </Card>
  );
}

export default ProfileView;
