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
import { createVaccinationCampaign, createVaccinationSchedule, getAllStudents, getVaccineTypes } from "@/services/apiServices";
import { getAccessToken } from "@/services/handleStorageApi";
import "./CreateVaccineSchedule.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateVaccineSchedule = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [campaignId, setCampaignId] = useState(null);
  const [students, setStudents] = useState([]);
  const [vaccinationTypes, setVaccinationTypes] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [includeAllStudents, setIncludeAllStudents] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch students and vaccine types on mount
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const token = getAccessToken();
        const [studentRes, vaccineRes] = await Promise.all([
          getAllStudents(),
          getVaccineTypes()
        ]);
        
        if (studentRes.data.isSuccess) {
          setStudents(Array.isArray(studentRes.data.data) ? studentRes.data.data : []);
        }
        
        if (vaccineRes.data.isSuccess) {
          setVaccinationTypes(Array.isArray(vaccineRes.data.data) ? vaccineRes.data.data : []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Không thể tải dữ liệu học sinh hoặc vaccine!");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lấy tất cả khối/lớp từ students
  const grades = Array.from(new Set(students.map(s => s.grade))).filter(Boolean).sort();
  const sections = Array.from(new Set(students.map(s => s.section))).filter(Boolean).sort();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = getAccessToken();
      
      // Step 1: Tạo campaign
      const campaignData = {
        name: values.campaignName,
        description: values.campaignDescription,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };
      
      const campaignResponse = await createVaccinationCampaign(campaignData);
      if (!campaignResponse.data.isSuccess) {
        throw new Error(campaignResponse.data.message || "Có lỗi khi tạo chiến dịch");
      }
      
      const newCampaignId = campaignResponse.data.data.id;
      setCampaignId(newCampaignId);
      
      // Step 2: Tạo schedule
      if (selectedStudents.length === 0 && !includeAllStudents) {
        throw new Error("Vui lòng chọn học sinh hoặc bật tùy chọn bao gồm tất cả học sinh");
      }
      
      const scheduleData = {
        campaignId: newCampaignId,
        vaccinationTypeId: values.vaccinationTypeId,
        scheduledAt: values.scheduledAt.toISOString(),
        studentIds: includeAllStudents ? [] : selectedStudents,
        grades: selectedGrades,
        sections: selectedSections,
        includeAllStudentsInGrades: includeAllStudents,
        notes: values.notes || "",
      };
      
      const scheduleResponse = await createVaccinationSchedule(scheduleData);
      if (!scheduleResponse.data.isSuccess) {
        throw new Error(scheduleResponse.data.message || "Có lỗi khi tạo lịch tiêm chủng");
      }
      
      toast.success("Tạo chiến dịch và lịch tiêm chủng thành công!");
      setIsCompleted(true);
      form.resetFields();
      setSelectedStudents([]);
      setSelectedGrades([]);
      setSelectedSections([]);
      setIncludeAllStudents(false);
      setCampaignId(null);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Có lỗi khi tạo chiến dịch và lịch tiêm chủng");
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
      <div className="create-vaccine-schedule">
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
      <div className="create-vaccine-schedule">
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
            <Title level={3}>Tạo lịch tiêm chủng thành công!</Title>
            <Text type="secondary">
              Chiến dịch và lịch tiêm đã được tạo thành công. Hệ thống sẽ gửi thông báo đến phụ huynh.
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
                setIncludeAllStudents(false);
                setCampaignId(null);
              }}
            >
              Tạo Lịch Tiêm Mới
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-vaccine-schedule">
      <Card>
        <div className="page-header">
          <Title level={3}>Tạo Lịch Tiêm Chủng</Title>
          <Text type="secondary">
            Tạo chiến dịch và lịch tiêm chủng cho học sinh
          </Text>
        </div>

        <Divider />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Campaign Information */}
          <Divider orientation="left">Thông Tin Chiến Dịch</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên chiến dịch"
                name="campaignName"
                rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
              >
                <Input placeholder="Nhập tên chiến dịch tiêm chủng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại vaccine"
                name="vaccinationTypeId"
                rules={[{ required: true, message: "Vui lòng chọn loại vaccine" }]}
              >
                <Select placeholder="Chọn loại vaccine">
                  {vaccinationTypes.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.name} ({type.code})
                    </Option>
                  ))}
                </Select>
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
            <TextArea rows={3} placeholder="Nhập mô tả chiến dịch tiêm chủng" />
          </Form.Item>

          {/* Schedule Information */}
          <Divider orientation="left">Thông Tin Lịch Tiêm</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian tiêm chủng"
                name="scheduledAt"
                rules={[{ required: true, message: "Vui lòng chọn thời gian tiêm chủng" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn thời gian tiêm chủng"
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
            <Checkbox
              checked={includeAllStudents}
              onChange={(e) => setIncludeAllStudents(e.target.checked)}
            >
              Bao gồm tất cả học sinh trong khối/lớp được chọn
            </Checkbox>
          </Form.Item>

          {!includeAllStudents && (
            <>
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
            </>
          )}

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ minWidth: 200 }}
            >
              Tạo Chiến Dịch & Lịch Tiêm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateVaccineSchedule; 