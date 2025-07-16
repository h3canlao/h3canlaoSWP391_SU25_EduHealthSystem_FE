import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, Popconfirm, message, Space, Tag } from "antd";
import dayjs from "dayjs";
import {
  getCheckupCampaigns,
  createCheckupCampaign,
  updateCheckupCampaign,
  deleteCheckupCampaigns,
  getDeletedCheckupCampaigns,
  restoreCheckupCampaigns,
  updateStatusCheckupCampaigns,
  startCheckupCampaign, // Import các hàm mới
  completeCheckupCampaign,
  cancelCheckupCampaign,
} from "@/services/checkupCampaignApi";
import { useNavigate } from "react-router-dom";

// Cập nhật statusOptions để phù hợp với enum mới
const statusOptions = [
  { value: 0, label: "Đang lên kế hoạch", color: "default" },
  { value: 1, label: "Đã lên lịch", color: "cyan" },
  { value: 2, label: "Đang thực hiện", color: "blue" },
  { value: 3, label: "Đã hoàn thành", color: "green" },
  { value: 4, label: "Đã hủy", color: "red" },
];

const defaultForm = {
  name: "",
  schoolYear: "",
  description: "",
  startDate: null,
  endDate: null,
};

const CheckupCampaignAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterType, setFilterType] = useState("all"); // all, deleted

  // Load Campaigns
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      let res;
      if (filterType === "deleted") {
        res = await getDeletedCheckupCampaigns({
          pageNumber: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
        });
      } else {
        res = await getCheckupCampaigns({
          pageNumber: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
          status: params.status !== undefined ? params.status : statusFilter,
        });
      }
      setData(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res.data.totalRecords || 100,
      }));
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Không tải được dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData({ current: 1, searchTerm, status: statusFilter });
    setPagination((prev) => ({ ...prev, current: 1 }));
    // eslint-disable-next-line
  }, [filterType, statusFilter, searchTerm]);

  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Hàm xử lý hành động (start, complete, cancel)
  const handleStatusAction = async (id, actionType) => {
    try {
      if (actionType === "start") {
        await startCheckupCampaign(id);
        message.success("Chiến dịch đã được bắt đầu!");
      } else if (actionType === "complete") {
        await completeCheckupCampaign(id);
        message.success("Chiến dịch đã hoàn thành!");
      } else if (actionType === "cancel") {
        await cancelCheckupCampaign(id);
        message.success("Chiến dịch đã bị hủy!");
      }
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  // Table columns
  const columns = [
    { title: "Tên chiến dịch", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const option = statusOptions.find((s) => s.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/admin/manage-checkupCampaign/${record.id}`)}>
            Chi tiết
          </Button>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xác nhận xóa chiến dịch này?" onConfirm={() => handleDelete([record.id])}>
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Pagination
  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({
      current: pag.current,
      pageSize: pag.pageSize,
      searchTerm,
      status: statusFilter,
    });
  };

  // Modal handlers
  const openModal = (record = null) => {
    setEditing(record ? record.id : null);
    if (record) {
      form.setFieldsValue({
        ...record,
        startDate: record.startDate ? dayjs(record.startDate) : null,
        endDate: record.endDate ? dayjs(record.endDate) : null,
      });
    } else {
      form.setFieldsValue(defaultForm);
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };
      if (editing) {
        await updateCheckupCampaign(editing, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createCheckupCampaign(payload);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (ids) => {
    try {
      await deleteCheckupCampaigns(ids);
      message.success("Xóa thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  const handleRestore = async () => {
    if (!selectedRowKeys.length) {
      message.warning("Hãy chọn chiến dịch cần khôi phục");
      return;
    }
    try {
      await restoreCheckupCampaigns(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Khôi phục thất bại!");
    }
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setFilterType("all");
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSetFilterType = (type) => {
    if (filterType === type) {
      setFilterType("all");
    } else {
      setFilterType(type);
      setSearchTerm("");
      setStatusFilter(undefined);
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 16 }}>
        <>
          <Input
            placeholder="Tìm kiếm tên chiến dịch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => setPagination((prev) => ({ ...prev, current: 1 }))}
            style={{ width: 200 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={statusOptions}
          />
          <Button type="primary" onClick={handleClearFilter}>
            Xóa lọc
          </Button>
        </>
        <Button type={filterType === "deleted" ? "primary" : "default"} onClick={() => handleSetFilterType("deleted")}>
          Xem chiến dịch đã xóa
        </Button>
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới chiến dịch
        </Button>
        {filterType === "deleted" && (
          <Button onClick={handleRestore} disabled={!selectedRowKeys.length} type="primary">
            Khôi phục đã chọn
          </Button>
        )}
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={filterType === "deleted" ? { selectedRowKeys, onChange: setSelectedRowKeys } : undefined}
        onChange={handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Cập nhật chiến dịch" : "Thêm mới chiến dịch"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={defaultForm}>
          <Form.Item name="name" label="Tên chiến dịch" rules={[{ required: true, message: "Nhập tên chiến dịch" }]}>
            <Input disabled={editing} />
          </Form.Item>
          <Form.Item name="schoolYear" label="Năm học" rules={[{ required: true, message: "Nhập năm học" }]}>
            <Input placeholder="VD: 2024-2025" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CheckupCampaignAdmin;
