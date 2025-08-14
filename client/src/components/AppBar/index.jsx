import { useContext } from "react";
import { Layout, Button, Skeleton } from "antd";
import { HomeTwoTone, LoginOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router";

import { AppContext } from "../../context/AppContext";

const { Header } = Layout;

function AppBar() {
  const { user, loading } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Left: App Icon and Name */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <HomeTwoTone
          style={{ fontSize: 24, color: "#1677ff", marginRight: 12 }}
          onClick={() => navigate("/")}
        />
        <span style={{ fontWeight: 600, fontSize: 20 }}>MERN Revamp</span>
      </div>
      {/* Right: Skeleton or Login/Profile */}
      <div>
        {loading ? (
          <Skeleton.Button active style={{ width: 100 }} />
        ) : user ? (
          <Button icon={<UserOutlined />} type="primary">
            Profile
          </Button>
        ) : (
          <Button
            icon={<LoginOutlined />}
            type="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </div>
    </Header>
  );
}

export default AppBar;
