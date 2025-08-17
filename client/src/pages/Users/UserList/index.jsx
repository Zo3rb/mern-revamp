import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Select,
  Typography,
  Row,
  Col,
  Card,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "all",
    isVerified: "all",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.username) params.username = filters.username;
      if (filters.email) params.email = filters.email;
      if (filters.role && filters.role !== "all") params.role = filters.role;
      if (filters.isVerified && filters.isVerified !== "all")
        params.isVerified =
          filters.isVerified === "verified" ? "true" : "false";
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await axios.get("/api/users", {
        params,
        withCredentials: true,
      });
      setUsers(res.data.data.users);
      setPagination({
        total: res.data.data.total,
        page: res.data.data.page,
        pages: res.data.data.pages,
        limit: res.data.data.limit,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch users. Please try again."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [filters]);

  // Table columns
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <img
            src={avatar}
            alt="avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <UserOutlined style={{ fontSize: 24 }} />
        ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/users/${record.id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin" ? "red" : role === "moderator" ? "blue" : "green"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) =>
        isVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="orange">Not Verified</Tag>
        ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  // Filter UI
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        Users
      </Title>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Username"
              value={filters.username}
              onChange={(e) =>
                setFilters((f) => ({ ...f, username: e.target.value, page: 1 }))
              }
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Email"
              value={filters.email}
              onChange={(e) =>
                setFilters((f) => ({ ...f, email: e.target.value, page: 1 }))
              }
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Role"
              value={filters.role}
              onChange={(value) =>
                setFilters((f) => ({ ...f, role: value, page: 1 }))
              }
              style={{ width: "100%" }}
            >
              <Option value="all">All</Option>
              <Option value="admin">Admin</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="user">User</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Verified"
              value={filters.isVerified}
              onChange={(value) =>
                setFilters((f) => ({ ...f, isVerified: value, page: 1 }))
              }
              style={{ width: "100%" }}
            >
              <Option value="all">All</Option>
              <Option value="verified">Verified</Option>
              <Option value="not verified">Not Verified</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              onClick={fetchUsers}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Card>
      <Table
        columns={columns}
        dataSource={users.map((u) => ({ ...u, key: u._id }))}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page) => setFilters((f) => ({ ...f, page })),
        }}
        onRow={(record) => ({
          onClick: () => navigate(`/users/${record._id}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

export default UsersList;
