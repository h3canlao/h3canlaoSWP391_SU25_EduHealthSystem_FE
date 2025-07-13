import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Tag } from "antd";
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicationCategories,
  restoreMedications,
} from "@/services/medicationApi";
import { useNavigate } from "react-router-dom";

const defaultForm = {
  name: "",
  unit: "",
  dosageForm: "",
  category: "",
  status: 0,
};

const MedicationAdmin = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterType, setFilterType] = useState("all"); // all, deleted

  // Lấy categories từ API
  const fetchCategories = async () => {
    try {
      const res = await getMedicationCategories();
      setCategories(res.data.data || []);
    } catch {
      message.error("Không lấy được danh mục!");
    }
  };

  // Load Medication List
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      let apiParams = {
        pageNumber: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        category: params.category !== undefined ? params.category : filterCategory,
      };
      if (filterType === "deleted") apiParams.includeDeleted = true;
      else delete apiParams.includeDeleted;

      const res = await getMedications(apiParams);

      setData(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res.data.totalRecords || 100,
      }));
    } catch (err) {
      message.error("Không tải được dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Theo dõi filterType, filterCategory, searchTerm => fetch lại data
  useEffect(() => {
    fetchData({ current: 1, searchTerm, category: filterCategory });
    setPagination((prev) => ({ ...prev, current: 1 }));
    // eslint-disable-next-line
  }, [filterType, filterCategory, searchTerm]);

  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Table columns
  const columns = [
    { title: "Tên thuốc", dataIndex: "name", key: "name" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    { title: "Dạng dùng", dataIndex: "dosageForm", key: "dosageForm" },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (value) => {
        const cat = categories.find((c) => c.value === value);
        return cat ? cat.name : value;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 0 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khóa</Tag>),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/admin/manage-medication/${record.id}`)}>
            Chi tiết
          </Button>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xác nhận xóa thuốc này?" onConfirm={() => handleDelete(record.id, false)}>
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  const handleRestore = async () => {
    if (!selectedRowKeys.length) return message.warning("Chọn thuốc để khôi phục");
    try {
      await restoreMedications(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error("Khôi phục thất bại!");
    }
  };
  // Pagination
  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({
      current: pag.current,
      pageSize: pag.pageSize,
      searchTerm,
      category: filterCategory,
    });
  };

  // Modal handlers
  const openModal = (record = null) => {
    setEditing(record ? record.id : null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.setFieldsValue(defaultForm);
    }
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateMedication(editing, values);
        message.success("Cập nhật thành công!");
      } else {
        await createMedication(values);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (ids, isPermanent = false) => {
    // ids có thể là 1 id hoặc 1 mảng id
    const _ids = Array.isArray(ids) ? ids : [ids];
    try {
      await deleteMedication(_ids, isPermanent);
      message.success(isPermanent ? "Đã xóa vĩnh viễn!" : "Xóa thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(isPermanent ? "Xóa vĩnh viễn thất bại!" : "Xóa thất bại!");
    }
  };

  // Xóa lọc: clear search, category, filterType
  const handleClearFilter = () => {
    setSearchTerm("");
    setFilterCategory(undefined);
    setFilterType("all");
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Chọn chế độ xem hoạt động/đã xóa
  const handleSetFilterType = (type) => {
    if (filterType === type) {
      setFilterType("all");
    } else {
      setFilterType(type);
      setSearchTerm("");
      setFilterCategory(undefined);
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 16 }}>
          <>
            <Input
              placeholder="Tìm kiếm tên thuốc"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => setPagination((prev) => ({ ...prev, current: 1 }))}
              style={{ width: 200 }}
            />
            <Select
              allowClear
              placeholder="Danh mục"
              style={{ width: 180 }}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
              options={categories.map((c) => ({ value: c.value, label: c.name }))}
            />
            <Button type="primary" onClick={handleClearFilter}>
              Xóa lọc
            </Button>
          </>
        <Button type={filterType === "all" ? "primary" : "default"} onClick={() => handleSetFilterType("all")}>
          Xem thuốc hoạt động
        </Button>
        <Button type={filterType === "deleted" ? "primary" : "default"} onClick={() => handleSetFilterType("deleted")}>
          Xem thuốc đã xóa
        </Button>
        <Button type="primary" onClick={() => openModal()} disabled={filterType === "deleted"}>
          Thêm mới thuốc
        </Button>
        {filterType === "deleted" && (
          <Button danger disabled={selectedRowKeys.length === 0} onClick={() => handleDelete(selectedRowKeys, true)}>
            Xóa vĩnh viễn
          </Button>
        )}
        {filterType === "deleted" && (
          <Button onClick={handleRestore} disabled={selectedRowKeys.length === 0} type="primary">
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
        rowSelection={
          filterType === "deleted"
            ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }
            : undefined
        }
        onChange={handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Cập nhật thuốc" : "Thêm mới thuốc"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={defaultForm}>
          <Form.Item name="name" label="Tên thuốc" rules={[{ required: true, message: "Nhập tên thuốc" }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true, message: "Nhập đơn vị" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dosageForm" label="Dạng dùng" rules={[{ required: true, message: "Nhập dạng dùng" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Chọn danh mục" }]}>
            <Select
              options={categories.map((c) => ({ value: c.value, label: c.name }))}
              showSearch
              optionFilterProp="label"
              placeholder="Chọn danh mục"
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: 0, label: "Hoạt động" },
                { value: 1, label: "Khóa" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicationAdmin;
