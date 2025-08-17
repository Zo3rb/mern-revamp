import { useContext } from "react";
import { Layout, Button, Skeleton, Space } from "antd";
import {
  HomeTwoTone,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

const { Header } = Layout;

function AppBar() {
  const { user, loading, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
      console.log(err.message);
    }
  };

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
      {/* Right: Skeleton or Login/Profile/Logout */}
      <div>
        {loading ? (
          <Skeleton.Button active style={{ width: 100 }} />
        ) : user ? (
          <Space>
            <Button
              icon={<UserOutlined />}
              type="primary"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
              Logout
            </Button>
          </Space>
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
