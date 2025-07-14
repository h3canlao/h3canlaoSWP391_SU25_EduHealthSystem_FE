import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Popconfirm, message, Space, Tag,
} from "antd";
import dayjs from "dayjs";
import {
  getMedicationLots,
  createMedicationLot,
  updateMedicationLot,
  deleteMedicationLotsBatch,
  restoreMedicationLotsBatch,
  updateMedicationLotQuantity,
} from "@/services/medicationLotApi";
import { getMedications } from "@/services/medicationApi";

const defaultForm = {
  medicationId: undefined,
  lotNumber: "",
  expiryDate: null,
  manufactureDate: null,
  quantity: 0,
  storageLocation: "",
};

const MedicationLotAdmin = () => {
  const [data, setData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [medicationFilter, setMedicationFilter] = useState(undefined);
  const [expiredFilter, setExpiredFilter] = useState(undefined);
  const [filterType, setFilterType] = useState("all"); // all, deleted, expiring, expired
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Load danh sách thuốc cho dropdown
  const fetchMedications = async () => {
    try {
      const res = await getMedications({ pageNumber: 1, pageSize: 100 });
      setMedications(res.data?.data || []);
    } catch {}
  };

  // Lấy danh sách lô thuốc với filter chuẩn theo API bạn gửi
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      let apiParams = {
        pageNumber: params.pageNumber || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        medicationId: medicationFilter,
        isExpired: expiredFilter,
      };
      if (filterType === "deleted") {
        apiParams.includeDeleted = true;
      } else if (filterType === "expiring") {
        apiParams.status = "expiring";
        apiParams.daysBeforeExpiry = 30;
      } else if (filterType === "expired") {
        apiParams.isExpired = true;
      }
      const res = await getMedicationLots(apiParams);
      setData(res.data?.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.totalRecords || (res.data?.data ? res.data.data.length : 0),
        current: params.pageNumber || pagination.current,
      }));
    } catch (error) {
      message.error(error?.response?.data?.message ?? "Không tải được dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => { fetchMedications(); }, []);
  useEffect(() => {
    fetchData({ pageNumber: 1 });
    setPagination((prev) => ({ ...prev, current: 1 }));
    // eslint-disable-next-line
  }, [filterType, medicationFilter, expiredFilter, searchTerm]);

  // Table columns
  const columns = [
    {
      title: "Thuốc",
      dataIndex: "medicationId",
      key: "medicationId",
      render: v => medications.find(x => x.id === v)?.name || v
    },
    { title: "Mã lô", dataIndex: "lotNumber", key: "lotNumber" },
    {
      title: "HSD",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: v => v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""
    },
    {
      title: "NSX",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: v => v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Vị trí lưu trữ", dataIndex: "storageLocation", key: "storageLocation" },
    {
      title: "Trạng thái",
      dataIndex: "isExpired",
      key: "isExpired",
      render: (_, r) => {
        const expired = r.expiryDate && dayjs(r.expiryDate).isBefore(dayjs());
        return expired ? <Tag color="red">Hết hạn</Tag> : <Tag color="green">Còn hạn</Tag>;
      }
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
              <Popconfirm title="Xóa lô này?" onConfirm={() => handleDelete([record.id])}>
                <Button type="link" danger>Xóa</Button>
              </Popconfirm>
              <Button size="small" onClick={() => openEditQuantityModal(record)}>Sửa SL</Button>
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
        expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
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
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        manufactureDate: values.manufactureDate ? values.manufactureDate.toISOString() : null,
      };
      if (editing) {
        await updateMedicationLot(editing, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createMedicationLot(payload);
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ?? "Có lỗi xảy ra!");
    }
  };

  // Xóa batch (mềm/vĩnh viễn)
  const handleDelete = async (ids) => {
    try {
      await deleteMedicationLotsBatch(ids, false);
      message.success("Xóa thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  // Khôi phục batch
  const handleRestore = async () => {
    if (!selectedRowKeys.length) return message.warning("Chọn lô để khôi phục");
    try {
      await restoreMedicationLotsBatch(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ?? "Khôi phục thất bại!");
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
      await updateMedicationLotQuantity(qtyModal.record.id, qtyValue);
      message.success("Cập nhật số lượng thành công!");
      setQtyModal({ open: false, record: null });
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message ?? "Cập nhật số lượng thất bại!");
    }
  };

  return (
    <div style={{margin: '0 24px'}}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm mã lô"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Lọc theo thuốc"
          style={{ width: 180 }}
          value={medicationFilter}
          onChange={val => setMedicationFilter(val)}
          options={medications.map(x => ({ value: x.id, label: x.name }))}
          showSearch
          optionFilterProp="label"
        />
        <Select
          allowClear
          placeholder="Hạn sử dụng"
          style={{ width: 140 }}
          value={expiredFilter}
          onChange={val => setExpiredFilter(val)}
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
        <Button type="primary" onClick={() => openModal()} disabled={filterType === "deleted"}>
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
        title={editing ? "Cập nhật lô thuốc" : "Thêm mới lô thuốc"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={defaultForm}>
          <Form.Item name="medicationId" label="Thuốc" rules={[{ required: true, message: "Chọn thuốc" }]}>
            <Select
              options={medications.map(x => ({ value: x.id, label: x.name }))}
              showSearch
              optionFilterProp="label"
              placeholder="Chọn thuốc"
              disabled={!!editing}
            />
          </Form.Item>
          <Form.Item name="lotNumber" label="Mã lô" rules={[{ required: true, message: "Nhập mã lô" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="expiryDate"
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
          <Form.Item name="storageLocation" label="Vị trí lưu trữ" rules={[{ required: true, message: "Nhập vị trí lưu trữ" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
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

export default MedicationLotAdmin;
