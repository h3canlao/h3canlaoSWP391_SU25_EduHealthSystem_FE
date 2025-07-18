import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Switch, message } from "antd";
import { createVaccinationSchedule } from "@/services/vaccinationSchedule";
import { getVaccineTypes } from "@/services/vaccineManagerApi";
import { getStudents, getGrades, getSections } from "@/services/vaccinationHelperApi";
import { getVaccinationCampaigns } from "@/services/vaccinationCampaignApi";

const VaccinationScheduleCreateModal = ({ visible, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVaccineTypes().then((res) => setVaccineTypes(res.data.data || res.data || []));
    getGrades().then((res) => setGrades(res.data.data || res.data || []));
    getSections().then((res) => setSections(res.data.data || res.data || []));
    getStudents().then((res) => setStudents(res.data.data || res.data || []));
    getVaccinationCampaigns().then((res) => setCampaigns(res.data.data || res.data || []));
  }, []);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const payload = {
        campaignId: values.campaignId,
        vaccinationTypeId: values.vaccinationTypeId,
        scheduledAt: values.scheduledAt?.toISOString(),
        studentIds: values.studentIds || [],
        grades: values.grades || [],
        sections: values.sections || [],
        includeAllStudentsInGrades: values.includeAllStudentsInGrades || false,
        notes: values.notes,
      };
      await createVaccinationSchedule(payload);
      message.success("Tạo mới lịch tiêm thành công!");
      setLoading(false);
      form.resetFields();
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setLoading(false);
      message.error(err?.response?.data?.message || "Tạo mới thất bại!");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Tạo mới"
      confirmLoading={loading}
      title="Thêm mới lịch tiêm"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="campaignId"
          label="Chiến dịch"
          rules={[{ required: true, message: "Vui lòng chọn chiến dịch!" }]}
        >
          <Select
            options={campaigns.map((c) => ({
              value: c.id,
              label: c.name || c.title || c.campaignName || c.id,
            }))}
            showSearch
            placeholder="Chọn chiến dịch"
          />
        </Form.Item>
        <Form.Item name="vaccinationTypeId" label="Loại vaccine" rules={[{ required: true }]}>
          <Select
            options={vaccineTypes.map((v) => ({ value: v.id, label: v.name }))}
            showSearch
            placeholder="Chọn loại vaccine"
          />
        </Form.Item>
        <Form.Item name="scheduledAt" label="Thời gian tiêm" rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="grades" label="Khối">
          <Select
            mode="multiple"
            options={grades.map((g) => ({ value: g, label: g }))}
            allowClear
            placeholder="Chọn khối"
          />
        </Form.Item>
        <Form.Item name="sections" label="Lớp">
          <Select
            mode="multiple"
            // Bạn có thể lấy danh sách section từ grades nếu muốn
            options={sections.map((g) => ({ value: g, label: g }))} // tùy thuộc vào dữ liệu của bạn
            allowClear
            placeholder="Chọn lớp"
          />
        </Form.Item>
        <Form.Item name="studentIds" label="Chọn học sinh">
          <Select
            mode="multiple"
            options={students.map((st) => ({
              value: st.id,
              label: `${st.lastName} ${st.firstName} (${st.studentCode})`,
            }))}
            allowClear
            showSearch
            placeholder="Chọn học sinh"
          />
        </Form.Item>
        <Form.Item
          name="includeAllStudentsInGrades"
          label="Chọn tất cả học sinh trong các khối đã chọn"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VaccinationScheduleCreateModal;
