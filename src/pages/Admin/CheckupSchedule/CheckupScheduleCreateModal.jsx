import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Checkbox, Space, Divider, Typography } from "antd";
import dayjs from "dayjs";
import { createCheckupSchedule } from "@/services/checkupSchedule";
import { getCheckupCampaigns } from "@/services/checkupCampaignApi";
import { getGrades, getSections, getStudents } from "@/services/vaccinationHelperApi"; // Giả định đúng tên file

const { Option } = Select;
const { Title, Text } = Typography;

const CheckupScheduleCreateModal = ({ visible, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  // Load danh sách chiến dịch, khối, lớp, học sinh khi modal mở
  useEffect(() => {
    if (visible) {
      const loadData = async () => {
        try {
          const [campaignsRes, gradesRes, sectionsRes, studentsRes] = await Promise.all([
            getCheckupCampaigns({ pageNumber: 1, pageSize: 100 }),
            getGrades(),
            getSections(),
            getStudents(),
          ]);

          // Xử lý dữ liệu students để có fullName
          const studentData = (studentsRes.data?.data || []).map((student) => ({
            ...student,
            fullName: `${student.lastName} ${student.firstName}`,
          }));

          setCampaigns(campaignsRes.data?.data || []);
          setGrades(gradesRes.data?.data || []);
          setSections(sectionsRes.data?.data || []);
          setStudents(studentData);
        } catch (err) {
          message.error("Không tải được dữ liệu cần thiết!");
        }
      };
      loadData();
    }
  }, [visible]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        campaignId: values.campaignId,
        scheduledDate: values.scheduledDate?.toISOString(),
        studentIds: values.studentIds || [],
        grades: values.grades || [],
        sections: values.sections || [],
        includeAllStudentsInGrades: values.includeAllStudentsInGrades || false,
        notes: values.notes,
      };

      await createCheckupSchedule(payload);
      message.success("Tạo lịch khám thành công!");
      form.resetFields();
      onClose();
      onCreated();
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra khi tạo lịch khám!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          Thêm mới Lịch Khám Sức Khoẻ
        </Title>
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      width={600}
      centered
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            onClose();
          }}
        >
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Tạo Lịch
        </Button>,
      ]}
    >
      <Divider style={{ margin: "16px 0" }} />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          includeAllStudentsInGrades: false,
          notes: "",
        }}
      >
        <Form.Item
          name="campaignId"
          label="Chiến dịch khám"
          rules={[{ required: true, message: "Vui lòng chọn chiến dịch!" }]}
        >
          <Select
            placeholder="Chọn chiến dịch"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {campaigns.map((camp) => (
              <Option key={camp.id} value={camp.id}>
                {camp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="scheduledDate"
          label="Thời gian dự kiến"
          rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
        >
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        <Divider orientation="left" plain>
          <Text strong>Đối tượng khám</Text>
        </Divider>
        <Form.Item label="Chọn đối tượng">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item name="grades" noStyle>
              <Select mode="multiple" placeholder="Chọn theo khối" showSearch optionFilterProp="children">
                {grades.map((grade) => (
                  <Option key={grade} value={grade}>
                    Khối {grade}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="sections" noStyle>
              <Select mode="multiple" placeholder="Chọn theo lớp" showSearch optionFilterProp="children">
                {sections.map((section) => (
                  <Option key={section} value={section}>
                    Lớp {section}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="studentIds" noStyle>
              <Select
                mode="multiple"
                placeholder="Chọn học sinh cụ thể"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {students.map((student) => (
                  <Option key={student.id} value={student.id}>
                    {student.fullName} ({student.studentCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item name="includeAllStudentsInGrades" valuePropName="checked">
          <Checkbox>Bao gồm tất cả học sinh trong các khối đã chọn</Checkbox>
        </Form.Item>

        <Divider orientation="left" plain>
          <Text strong>Thông tin bổ sung</Text>
        </Divider>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CheckupScheduleCreateModal;
