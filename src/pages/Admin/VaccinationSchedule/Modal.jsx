import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Switch, message } from "antd";
import dayjs from "dayjs";
import {
  createVaccinationSchedule,
  updateVaccinationSchedule,
  getVaccinationScheduleById,
} from "@/services/vaccinationSchedule";
import { getVaccineTypes } from "@/services/vaccineManagerApi";
import { getStudents, getGrades, getSections } from "@/services/vaccinationHelperApi";
import { getVaccinationCampaigns } from "@/services/vaccinationCampaignApi";

const VaccinationScheduleModal = ({ visible, onClose, onSuccess, editingRecord }) => {
  const [form] = Form.useForm();
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      getVaccineTypes().then((res) => setVaccineTypes(res.data.data || res.data || []));
      getGrades().then((res) => setGrades(res.data.data || res.data || []));
      getSections().then((res) => setSections(res.data.data || res.data || []));
      getStudents().then((res) => setStudents(res.data.data || res.data || []));
      getVaccinationCampaigns().then((res) => setCampaigns(res.data.data || res.data || []));
    }
  }, [visible]);

  // THAY ĐỔI 2: Cập nhật logic để xử lý đúng cấu trúc JSON detail
  useEffect(() => {
    const fetchDetailAndSetForm = async (record) => {
      setLoading(true);
      try {
        const res = await getVaccinationScheduleById(record.id);
        const detailData = res.data?.data;

        if (detailData) {
          const studentIds = detailData.sessionStudents?.map((s) => s.studentId) || [];

          // Điền dữ liệu vào form
          form.setFieldsValue({
            ...record,
            ...detailData,
            scheduledAt: detailData.scheduledAt ? dayjs(detailData.scheduledAt) : null,
            studentIds: studentIds,
            vaccinationTypeId: vaccineTypes.find((item) => item.code == detailData.vaccinationTypeCode)?.id,
            campaignId: detailData.campaignName,
          });
        } else {
          message.error("Không tìm thấy chi tiết lịch tiêm!");
          onClose();
        }
      } catch (err) {
        message.error(err?.response?.data?.message ?? "Không lấy được thông tin chi tiết!");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (editingRecord && editingRecord.id) {
      // Khi sửa, truyền cả `editingRecord` vào để có các ID ban đầu
      fetchDetailAndSetForm(editingRecord);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form, onClose]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (editingRecord) {
        const updatePayload = {
          vaccinationTypeId: values.vaccinationTypeId,
          scheduledAt: values.scheduledAt?.toISOString(),
          studentIds: values.studentIds || [],
          notes: values.notes || "",
        };

        await updateVaccinationSchedule(editingRecord.id, updatePayload);
        message.success("Cập nhật lịch tiêm thành công!");
      } else {
        // Khi tạo mới, giữ nguyên payload đầy đủ
        const createPayload = {
          campaignId: values.campaignId,
          vaccinationTypeId: values.vaccinationTypeId,
          scheduledAt: values.scheduledAt?.toISOString(),
          studentIds: values.studentIds || [],
          grades: values.grades || [],
          sections: values.sections || [],
          includeAllStudentsInGrades: values.includeAllStudentsInGrades || false,
          notes: values.notes,
        };
        await createVaccinationSchedule(createPayload);
        message.success("Tạo mới lịch tiêm thành công!");
      }

      setLoading(false);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      console.error("Failed to submit:", err);
      message.error(err?.response?.data?.message || "Thao tác thất bại!");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText={editingRecord ? "Cập nhật" : "Tạo mới"}
      confirmLoading={loading}
      title={editingRecord ? "Cập nhật lịch tiêm" : "Thêm mới lịch tiêm"}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="campaignId"
          label="Chiến dịch"
          rules={[{ required: true, message: "Vui lòng chọn chiến dịch!" }]}
        >
          <Select
            disabled={!!editingRecord}
            options={campaigns.map((c) => ({ value: c.id, label: c.name || c.title || c.campaignName || c.id }))}
            showSearch
            placeholder={editingRecord ? "Không thể thay đổi chiến dịch" : "Chọn chiến dịch"}
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
          <DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" />
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
            options={sections.map((g) => ({ value: g, label: g }))}
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
            placeholder="Tìm và chọn học sinh"
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
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

export default VaccinationScheduleModal;
