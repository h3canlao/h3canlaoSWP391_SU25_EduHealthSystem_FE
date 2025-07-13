import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import {
  getMedicalSupplyLots,
  createMedicalSupplyLot,
  updateMedicalSupplyLot,
  deleteMedicalSupplyLots,
  restoreMedicalSupplyLots,
  updateLotQuantity,
  getExpiringLots,
  getExpiredLots,
  getLotsBySupplyId,
  getDeletedLots
} from "@/services/medicalSupplyLotApi";
import { getMedicalSupplies } from "@/services/medicalSupplyApi";

const defaultForm = {
  medicalSupplyId: undefined,
  lotNumber: "",
  expirationDate: null,
  manufactureDate: null,
  quantity: 0,
};

const MedicalSupplyLotAdmin = () => {
  const [data, setData] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [supplyFilter, setSupplyFilter] = useState(undefined);
  const [expiredFilter, setExpiredFilter] = useState(undefined);
  const [filterType, setFilterType] = useState("all"); // all, deleted, expiring, expired
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Load supplies for filter and create/update
  const fetchSupplies = async () => {
    try {
      const res = await getMedicalSupplies({ pageNumber: 1, pageSize: 100 });
      setSupplies(res.data?.data || []);
    } catch {}
  };

  // Load lot list
const fetchData = async (params = {}) => {
  setLoading(true);
  try {
    let lots = [];
    let total = 0;

    if (filterType === "expiring") {
      // Gọi API riêng cho Sắp hết hạn
      const res = await getExpiringLots();
      lots = res.data?.data || [];
      total = lots.length;
    } else if (filterType === "expired") {
      // Gọi API riêng cho Đã hết hạn
      const res = await getExpiredLots();
      lots = res.data?.data || [];
      total = lots.length;
    } else if (filterType === "deleted") {
      const res = await getDeletedLots();
      lots = res.data?.data || [];
      total = res.data?.totalRecords || lots.length;
    } else {
      // API mặc định (tất cả)
      const res = await getMedicalSupplyLots({
        pageNumber: params.pageNumber || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        medicalSupplyId: supplyFilter,
        isExpired: expiredFilter,
      });
      lots = res.data?.data || [];
      total = res.data?.totalRecords || lots.length;
    }
    setData(lots);
    setPagination((prev) => ({ ...prev, total, current: params.pageNumber || pagination.current }));
  } catch (error) {
    message.error(error?.response?.data?.message ?? "Không tải được dữ liệu!");
  }
  setLoading(false);
};


  useEffect(() => {
    fetchSupplies();
  }, []);
  useEffect(() => {
    fetchData({ pageNumber: 1 });
    setPagination((prev) => ({ ...prev, current: 1 }));
    // eslint-disable-next-line
  }, [filterType, supplyFilter, expiredFilter, searchTerm]);

  // Table columns
  const columns = [
    {
      title: "Vật tư",
      dataIndex: "medicalSupplyId",
      key: "medicalSupplyId",
      render: (v) => supplies.find((x) => x.id === v)?.name || v,
    },
    { title: "Mã lô", dataIndex: "lotNumber", key: "lotNumber" },
    {
      title: "HSD",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "NSX",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Trạng thái",
      dataIndex: "isExpired",
      key: "isExpired",
      render: (_, r) => {
        const expired = r.expirationDate && dayjs(r.expirationDate).isBefore(dayjs());
        return expired ? <Tag color="red">Hết hạn</Tag> : <Tag color="green">Còn hạn</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xóa lô này?" onConfirm={() => handleDelete([record.id])}>
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
              <Button size="small" onClick={() => openEditQuantityModal(record)}>
                Sửa SL
              </Button>
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

  // Modal add/edit
  const openModal = (record = null) => {
    setEditing(record ? record.id : null);
    if (record) {
      form.setFieldsValue({
        ...record,
        expirationDate: record.expirationDate ? dayjs(record.expirationDate) : null,
        manufactureDate: record.manufactureDate ? dayjs(record.manufactureDate) : null,
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
        expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null,
        manufactureDate: values.manufactureDate ? values.manufactureDate.toISOString() : null,
      };
      if (editing) {
        await updateMedicalSupplyLot(editing, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createMedicalSupplyLot(payload);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ??"Có lỗi xảy ra!");
    }
  };

  // Xóa 1 hoặc nhiều
  const handleDelete = async (ids) => {
    try {
      await deleteMedicalSupplyLots(ids, false); // xóa mềm
      message.success("Xóa thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ??"Xóa thất bại!");
    }
  };

  // Khôi phục batch
  const handleRestore = async () => {
    if (!selectedRowKeys.length) return message.warning("Chọn lô để khôi phục");
    try {
      await restoreMedicalSupplyLots(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ??"Khôi phục thất bại!");
    }
  };

  // Edit quantity
  const [qtyModal, setQtyModal] = useState({ open: false, record: null });
  const [qtyValue, setQtyValue] = useState(0);
  const openEditQuantityModal = (record) => {
    setQtyModal({ open: true, record });
    setQtyValue(record.quantity);
  };
  const handleQuantityOk = async () => {
    try {
      await updateLotQuantity(qtyModal.record.id, qtyValue);
      message.success("Cập nhật số lượng thành công!");
      setQtyModal({ open: false, record: null });
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ??"Cập nhật số lượng thất bại!");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm mã lô"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Lọc theo vật tư"
          style={{ width: 180 }}
          value={supplyFilter}
          onChange={(val) => setSupplyFilter(val)}
          options={supplies.map((x) => ({ value: x.id, label: x.name }))}
          showSearch
          optionFilterProp="label"
        />
        <Select
          allowClear
          placeholder="Hạn sử dụng"
          style={{ width: 140 }}
          value={expiredFilter}
          onChange={(val) => setExpiredFilter(val)}
          options={[
            { value: false, label: "Còn hạn" },
            { value: true, label: "Hết hạn" },
          ]}
        />
        
        <Button
          type={filterType === "expiring" ? "primary" : "default"}
          onClick={() => setFilterType(filterType === "expiring" ? "all" : "expiring")}
        >
          Sắp hết hạn
        </Button>
        <Button
          type={filterType === "expired" ? "primary" : "default"}
          onClick={() => setFilterType(filterType === "expired" ? "all" : "expired")}
        >
          Đã hết hạn
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
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={filterType === "expiring" || filterType === "expired" ? false : pagination}
        rowSelection={
          filterType === "deleted"
            ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }
            : undefined
        }
        onChange={filterType === "expiring" || filterType === "expired" ? undefined : handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Cập nhật lô vật tư" : "Thêm mới lô vật tư"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={defaultForm}>
          <Form.Item name="medicalSupplyId" label="Vật tư" rules={[{ required: true, message: "Chọn vật tư" }]}>
            <Select
              options={supplies.map((x) => ({ value: x.id, label: x.name }))}
              showSearch
              optionFilterProp="label"
              placeholder="Chọn vật tư"
            />
          </Form.Item>
          <Form.Item name="lotNumber" label="Mã lô" rules={[{ required: true, message: "Nhập mã lô" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Hạn sử dụng"
            rules={[{ required: true, message: "Chọn hạn sử dụng" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="manufactureDate" label="Ngày sản xuất" rules={[{ required: true, message: "Chọn NSX" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: "Nhập số lượng" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal sửa quantity */}
      <Modal
        open={qtyModal.open}
        title="Cập nhật số lượng"
        onCancel={() => setQtyModal({ open: false, record: null })}
        onOk={handleQuantityOk}
        okText="Cập nhật"
        destroyOnClose
      >
        <InputNumber value={qtyValue} min={0} style={{ width: "100%" }} onChange={setQtyValue} />
      </Modal>
    </div>
  );
};

export default MedicalSupplyLotAdmin;
