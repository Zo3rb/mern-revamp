import { Layout } from "antd";

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      &copy; {new Date().getFullYear()} MERN Revamp
    </Footer>
  );
}

export default AppFooter;
