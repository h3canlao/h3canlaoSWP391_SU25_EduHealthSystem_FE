import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputNumber, Select, Popconfirm, message, Space } from "antd";
import {
  getVaccineDoseInfos, createVaccineDoseInfo, updateVaccineDoseInfo,
  deleteVaccineDoseInfos
} from "@/services/vaccineManagerApi";

const defaultDoseInfo = {
  vaccineTypeId: "", doseNumber: null, recommendedAgeMonths: null, minIntervalDays: null, previousDoseId: "",
};

const VaccineDoseInfoTab = ({ vaccineTypes }) => {
  const [doseInfos, setDoseInfos] = useState([]);
  const [doseModal, setDoseModal] = useState(false);
  const [doseEditing, setDoseEditing] = useState(null);
  const [doseForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchDoseInfos = async () => {
    try {
      const res = await getVaccineDoseInfos();
      setDoseInfos(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được liều tiêm");
    }
  };

  useEffect(() => {
    fetchDoseInfos();
  }, []);

  const handleDoseModal = (record) => {
    setDoseEditing(record || null);
    doseForm.setFieldsValue(record ? { ...record } : { ...defaultDoseInfo });
    setDoseModal(true);
  };
  const handleDoseOk = async () => {
    try {
      const values = await doseForm.validateFields();
      // Không gửi vaccineTypeId khi update (nếu API yêu cầu)
      const payload = { ...values };
      if (doseEditing) {
        await updateVaccineDoseInfo(doseEditing.id, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createVaccineDoseInfo(payload);
        message.success("Thêm mới thành công!");
      }
      setDoseModal(false);
      fetchDoseInfos();
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };
  const handleDoseDelete = async (ids) => {
    try {
      await deleteVaccineDoseInfos(ids);
      message.success("Đã xoá!");
      setSelectedRowKeys([]);
      fetchDoseInfos();
    } catch {
      message.error("Xoá thất bại!");
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={() => handleDoseModal()}>Thêm liều tiêm</Button>
        <Popconfirm
          title="Xoá các liều đã chọn?"
          disabled={!selectedRowKeys.length}
          onConfirm={() => handleDoseDelete(selectedRowKeys)}
        >
          <Button danger disabled={!selectedRowKeys.length}>Xoá nhiều</Button>
        </Popconfirm>
      </Space>
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        dataSource={doseInfos}
        columns={[
          {
            title: "Loại Vaccine",
            dataIndex: "vaccineTypeId",
            render: (id) => vaccineTypes.find(t => t.id === id)?.name || id,
          },
          { title: "Số thứ tự", dataIndex: "doseNumber" },
          { title: "Tuổi khuyến nghị (tháng)", dataIndex: "recommendedAgeMonths" },
          { title: "Khoảng cách liều (ngày)", dataIndex: "minIntervalDays" },
          {
            title: "Liều trước đó",
            dataIndex: "previousDoseId",
            render: (id) => doseInfos.find(d => d.id === id)?.doseNumber || "",
          },
          {
            title: "Thao tác", render: (_, r) => (
              <Space>
                <Button type="link" onClick={() => handleDoseModal(r)}>Sửa</Button>
                <Popconfirm title="Xoá liều này?" onConfirm={() => handleDoseDelete([r.id])}>
                  <Button danger type="link">Xoá</Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />
      <Modal open={doseModal} onCancel={() => setDoseModal(false)} onOk={handleDoseOk} destroyOnClose title={doseEditing ? "Cập nhật" : "Thêm mới"}>
        <Form form={doseForm} layout="vertical" initialValues={defaultDoseInfo}>
          <Form.Item name="vaccineTypeId" label="Loại Vaccine" rules={[{ required: true }]}>
            <Select options={vaccineTypes.map(v => ({ value: v.id, label: v.name }))} showSearch />
          </Form.Item>
          <Form.Item name="doseNumber" label="Số thứ tự" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="recommendedAgeMonths" label="Tuổi khuyến nghị (tháng)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="minIntervalDays" label="Khoảng cách liều (ngày)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="previousDoseId" label="Liều trước đó">
            <Select options={doseInfos.map(d => ({ value: d.id, label: `${d.doseNumber}` }))} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default VaccineDoseInfoTab;
