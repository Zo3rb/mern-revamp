import { Typography, Button } from "antd";
import { CodeSandboxCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title, Paragraph } = Typography;

function NotAuthenticated() {
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
      <CodeSandboxCircleFilled style={{ fontSize: 80, color: "#1677ff" }} />
      <Title level={1}>Welcome to MERN Revamp</Title>
      <Paragraph style={{ fontSize: 18, maxWidth: 500 }}>
        Supercharge your productivity with our AI-powered MERN stack
        application. Seamless authentication, modern UI, and smart features for
        developers and teams.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/register")}
        style={{ marginTop: "0.5rem" }}
      >
        Get Started
      </Button>
    </div>
  );
}

export default NotAuthenticated;
