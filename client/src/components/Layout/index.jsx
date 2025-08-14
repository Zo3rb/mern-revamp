import { Layout } from "antd";
import { Outlet } from "react-router";

import AppBar from "../AppBar";
import AppFooter from "../Footer";

function MainLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppBar />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <AppFooter />
    </Layout>
  );
}

export default MainLayout;
