import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Switch, Popconfirm, message, Tag, Select } from "antd";
import {
  getVaccineTypes,
  createVaccineType,
  updateVaccineType,
  deleteVaccineTypes,
  getDeletedVaccineTypes,
  restoreVaccineTypes,
  toggleVaccineTypeStatus,
} from "@/services/vaccineManagerApi";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const defaultVaccineType = {
  code: "",
  name: "",
  group: "",
  recommendedAgeMonths: null,
  minIntervalDays: null,
  isActive: true,
};

const VaccineTypeTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });
  // Thêm state để lọc theo trạng thái
  const [isActiveFilter, setIsActiveFilter] = useState(null); // null: tất cả, true: đang kích hoạt, false: không kích hoạt

  // --- Fetch data ---
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const params2 = {
        isActive: isActiveFilter, // Thêm tham số lọc vào request
      };
      const res = showDeleted
        ? await getDeletedVaccineTypes()
        : await getVaccineTypes({
            ...params2,
            pageNumber: params.current || pagination.current,
            pageSize: params.pageSize || pagination.pageSize,
          });
      setPagination((prev) => ({
        ...prev,
        current: params.current || prev.current,
        pageSize: params.pageSize || prev.pageSize,
      }));
      setData(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được danh sách loại vaccine");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [showDeleted, isActiveFilter]); // Cập nhật useEffect để lắng nghe thay đổi của isActiveFilter

  // --- Modal ---
  const openModal = (record = null) => {
    setEditing(record);
    form.setFieldsValue(record ? { ...record } : { ...defaultVaccineType });
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // Không cho sửa code và name khi edit
        await updateVaccineType(editing.id, { ...editing, ...values, code: editing.code, name: editing.name });
        message.success("Cập nhật thành công!");
      } else {
        await createVaccineType(values);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  // --- Xóa nhiều ---
  const handleDelete = async () => {
    if (!selectedRowKeys.length) return;
    try {
      await deleteVaccineTypes(selectedRowKeys, true);
      message.success("Đã xoá!");
      setSelectedRowKeys([]);
      fetchData();
    } catch {
      message.error("Xoá thất bại! Có thể loại vaccine đã được sử dụng.");
    }
  };

  // --- Phục hồi nhiều ---
  const handleRestore = async () => {
    if (!selectedRowKeys.length) return;
    try {
      await restoreVaccineTypes(selectedRowKeys);
      message.success("Đã phục hồi!");
      setSelectedRowKeys([]);
      fetchData();
    } catch {
      message.error("Phục hồi thất bại!");
    }
  };

  // --- Toggle status ---
  const handleToggleStatus = async (record) => {
    try {
      await toggleVaccineTypeStatus(record.id);
      message.success("Đổi trạng thái thành công!");
      fetchData();
    } catch {
      message.error("Lỗi đổi trạng thái!");
    }
  };
  const handleTableChange = (newPagination) => {
    fetchData({ current: newPagination.current, pageSize: newPagination.pageSize });
  };
  // --- Table columns ---
  const navigate = useNavigate();
  const columns = [
    { title: "Mã", dataIndex: "code" },
    { title: "Tên", dataIndex: "name" },
    { title: "Nhóm", dataIndex: "group" },
    { title: "Tuổi khuyến nghị (tháng)", dataIndex: "recommendedAgeMonths" },
    { title: "Khoảng cách tiêm (ngày)", dataIndex: "minIntervalDays" },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      render: (v, r) => <Switch checked={v} onChange={() => handleToggleStatus(r)} disabled={showDeleted} />,
    },
    {
      title: "Thao tác",
      render: (record, r) => (
        <Space>
          <Button
            onClick={() => {
              navigate(`/admin/manage-vaccineType/${record.id}`);
              console.log("tét");
            }}
          >
            Chi tiết
          </Button>
          {!showDeleted && (
            <Popconfirm
              title="Xoá loại vaccine này? Nếu đang có lô vaccine sử dụng sẽ không xóa được."
              onConfirm={() => deleteVaccineTypes([r.id], false).then(fetchData)}
            >
              <Button danger type="link">
                Xoá
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
        <Space>
          <Button type="primary" onClick={() => openModal()}>
            Thêm loại vaccine
          </Button>
          <Button onClick={() => setShowDeleted((v) => !v)} type={showDeleted ? "primary" : "default"}>
            {showDeleted ? "Xem danh sách" : "Xem đã xoá"}
          </Button>
          {!showDeleted ? (
            <Popconfirm
              title="Xoá các loại vaccine đã chọn? Nếu đang có lô vaccine sử dụng sẽ không xóa được."
              disabled={!selectedRowKeys.length}
              onConfirm={handleDelete}
            >
              <Button danger disabled={!selectedRowKeys.length}>
                Xoá nhiều
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Khôi phục các loại vaccine đã chọn?"
              disabled={!selectedRowKeys.length}
              onConfirm={handleRestore}
            >
              <Button type="primary" disabled={!selectedRowKeys.length}>
                Phục hồi
              </Button>
            </Popconfirm>
          )}
        </Space>
        {/* Thêm bộ lọc trạng thái */}
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => setIsActiveFilter(value)}
        >
          <Option value={true}>Đang kích hoạt</Option>
          <Option value={false}>Không kích hoạt</Option>
        </Select>
      </Space>
      <Table
        rowKey="id"
        dataSource={data}
        loading={loading}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Chi tiết loại vaccine" : "Thêm mới loại vaccine"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        destroyOnClose
        okText={editing ? "Cập nhật" : "Thêm mới"}
      >
        <Form form={form} layout="vertical" initialValues={defaultVaccineType}>
          <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="group" label="Nhóm">
            <Input />
          </Form.Item>
          <Form.Item name="recommendedAgeMonths" label="Tuổi khuyến nghị (tháng)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="minIntervalDays" label="Khoảng cách tiêm (ngày)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {!editing && (
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default VaccineTypeTab;
