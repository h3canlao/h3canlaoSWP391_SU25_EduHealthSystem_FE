import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Popconfirm, message, Space } from "antd";
import dayjs from "dayjs";
import {
  getVaccineLots,
  createVaccineLot,
  updateVaccineLot,
  batchDeleteVaccineLot,
  batchRestoreVaccineLot,
} from "@/services/vaccineManagerApi";

const defaultVaccineLot = {
  vaccineTypeId: "",
  lotNumber: "",
  expiryDate: null,
  quantity: null,
  storageLocation: "",
};

const VaccineLotTab = ({ vaccineTypes }) => {
  const [vaccineLots, setVaccineLots] = useState([]);
  const [lotModal, setLotModal] = useState(false);
  const [lotEditing, setLotEditing] = useState(null);
  const [lotForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });
  const fetchVaccineLots = async (params = {}) => {
    try {
      const res = await getVaccineLots({
        isDeleted: showDeleted,
        pageNumber: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      });
      setPagination((prev) => ({
        ...prev,
        current: params.current || prev.current,
        pageSize: params.pageSize || prev.pageSize,
      }));
      setVaccineLots(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được lô vaccine");
    }
  };

  useEffect(() => {
    fetchVaccineLots();
  }, [showDeleted]);

  const handleLotModal = (record) => {
    setLotEditing(record || null);
    lotForm.setFieldsValue(
      record ? { ...record, expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null } : { ...defaultVaccineLot }
    );
    setLotModal(true);
  };
  const handleLotOk = async () => {
    try {
      const values = await lotForm.validateFields();
      const payload = {
        ...values,
        expiryDate: values.expiryDate?.toISOString(),
      };
      if (lotEditing) {
        await updateVaccineLot(lotEditing.id, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createVaccineLot(payload);
        message.success("Thêm mới thành công!");
      }
      setLotModal(false);
      fetchVaccineLots();
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  // Xóa nhiều
  const handleBatchDelete = async () => {
    try {
      await batchDeleteVaccineLot(selectedRowKeys);
      message.success("Đã xoá!");
      setSelectedRowKeys([]);
      fetchVaccineLots();
    } catch {
      message.error("Xoá thất bại!");
    }
  };

  // Phục hồi nhiều
  const handleBatchRestore = async () => {
    try {
      await batchRestoreVaccineLot(selectedRowKeys);
      message.success("Đã phục hồi!");
      setSelectedRowKeys([]);
      fetchVaccineLots();
    } catch {
      message.error("Phục hồi thất bại!");
    }
  };
  const handleTableChange = (newPagination) => {
    fetchVaccineLots({ current: newPagination.current, pageSize: newPagination.pageSize });
  };
  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={() => handleLotModal()}>
          Thêm lô vaccine
        </Button>
        <Button onClick={() => setShowDeleted((v) => !v)} type={showDeleted ? "primary" : "default"}>
          {showDeleted ? "Xem danh sách" : "Xem đã xoá"}
        </Button>
        {!showDeleted ? (
          <Popconfirm
            title="Xoá các lô vaccine đã chọn?"
            disabled={!selectedRowKeys.length}
            onConfirm={handleBatchDelete}
          >
            <Button danger disabled={!selectedRowKeys.length}>
              Xoá nhiều
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Khôi phục các lô đã chọn?"
            disabled={!selectedRowKeys.length}
            onConfirm={handleBatchRestore}
          >
            <Button type="primary" disabled={!selectedRowKeys.length}>
              Phục hồi
            </Button>
          </Popconfirm>
        )}
      </Space>
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        dataSource={vaccineLots}
        pagination={pagination}
        onChange={handleTableChange}
        columns={[
          { title: "Mã lô", dataIndex: "lotNumber" },
          {
            title: "Loại Vaccine",
            dataIndex: "vaccineTypeId",
            render: (id) => vaccineTypes.find((t) => t.id === id)?.name || id,
          },
          { title: "Ngày hết hạn", dataIndex: "expiryDate", render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "") },
          { title: "Số lượng", dataIndex: "quantity" },
          { title: "Nơi lưu trữ", dataIndex: "storageLocation" },
          {
            title: "Thao tác",
            render: (_, r) => (
              <Space>
                <Button type="link" onClick={() => handleLotModal(r)}>
                  Sửa
                </Button>
                {!showDeleted && (
                  <Popconfirm
                    title="Xoá lô vaccine này?"
                    onConfirm={() => batchDeleteVaccineLot([r.id]).then(fetchVaccineLots)}
                  >
                    <Button danger type="link">
                      Xoá
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />
      <Modal
        open={lotModal}
        onCancel={() => setLotModal(false)}
        onOk={handleLotOk}
        destroyOnClose
        title={lotEditing ? "Cập nhật" : "Thêm mới"}
      >
        <Form form={lotForm} layout="vertical" initialValues={defaultVaccineLot}>
          <Form.Item name="vaccineTypeId" label="Loại Vaccine" rules={[{ required: true }]}>
            <Select options={vaccineTypes.map((v) => ({ value: v.id, label: v.name }))} showSearch />
          </Form.Item>
          <Form.Item name="lotNumber" label="Mã lô" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="expiryDate" label="Ngày hết hạn" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="storageLocation" label="Nơi lưu trữ">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VaccineLotTab;
