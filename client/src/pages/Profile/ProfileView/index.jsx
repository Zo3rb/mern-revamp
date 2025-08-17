import React from "react";
import { Card, Typography, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title, Paragraph } = Typography;

function ProfileView() {
  const navigate = useNavigate();

  // Dummy user data for UI
  const user = {
    username: "Guest",
    email: "guest@example.com",
    avatar: "",
    isVerified: false,
  };

  return (
    <Card
      style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}
      variant="outlined"
    >
      <Avatar
        size={80}
        src={user.avatar || null}
        icon={<UserOutlined />}
        style={{ marginBottom: 16 }}
      />
      <Title level={3}>{user.username}</Title>
      <Paragraph>{user.email}</Paragraph>
      <Paragraph>
        Status:{" "}
        <span style={{ color: user.isVerified ? "green" : "red" }}>
          {user.isVerified ? "Verified" : "Not Verified"}
        </span>
      </Paragraph>
      <Button type="primary" onClick={() => navigate("/profile/edit")}>
        Edit Profile
      </Button>
    </Card>
  );
}

export default ProfileView;
