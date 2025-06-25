import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import {
  getVaccinationSchedules,
  createVaccinationSchedule,
  updateVaccinationSchedule,
  deleteVaccinationSchedules,
  getDeletedVaccinationSchedules,
  restoreVaccinationSchedules,
  updateStatusVaccinationSchedules,
} from "@/services/vaccinationSchedule";
import { getGrades, getStudentsByGradeSection } from "@/services/vaccinationHelperApi";

const statusOptions = [
  { value: 0, label: "Chưa bắt đầu", color: "default" },
  { value: 1, label: "Đang diễn ra", color: "blue" },
  { value: 2, label: "Đã hoàn thành", color: "green" },
  { value: 3, label: "Đã huỷ", color: "red" },
];

const defaultForm = {
  startDate: null,
  endDate: null,
  description: "",
};

const VaccinationScheduleAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterType, setFilterType] = useState("all");
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState(["1A"]); // hardcoded unless dynamic
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      let res;
      if (filterType === "deleted") {
        res = await getDeletedVaccinationSchedules({
          pageNumber: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        });
      } else {
        res = await getVaccinationSchedules({
          pageNumber: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
          status: params.status !== undefined ? params.status : statusFilter,
        });
      }
      setData(res.data.data || []);
      setPagination(prev => ({
        ...prev,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res.data.totalRecords || 100,
      }));
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Không tải được dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData({ current: 1, searchTerm, status: statusFilter });
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [filterType, statusFilter, searchTerm]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedGrade && selectedSection) {
        try {
          const res = await getStudentsByGradeSection([selectedGrade], [selectedSection]);
          setStudents(res.data.data || []);
        } catch {
          message.error("Không tải được danh sách học sinh");
        }
      }
    };
    fetchStudents();
  }, [selectedGrade, selectedSection]);

  const columns = [
    { title: "Loại tiêm", dataIndex: "vaccinationTypeName", key: "vaccinationTypeName" },
    {
      title: "Thời gian dự kiến",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: v => v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "scheduleStatus",
      key: "scheduleStatus",
      render: status => {
        const option = statusOptions.find(s => s.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    { title: "Tổng HS", dataIndex: "totalStudents", key: "totalStudents" },
    { title: "Hoàn thành", dataIndex: "completedRecords", key: "completedRecords" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Chi tiết</Button>
          <Popconfirm
            title="Xác nhận xóa lịch tiêm này?"
            onConfirm={() => handleDelete([record.id])}
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({ current: pag.current, pageSize: pag.pageSize, searchTerm, status: statusFilter });
  };

  const openModal = async (record = null) => {
    setEditing(record ? record.id : null);
    await loadGrades();
    setModalVisible(true);
  };

  const loadGrades = async () => {
    try {
      const res = await getGrades();
      setGrades(res.data.data || []);
    } catch {
      message.error("Không tải được danh sách khối");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        scheduledAt: values.startDate?.toISOString(),
        studentIds: selectedStudentIds,
        notes: values.description,
      };
      await createVaccinationSchedule(payload);
      message.success("Lịch tiêm đã được tạo!");
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (ids) => {
    try {
      await deleteVaccinationSchedules(ids);
      message.success("Xóa thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {filterType === "all" && (
          <>
            <Input
              placeholder="Tìm lịch tiêm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onPressEnter={() => setPagination(prev => ({ ...prev, current: 1 }))}
              style={{ width: 200 }}
            />
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 180 }}
              value={statusFilter}
              onChange={val => setStatusFilter(val)}
              options={statusOptions}
            />
            <Button type="primary" onClick={() => {
              setSearchTerm("");
              setStatusFilter(undefined);
              setFilterType("all");
              setPagination(prev => ({ ...prev, current: 1 }));
            }}>Xóa lọc</Button>
          </>
        )}
        <Button
          type={filterType === "deleted" ? "primary" : "default"}
          onClick={() => setFilterType(prev => prev === "deleted" ? "all" : "deleted")}
        >
          Xem lịch đã xóa
        </Button>
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới lịch tiêm
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        open={modalVisible}
        title={editing ? "Cập nhật lịch tiêm" : "Thêm mới lịch tiêm"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={defaultForm}>
          <Form.Item name="grade" label="Khối">
            <Select
              options={grades.map(g => ({ value: g, label: `Khối ${g}` }))}
              onChange={val => {
                setSelectedGrade(val);
                setSelectedSection(undefined);
              }}
            />
          </Form.Item>
          <Form.Item name="section" label="Lớp">
            <Select
              value={selectedSection}
              options={sections.map(s => ({ value: s, label: `Lớp ${s}` }))}
              onChange={val => setSelectedSection(val)}
            />
          </Form.Item>
          <Form.Item label="Chọn học sinh">
            <Select
              mode="multiple"
              options={students.map(st => ({
                value: st.id,
                label: `${st.lastName} ${st.firstName} (${st.studentCode})`,
              }))}
              value={selectedStudentIds}
              onChange={setSelectedStudentIds}
              allowClear
              showSearch
              placeholder="Chọn học sinh"
            />
          </Form.Item>
          <Form.Item name="startDate" label="Thời gian tiêm" rules={[{ required: true }]}>  
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VaccinationScheduleAdmin;