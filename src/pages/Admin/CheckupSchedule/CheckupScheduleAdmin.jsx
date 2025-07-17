import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  message,
  Space,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getCheckupSchedules,
  createCheckupSchedule,
  updateCheckupSchedule,
  deleteCheckupSchedules,
  getDeletedCheckupSchedules,
  restoreCheckupSchedules,
  updateStatusCheckupSchedules,
  getCheckupScheduleById,
} from "@/services/checkupSchedule";
import { getGrades, getStudents, getSections } from "@/services/vaccinationHelperApi"; // Giả định có file này để lấy các danh sách cần thiết
import { getCheckupCampaigns } from "@/services/checkupCampaignApi"; // Giả định có file này
import { useNavigate } from "react-router-dom";
import CheckupScheduleCreateModal from "./CheckupScheduleCreateModal";

const { Title } = Typography;
const { Option } = Select;

const statusOptions = [
  { value: 0, label: "Chưa bắt đầu", color: "default" },
  { value: 1, label: "Đang diễn ra", color: "blue" },
  { value: 2, label: "Đã hoàn thành", color: "green" },
  { value: 3, label: "Đã huỷ", color: "red" },
];

const parentConsentOptions = {
  0: { label: "Chưa có sự đồng ý", color: "default" },
  1: { label: "Đã đồng ý", color: "success" },
  2: { label: "Không đồng ý", color: "error" },
};

const CheckupScheduleAdmin = () => {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [campaignFilter, setCampaignFilter] = useState(undefined);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterType, setFilterType] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const navigate = useNavigate();

  // Lấy danh sách campaign cho filter
  useEffect(() => {
    (async () => {
      try {
        const res = await getCheckupCampaigns({ pageNumber: 1, pageSize: 100 });
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
        res = await getDeletedCheckupSchedules(query);
      } else {
        res = await getCheckupSchedules(query);
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

  useEffect(() => {
    fetchData({ current: 1, searchTerm, status: statusFilter });
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [filterType, statusFilter, searchTerm, campaignFilter, startDate, endDate]);

  // Xóa batch (nhiều id)
  const handleDelete = async (ids) => {
    try {
      await deleteCheckupSchedules(ids);
      message.success("Xóa thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  // Khôi phục đã xóa
  const handleRestore = async (ids) => {
    if (!ids.length) return message.warning("Chọn lịch để khôi phục");
    try {
      await restoreCheckupSchedules(ids);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Khôi phục thất bại!");
    }
  };

  const columns = [
    {
      title: "Chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
      responsive: ["md"],
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
      responsive: ["sm"],
      render: (text, record) => (
        <>
          <p style={{ margin: 0, fontWeight: "bold" }}>{text}</p>
          <p style={{ margin: 0, color: "#888" }}>{record.studentCode}</p>
        </>
      ),
    },
    {
      title: "Khối/Lớp",
      dataIndex: "grade",
      key: "grade",
      render: (text, record) => `${text} / ${record.section}`,
      responsive: ["md"],
    },
    {
      title: "Thời gian",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Đồng ý từ PH",
      dataIndex: "parentConsentStatus",
      key: "parentConsentStatus",
      render: (status) => {
        const option = parentConsentOptions[status];
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: "Hồ sơ",
      dataIndex: "hasRecord",
      key: "hasRecord",
      render: (hasRecord) => <Tag color={hasRecord ? "green" : "red"}>{hasRecord ? "Đã có" : "Chưa có"}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/admin/manage-checkupSchedule/${record.id}`)}>
            Chi tiết
          </Button>
          <Popconfirm title="Xác nhận xóa lịch khám này?" onConfirm={() => handleDelete([record.id])}>
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
    fetchData({
      current: pag.current,
      pageSize: pag.pageSize,
      searchTerm,
      status: statusFilter,
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={<Title level={3}>Quản lý Lịch Khám Sức Khoẻ</Title>}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={filterType === "deleted"}
              onClick={() => setCreateModalOpen(true)}
            >
              Thêm mới
            </Button>
            <Button
              type={filterType === "deleted" ? "primary" : "default"}
              icon={<RedoOutlined />}
              onClick={() => setFilterType((prev) => (prev === "deleted" ? "all" : "deleted"))}
            >
              Xem lịch đã xóa
            </Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Tìm theo mã HS, tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 220 }}
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
          <DatePicker allowClear placeholder="Đến ngày" style={{ width: 140 }} value={endDate} onChange={setEndDate} />
          <Button
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
        </Space>
        {filterType === "deleted" && (
          <div style={{ marginBottom: 16 }}>
            <Button onClick={() => handleRestore(selectedRowKeys)} disabled={!selectedRowKeys.length} type="primary">
              Khôi phục đã chọn
            </Button>
            <Popconfirm
              title="Xác nhận xóa vĩnh viễn các mục đã chọn?"
              onConfirm={() => message.info("Chức năng xóa vĩnh viễn chưa được hỗ trợ")}
            >
              <Button danger style={{ marginLeft: 8 }}>
                Xóa vĩnh viễn
              </Button>
            </Popconfirm>
          </div>
        )}
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
      </Card>
      <CheckupScheduleCreateModal
        visible={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  );
};

export default CheckupScheduleAdmin;
