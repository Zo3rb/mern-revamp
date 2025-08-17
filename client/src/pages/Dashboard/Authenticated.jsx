import { Typography, Card, Avatar, Button, Space } from "antd";
import { UserOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const { Title, Paragraph, Text } = Typography;

function Authenticated() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "2rem",
      }}
    >
      <Card
        style={{ maxWidth: 400, width: "100%", textAlign: "center" }}
        variant="outlined"
      >
        <Avatar
          size={80}
          src={user?.avatar ? user.avatar : null}
          icon={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Title level={3}>
          Welcome, {user?.username}{" "}
          {user?.isVerified && (
            <CheckCircleFilled style={{ color: "#52c41a", fontSize: 24 }} />
          )}
        </Title>
        <Paragraph>
          <Text strong>Email:</Text> {user?.email}
        </Paragraph>
        <Paragraph>
          <Text strong>Role:</Text> {user?.role}
        </Paragraph>
        <Paragraph>
          <Text strong>Member since:</Text>{" "}
          {new Date(user?.createdAt).toLocaleDateString()}
        </Paragraph>
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate("/profile")}>
            View Profile
          </Button>
          <Button onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </Button>
        </Space>
      </Card>
      <Paragraph style={{ fontSize: 18, maxWidth: 500 }}>
        You are authenticated! Explore your dashboard, manage your profile, and
        enjoy all features.
      </Paragraph>
    </div>
  );
}

export default Authenticated;
