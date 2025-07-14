import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message,
  Space,
  Tag,
  Switch
} from "antd";
import {
  getMedicalSupplies,
  createMedicalSupply,
  updateMedicalSupply,
  deleteMedicalSupplies,
  restoreMedicalSupplies,
  getLowStockMedicalSupplies
} from "@/services/medicalSupplyApi";
import { useNavigate } from "react-router-dom";

const defaultForm = {
  name: "",
  unit: "",
  minimumStock: 1,
  isActive: true,
};

const MedicalSupplyAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState("all"); // all, deleted, lowStock
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyActive, setOnlyActive] = useState(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  // Fetch list
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      if (filterType === "lowStock") {
        // lấy vật tư sắp hết
        const res = await getLowStockMedicalSupplies();
        setData(res.data?.data || []);
        setPagination(prev => ({ ...prev, total: (res.data?.data?.length ?? 0) }));
      } else {
        const res = await getMedicalSupplies({
          pageNumber: params.pageNumber || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
          isActive: filterType === "deleted" ? undefined : onlyActive,
          includeDeleted: filterType === "deleted"
        });
        setData(res.data.data || []);
        setPagination({
          current: params.pageNumber || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          total: res.data.totalRecords || 0,
        });
      }
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Không tải được dữ liệu!");
    }
    setLoading(false);
  };

  // Reload khi filter/search/pagination thay đổi
  useEffect(() => {
    fetchData({ pageNumber: 1 });
    setPagination(prev => ({ ...prev, current: 1 }));
    // eslint-disable-next-line
  }, [filterType, onlyActive, searchTerm]);

  // Table columns
  const columns = [
    { title: "Tên vật tư", dataIndex: "name", key: "name" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    { title: "Tồn kho", dataIndex: "currentStock", key: "currentStock" },
    { title: "Tồn tối thiểu", dataIndex: "minimumStock", key: "minimumStock" },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => val ? <Tag color="green">Đang dùng</Tag> : <Tag color="red">Ngưng</Tag>
    },
    ...(filterType === "deleted"
      ? [{
          title: "Đã xóa",
          dataIndex: "isDeleted",
          key: "isDeleted",
          render: (val) => val ? <Tag color="volcano">Đã xóa</Tag> : <Tag color="green">Chưa xóa</Tag>,
        }]
      : []),
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/admin/manage-medicalSupply/${record.id}`)}
          >
            Chi tiết
          </Button>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
              <Popconfirm title="Xóa vật tư này?" onConfirm={() => handleDelete([record.id])}>
                <Button type="link" danger>Xóa</Button>
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
    fetchData({ pageNumber: pag.current, pageSize: pag.pageSize });
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
      values.isActive = !!values.isActive;
      if (editing) {
        await updateMedicalSupply(editing, values);
        message.success("Cập nhật thành công!");
      } else {
        await createMedicalSupply(values);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Có lỗi xảy ra!");
    }
  };

  // Xóa 1 hoặc nhiều (batch)
  const handleDelete = async (ids) => {
    try {
      await deleteMedicalSupplies(ids, false); // xóa mềm
      message.success("Xóa thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  // Khôi phục (batch)
  const handleRestore = async () => {
    if (!selectedRowKeys.length) return message.warning("Chọn vật tư để khôi phục");
    try {
      await restoreMedicalSupplies(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Khôi phục thất bại!");
    }
  };

  return (
    <div style={{ margin: '0 24px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm tên vật tư"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 120 }}
          value={onlyActive}
          onChange={val => setOnlyActive(val)}
          options={[
            { value: true, label: "Đang dùng" },
            { value: false, label: "Ngưng dùng" },
          ]}
        />
        <Button
          type={filterType === "lowStock" ? "primary" : "default"}
          onClick={() => setFilterType(filterType === "lowStock" ? "all" : "lowStock")}
        >
          Tồn kho thấp
        </Button>
        <Button
          type={filterType === "deleted" ? "primary" : "default"}
          onClick={() => setFilterType(filterType === "deleted" ? "all" : "deleted")}
        >
          Xem đã xóa
        </Button>
        {filterType === "deleted" && (
          <Button onClick={handleRestore} disabled={!selectedRowKeys.length}>
            Khôi phục đã chọn
          </Button>
        )}
        <Button
          type="primary"
          onClick={() => openModal()}
          disabled={filterType === "deleted"}
        >
          Thêm mới
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={filterType === "lowStock" ? false : pagination}
        rowSelection={filterType === "deleted" ? {
          selectedRowKeys,
          onChange: setSelectedRowKeys
        } : undefined}
        onChange={filterType === "lowStock" ? undefined : handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Cập nhật vật tư" : "Thêm mới vật tư"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultForm}
        >
          <Form.Item name="name" label="Tên vật tư" rules={[{ required: true, message: "Nhập tên vật tư" }]} >
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true, message: "Nhập đơn vị" }]} >
            <Input />
          </Form.Item>
          <Form.Item name="minimumStock" label="Tồn tối thiểu" rules={[{ required: true, message: "Nhập tồn tối thiểu" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Đang dùng" unCheckedChildren="Ngưng dùng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalSupplyAdmin;
