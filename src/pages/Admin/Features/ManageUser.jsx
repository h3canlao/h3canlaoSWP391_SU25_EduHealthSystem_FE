import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
  Card,
  Typography,
  Tag,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const BASE_URL = "https://localhost:7096/api";

// Các service functions sử dụng API thực tế dựa trên các hình ảnh đã được cung cấp
const userServices = {
  getUsers: async (params) => {
    return axios.get(`${BASE_URL}/User`, { params });
  },
  updateUser: async (id, data) => {
    return axios.patch(`${BASE_URL}/User/${id}`, data);
  },
  deleteUsers: async (ids) => {
    return axios.delete(`${BASE_URL}/User/bulk`, { data: { ids } });
  },
  lockUser: async (id) => {
    return axios.put(`${BASE_URL}/User/lock`, null, { params: { id } });
  },
  unlockUser: async (id) => {
    return axios.put(`${BASE_URL}/User/unlock`, null, { params: { id } });
  },
  createUser: async (data) => {
    // Giả định API POST /api/User để tạo người dùng
    return axios.post(`${BASE_URL}/User`, data);
  },
};

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const usersRes = await userServices.getUsers({
        pageNumber: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: searchTerm,
        roleId: roleFilter,
      });

      const userList = usersRes.data.data || [];
      setData(userList);

      const uniqueRoles = [...new Set(userList.flatMap((user) => user.roles))];
      setRoles(uniqueRoles);

      const counts = {};
      userList.forEach((user) => {
        user.roles.forEach((role) => {
          counts[role] = (counts[role] || 0) + 1;
        });
      });
      setRoleCounts(counts);

      setPagination((prev) => ({
        ...prev,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: 100,
      }));
    } catch (err) {
      message.error(err?.response?.data?.message || "Không tải được dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ current: 1 });
  }, [searchTerm, roleFilter]);

  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({ current: pag.current, pageSize: pag.pageSize });
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      gender: record.gender,
      phoneNumbers: record.phoneNumbers,
      roles: record.roles,
    });
    setModalVisible(true);
  };

  const handleBulkDelete = async () => {
    try {
      await userServices.deleteUsers(selectedRowKeys);
      message.success("Xóa người dùng thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Xóa thất bại!");
    }
  };

  const handleLockUser = async (id) => {
    try {
      await userServices.lockUser(id);
      message.success("Khóa tài khoản thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Khóa tài khoản thất bại!");
    }
  };

  const handleUnlockUser = async (id) => {
    try {
      await userServices.unlockUser(id);
      message.success("Mở khóa tài khoản thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Mở khóa tài khoản thất bại!");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Chỉ gửi các trường được hỗ trợ bởi API PATCH
        const updatePayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          gender: values.gender,
          phoneNumbers: values.phoneNumbers,
          roles: values.roles,
        };
        await userServices.updateUser(editingUser.id, updatePayload);
        message.success("Cập nhật người dùng thành công!");
      } else {
        await userServices.createUser(values);
        message.success("Tạo người dùng thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => (
        <Space>
          {roles.map((role) => {
            let color = "";
            if (role === "Admin") color = "geekblue";
            if (role === "Parent") color = "green";
            if (role === "SchoolNurse") color = "gold";
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isLocked",
      key: "isLocked",
      render: (isLocked) => <Tag color={isLocked ? "red" : "green"}>{isLocked ? "Đã khóa" : "Hoạt động"}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button> */}
          <Popconfirm
            title={`Xác nhận ${record.isLocked ? "mở khóa" : "khóa"} tài khoản này?`}
            onConfirm={() => (record.isLocked ? handleUnlockUser(record.id) : handleLockUser(record.id))}
            okText={record.isLocked ? "Mở khóa" : "Khóa"}
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger={!record.isLocked}
              icon={record.isLocked ? <UnlockOutlined /> : <LockOutlined />}
            >
              {record.isLocked ? "Mở khóa" : "Khóa"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Quản lý Người dùng</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic title="Quản trị viên" value={roleCounts.Admin || 0} prefix={<UserSwitchOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic title="Phụ huynh" value={roleCounts.Parent || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic title="Y tá học đường" value={roleCounts.SchoolNurse || 0} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card
      // extra={
      //   <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
      //     Thêm mới
      //   </Button>
      // }
      >
        <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Input.Search
            placeholder="Tìm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select placeholder="Lọc theo vai trò" style={{ width: 180 }} allowClear onChange={setRoleFilter}>
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
          {/* <Popconfirm
            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} người dùng đã chọn?`}
            onConfirm={handleBulkDelete}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger disabled={selectedRowKeys.length === 0} icon={<DeleteOutlined />}>
              Xóa đã chọn
            </Button>
          </Popconfirm> */}
        </Space>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          rowSelection={rowSelection}
        />
      </Card>

      <Modal
        title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="Họ" rules={[{ required: true, message: "Vui lòng nhập họ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>
          {/* Trường password chỉ hiển thị khi thêm mới */}
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}>
            <Select placeholder="Chọn giới tính">
              <Option value="Male">Nam</Option>
              <Option value="Female">Nữ</Option>
              <Option value="Other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phoneNumbers" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="roles" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}>
            <Select mode="multiple" placeholder="Chọn vai trò">
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
