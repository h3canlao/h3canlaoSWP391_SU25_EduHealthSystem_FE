import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Table,
  Tag,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Checkbox,
  Spin,
  Alert
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { toast } from "react-toastify";
import { createCheckupCampaign, createCheckupSchedule, getAllStudents } from "@/services/apiServices";
import { getAccessToken } from "@/services/handleStorageApi";
import "./CreateCheckupSchedule.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateCheckupSchedule = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [campaignId, setCampaignId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [includeAllGrades, setIncludeAllGrades] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const studentRes = await getAllStudents();
        if (studentRes.data.isSuccess) {
          setStudents(Array.isArray(studentRes.data.data) ? studentRes.data.data : []);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Không thể tải dữ liệu học sinh!");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const grades = Array.from(new Set(students.map(s => s.grade))).filter(Boolean).sort();
  const sections = Array.from(new Set(students.map(s => s.section))).filter(Boolean).sort();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = getAccessToken();
      // Step 1: Tạo campaign
      const campaignData = {
        name: values.campaignName,
        schoolYear: values.schoolYear,
        scheduledDate: values.scheduledDate.toISOString(),
        description: values.campaignDescription,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };
      const campaignResponse = await createCheckupCampaign(campaignData);
      if (!campaignResponse.data || !campaignResponse.data.isSuccess) {
        throw new Error(campaignResponse.data?.message || "Có lỗi khi tạo chiến dịch khám sức khỏe");
      }
      const newCampaignId = campaignResponse.data.data.id;
      setCampaignId(newCampaignId);
      // Step 2: Tạo schedule
      if (selectedStudents.length === 0) {
        throw new Error("Vui lòng chọn học sinh hoặc chọn tất cả học sinh của khối");
      }
      const scheduleData = {
        campaignId: newCampaignId,
        scheduledDate: values.scheduleDate.toISOString(),
        studentIds: selectedStudents,
        grades: selectedGrades,
        sections: selectedSections,
        notes: values.notes || "",
      };
      const scheduleResponse = await createCheckupSchedule(scheduleData);
      if (!scheduleResponse.data || !scheduleResponse.data.isSuccess) {
        throw new Error(scheduleResponse.data?.message || "Có lỗi khi tạo lịch khám sức khỏe");
      }
      toast.success("Tạo chiến dịch và lịch khám sức khỏe thành công!");
      setIsCompleted(true);
      form.resetFields();
      setSelectedStudents([]);
      setSelectedGrades([]);
      setSelectedSections([]);
      setIncludeAllGrades({});
      setCampaignId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Có lỗi khi tạo chiến dịch và lịch khám sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    {
      title: "Tên học sinh",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      key: "name",
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Khối/Lớp",
      render: (_, record) => `${record.grade}${record.section ? " - " + record.section : ""}`,
      key: "grade",
    },
    {
      title: "Ngày sinh",
      render: (_, record) => record.dateOfBirth ? moment(record.dateOfBirth).format("DD/MM/YYYY") : "-",
      key: "dateOfBirth",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, student) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setSelectedStudents(prev => [...prev, student.id])}
          disabled={selectedStudents.includes(student.id)}
        >
          Thêm
        </Button>
      ),
    },
  ];

  const selectedStudentColumns = [
    {
      title: "Tên học sinh",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      key: "name",
    },
    {
      title: "Mã học sinh",
      dataIndex: "studentCode",
      key: "studentCode",
    },
    {
      title: "Khối/Lớp",
      render: (_, record) => `${record.grade}${record.section ? " - " + record.section : ""}`,
      key: "grade",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, student) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => setSelectedStudents(prev => prev.filter(id => id !== student.id))}
        >
          Xóa
        </Button>
      ),
    },
  ];

  if (dataLoading) {
    return (
      <div className="create-checkup-schedule">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="create-checkup-schedule">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
            <Title level={3}>Tạo lịch khám sức khỏe thành công!</Title>
            <Text type="secondary">
              Chiến dịch và lịch khám sức khỏe đã được tạo thành công. Hệ thống sẽ gửi thông báo đến phụ huynh.
            </Text>
            <br />
            <Button
              type="primary"
              size="large"
              style={{ marginTop: '24px' }}
              onClick={() => {
                setIsCompleted(false);
                form.resetFields();
                setSelectedStudents([]);
                setSelectedGrades([]);
                setSelectedSections([]);
                setIncludeAllGrades({});
                setCampaignId(null);
              }}
            >
              Tạo Lịch Khám Mới
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-checkup-schedule">
      <Card>
        <div className="page-header">
          <Title level={3}>Tạo Lịch Khám Sức Khỏe</Title>
          <Text type="secondary">
            Tạo chiến dịch và lịch khám sức khỏe cho học sinh
          </Text>
        </div>
        <Divider />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Campaign Information */}
          <Divider orientation="left">Thông Tin Chiến Dịch</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Tên chiến dịch"
                name="campaignName"
                rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
              >
                <Input placeholder="Nhập tên chiến dịch khám sức khỏe" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Năm học"
                name="schoolYear"
                rules={[{ required: true, message: "Vui lòng nhập năm học" }]}
              >
                <Input placeholder="Nhập năm học (VD: 2024-2025)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày dự kiến"
                name="scheduledDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày dự kiến"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Mô tả chiến dịch"
            name="campaignDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chiến dịch khám sức khỏe" />
          </Form.Item>
          {/* Schedule Information */}
          <Divider orientation="left">Thông Tin Lịch Khám</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian khám sức khỏe"
                name="scheduleDate"
                rules={[{ required: true, message: "Vui lòng chọn thời gian khám sức khỏe" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn thời gian khám sức khỏe"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ghi chú" name="notes">
                <Input placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
          {/* Student Selection */}
          <Divider orientation="left">Chọn Học Sinh</Divider>
          <Alert
            message="Thông tin"
            description="Bạn có thể chọn học sinh cụ thể hoặc chọn tất cả học sinh theo khối/lớp"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Chọn khối">
                  <Select
                    mode="multiple"
                    placeholder="Chọn khối"
                    value={selectedGrades}
                    onChange={setSelectedGrades}
                    style={{ width: "100%" }}
                  >
                    {grades.map(grade => (
                      <Option key={grade} value={grade}>Khối {grade}</Option>
                    ))}
                  </Select>
                  {selectedGrades.map(grade => (
                    <Checkbox
                      key={grade}
                      checked={!!includeAllGrades[grade]}
                      style={{ marginLeft: 8 }}
                      onChange={e => {
                        setIncludeAllGrades(prev => ({ ...prev, [grade]: e.target.checked }));
                        const studentsInGrade = students.filter(s => s.grade === grade).map(s => s.id);
                        if (e.target.checked) {
                          setSelectedStudents(prev => Array.from(new Set([...prev, ...studentsInGrade])));
                        } else {
                          setSelectedStudents(prev => prev.filter(id => !studentsInGrade.includes(id)));
                        }
                      }}
                    >
                      Chọn tất cả khối {grade}
                    </Checkbox>
                  ))}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chọn lớp">
                  <Select
                    mode="multiple"
                    placeholder="Chọn lớp"
                    value={selectedSections}
                    onChange={setSelectedSections}
                    style={{ width: "100%" }}
                  >
                    {sections.map(section => (
                      <Option key={section} value={section}>Lớp {section}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* Lọc học sinh theo khối/lớp được chọn */}
            {(() => {
              let filteredStudents = students;
              if (selectedGrades.length > 0) {
                filteredStudents = filteredStudents.filter(student => 
                  selectedGrades.includes(student.grade)
                );
              }
              if (selectedSections.length > 0) {
                filteredStudents = filteredStudents.filter(student => 
                  selectedSections.includes(student.section)
                );
              }
              // Determine if all filtered students are selected
              const allFilteredSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.includes(s.id));
              const handleSelectAllFiltered = () => {
                if (allFilteredSelected) {
                  // Deselect all filtered
                  setSelectedStudents(prev => prev.filter(id => !filteredStudents.map(s => s.id).includes(id)));
                } else {
                  // Select all filtered
                  setSelectedStudents(prev => Array.from(new Set([...prev, ...filteredStudents.map(s => s.id)])));
                }
              };
              return (
                <>
                  <Divider orientation="left">
                    Danh sách học sinh đã lọc ({filteredStudents.length}/{students.length})
                    {selectedGrades.length > 0 && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        Khối: {selectedGrades.join(", ")}
                      </Tag>
                    )}
                    {selectedSections.length > 0 && (
                      <Tag color="green" style={{ marginLeft: 8 }}>
                        Lớp: {selectedSections.join(", ")}
                      </Tag>
                    )}
                    {/* Select all/deselect all button */}
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: 16 }}
                      onClick={handleSelectAllFiltered}
                      disabled={filteredStudents.length === 0}
                    >
                      {allFilteredSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </Button>
                  </Divider>
                  {filteredStudents.length === 0 ? (
                    <Alert
                      message="Không có học sinh nào"
                      description="Không tìm thấy học sinh nào phù hợp với bộ lọc đã chọn. Vui lòng thử lại với bộ lọc khác."
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  ) : (
                    <Table
                      dataSource={filteredStudents}
                      columns={studentColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      size="small"
                      scroll={{ y: 300 }}
                    />
                  )}
                  {selectedStudents.length > 0 && (
                    <>
                      <Divider orientation="left">Học sinh đã chọn ({selectedStudents.length})</Divider>
                      <Table
                        dataSource={students.filter(s => selectedStudents.includes(s.id))}
                        columns={selectedStudentColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                      />
                    </>
                  )}
                </>
              );
            })()}
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ minWidth: 200 }}
            >
              Tạo Chiến Dịch & Lịch Khám
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCheckupSchedule; 