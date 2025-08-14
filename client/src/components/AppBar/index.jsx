import { Layout } from "antd";

const { Header } = Layout;

function AppBar() {
  return (
    <Header style={{ background: "#fff", padding: 0 }}>
      <h2 style={{ margin: 0 }}>MERN Revamp</h2>
    </Header>
  );
}

export default AppBar;
