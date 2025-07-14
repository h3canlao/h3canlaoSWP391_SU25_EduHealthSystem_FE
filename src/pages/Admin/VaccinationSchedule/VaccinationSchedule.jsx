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
  getVaccinationScheduleById,
} from "@/services/vaccinationSchedule";
import { getGrades, getStudents } from "@/services/vaccinationHelperApi";
import { getVaccinationCampaigns } from "@/services/vaccinationCampaignApi";
import { useNavigate } from "react-router-dom";
import VaccinationScheduleCreateModal from "./Modal";

const statusOptions = [
  { value: 0, label: "Chưa bắt đầu", color: "default" },
  { value: 1, label: "Đang diễn ra", color: "blue" },
  { value: 2, label: "Đã hoàn thành", color: "green" },
  { value: 3, label: "Đã huỷ", color: "red" },
];

const defaultForm = {
  vaccinationTypeId: null,
  scheduledAt: null,
  studentIds: [],
  notes: "",
};

const VaccinationScheduleAdmin = () => {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [campaignFilter, setCampaignFilter] = useState(undefined);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterType, setFilterType] = useState("all");
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();
const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Lấy danh sách campaign cho filter
  useEffect(() => {
    (async () => {
      try {
        const res = await getVaccinationCampaigns({ pageNumber: 1, pageSize: 100 });
        setCampaigns(res.data?.data || []);
      } catch {
        setCampaigns([]);
      }
    })();
  }, []);

  // Lấy danh sách schedule
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      let query = {
        pageNumber: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        status: params.status !== undefined ? params.status : statusFilter,
        campaignId: campaignFilter,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      };
      let res;
      if (filterType === "deleted") {
        res = await getDeletedVaccinationSchedules(query);
      } else {
        res = await getVaccinationSchedules(query);
      }
      setData(res.data.data || []);
      setPagination((prev) => ({
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

  // Lấy grades, students cho modal
  const loadGrades = async () => {
    try {
      const res = await getGrades();
      setGrades(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được danh sách khối");
    }
  };
  const loadStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được danh sách học sinh");
    }
  };

  useEffect(() => {
    fetchData({ current: 1, searchTerm, status: statusFilter });
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadGrades();
    loadStudents();
    // eslint-disable-next-line
  }, [filterType, statusFilter, searchTerm, campaignFilter, startDate, endDate]);


  // Sửa hoặc xem detail
  const openModal = async (record = null) => {
    setEditing(record ? record.id : null);
    form.resetFields();
    if (record) {
      try {
        const res = await getVaccinationScheduleById(record.id);
        const detail = res.data;
        form.setFieldsValue({
          vaccinationTypeId: detail.vaccinationTypeId,
          scheduledAt: detail.scheduledAt ? dayjs(detail.scheduledAt) : null,
          notes: detail.notes,
        });
        setSelectedStudentIds(detail.studentIds || []);
      } catch {
        message.error("Không lấy được thông tin chi tiết!");
        return;
      }
    } else {
      form.setFieldsValue(defaultForm);
      setSelectedStudentIds([]);
    }
    setModalVisible(true);
  };

  // Tạo hoặc cập nhật
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        vaccinationTypeId: values.vaccinationTypeId,
        scheduledAt: values.scheduledAt?.toISOString(),
        studentIds: selectedStudentIds,
        notes: values.notes,
      };
      if (editing) {
        await updateVaccinationSchedule(editing, payload);
        message.success("Cập nhật thành công!");
      } else {
        await createVaccinationSchedule(payload);
        message.success("Tạo mới thành công!");
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Có lỗi xảy ra!");
    }
  };

  // Xóa batch (nhiều id)
  const handleDelete = async (ids) => {
    try {
      await deleteVaccinationSchedules(ids, true);
      message.success("Xóa thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  // Khôi phục đã xóa
  const handleRestore = async (ids) => {
  if (!ids.length) return message.warning("Chọn lịch để khôi phục");
  try {
    await restoreVaccinationSchedules(ids);
    message.success("Khôi phục thành công!");
    setSelectedRowKeys([]);
    fetchData();
  } catch (err) {
    message.error(err?.response?.data?.message ?? "Khôi phục thất bại!");
  }
};


  // Thay đổi trạng thái
  const handleUpdateStatus = async (ids, status) => {
    try {
      await updateStatusVaccinationSchedules(ids, status);
      message.success("Cập nhật trạng thái thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Cập nhật trạng thái thất bại!");
    }
  };

  const columns = [
    { title: "Loại vaccine", dataIndex: "vaccinationTypeName", key: "vaccinationTypeName" },
    {
      title: "Thời gian dự kiến",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "scheduleStatus",
      key: "scheduleStatus",
      render: (status) => {
        const option = statusOptions.find((s) => s.value === status);
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
          <Button type="link" onClick={() => navigate(`/admin/manage-vaccinationSchedule/${record.id}`)}>
            Chi tiết
          </Button>
          <Button type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa lịch tiêm này?"
            onConfirm={() => handleDelete([record.id])}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({ current: pag.current, pageSize: pag.pageSize, searchTerm, status: statusFilter });
  };

  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          placeholder="Tìm lịch tiêm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Chiến dịch"
          style={{ width: 180 }}
          value={campaignFilter}
          onChange={setCampaignFilter}
          options={campaigns.map((x) => ({ value: x.id, label: x.name }))}
          showSearch
        />
        <DatePicker
          allowClear
          placeholder="Từ ngày"
          style={{ width: 140 }}
          value={startDate}
          onChange={setStartDate}
        />
        <DatePicker
          allowClear
          placeholder="Đến ngày"
          style={{ width: 140 }}
          value={endDate}
          onChange={setEndDate}
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
        <Button
          type="primary"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter(undefined);
            setCampaignFilter(undefined);
            setStartDate(null);
            setEndDate(null);
            setFilterType("all");
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        >
          Xóa lọc
        </Button>
        <Button
  type={filterType === "deleted" ? "primary" : "default"}
  onClick={() => setFilterType(prev => prev === "deleted" ? "all" : "deleted")}
>
  Xem lịch đã xóa
</Button>
        <Button type="primary" disabled={filterType === "deleted"} onClick={() => setCreateModalOpen(true)}>
          Thêm mới lịch tiêm
        </Button>
        {filterType === "deleted" && (
  <Button
    onClick={() => handleRestore(selectedRowKeys)}
    disabled={!selectedRowKeys.length}
    type="primary"
  >
    Khôi phục đã chọn
  </Button>
)}
      </Space>
     <Table
  rowKey="id"
  loading={loading}
  columns={columns}
  dataSource={data}
  pagination={pagination}
  onChange={handleTableChange}
  rowSelection={
    filterType === "deleted"
      ? {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }
      : undefined
  }
/>


      {/* Modal thêm/sửa lịch tiêm */}
      <VaccinationScheduleCreateModal
        visible={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  );
};

export default VaccinationScheduleAdmin;
