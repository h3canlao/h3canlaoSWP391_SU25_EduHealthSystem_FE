import { getVaccinationCampaigns } from "@/services/vaccinationCampaignApi";
import {
  deleteVaccinationSchedules,
  getDeletedVaccinationSchedules,
  getVaccinationSchedules,
  restoreVaccinationSchedules,
} from "@/services/vaccinationSchedule";
import { Button, DatePicker, Input, message, Popconfirm, Select, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VaccinationScheduleModal from "./Modal"; // Đảm bảo tên file Modal là chính xác

const statusOptions = [
  { value: 0, label: "Chưa bắt đầu", color: "default" },
  { value: 1, label: "Đang diễn ra", color: "blue" },
  { value: 2, label: "Đã hoàn thành", color: "green" },
  { value: 3, label: "Đã huỷ", color: "red" },
];

const VaccinationScheduleAdmin = () => {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [campaignFilter, setCampaignFilter] = useState(undefined);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all" hoặc "deleted"

  // State quản lý Modal (đã được tối ưu)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Lấy danh sách chiến dịch cho bộ lọc
  useEffect(() => {
    (async () => {
      try {
        const res = await getVaccinationCampaigns({ pageNumber: 1, pageSize: 10 }); // Lấy nhiều để đủ cho Select
        setCampaigns(res.data?.data || []);
      } catch {
        setCampaigns([]);
        message.error("Không tải được danh sách chiến dịch!");
      }
    })();
  }, []);

  // Lấy danh sách lịch tiêm
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const query = {
        pageNumber: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        searchTerm: params.searchTerm !== undefined ? params.searchTerm : searchTerm,
        status: params.status !== undefined ? params.status : statusFilter,
        campaignId: campaignFilter,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      };
      const res =
        filterType === "deleted" ? await getDeletedVaccinationSchedules(query) : await getVaccinationSchedules(query);

      setData(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res.data.totalRecords || 0,
      }));
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Không tải được dữ liệu lịch tiêm!");
    }
    setLoading(false);
  };

  // Trigger fetchData khi bộ lọc thay đổi
  useEffect(() => {
    fetchData({ current: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, statusFilter, searchTerm, campaignFilter, startDate, endDate]);

  // Hàm mở modal (dùng chung cho cả thêm mới và sửa)
  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // Hàm xóa lịch tiêm
  const handleDelete = async (ids) => {
    try {
      await deleteVaccinationSchedules(ids); // API của bạn có thể cần tham số thứ hai là `true`
      message.success("Xóa thành công!");
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Xóa thất bại!");
    }
  };

  // Hàm khôi phục lịch tiêm
  const handleRestore = async () => {
    if (!selectedRowKeys.length) return message.warning("Chọn lịch để khôi phục");
    try {
      await restoreVaccinationSchedules(selectedRowKeys);
      message.success("Khôi phục thành công!");
      setSelectedRowKeys([]);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message ?? "Khôi phục thất bại!");
    }
  };

  // Hàm xóa bộ lọc
  const handleClearFilter = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setCampaignFilter(undefined);
    setStartDate(null);
    setEndDate(null);
    // Nếu đang xem "đã xóa" thì cũng chuyển về "all"
    if (filterType === "deleted") {
      setFilterType("all");
    }
  };

  // Hàm chuyển đổi chế độ xem (tất cả / đã xóa)
  const handleSetFilterType = (type) => {
    if (filterType !== type) {
      setFilterType(type);
      handleClearFilter(); // Xóa các bộ lọc khác khi chuyển tab
      setFilterType(type); // Gán lại vì handleClearFilter đã reset
    } else {
      setFilterType("all"); // Nhấn lần nữa để quay về
    }
  };

  const columns = [
    { title: "Loại vaccine", dataIndex: "vaccinationTypeName", key: "vaccinationTypeName" },
    {
      title: "Thời gian dự kiến",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "scheduleStatus",
      key: "scheduleStatus",
      render: (status) => {
        const option = statusOptions.find((s) => s.value === status);
        return <Tag color={option?.color}>{option?.label || "Không xác định"}</Tag>;
      },
    },
    { title: "Tổng HS", dataIndex: "totalStudents", key: "totalStudents" },
    { title: "Đã tiêm", dataIndex: "completedRecords", key: "completedRecords" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/admin/manage-vaccinationSchedule/${record.id}`)}>
            Chi tiết
          </Button>
          {filterType !== "deleted" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xác nhận xóa lịch tiêm này?" onConfirm={() => handleDelete([record.id])}>
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pag) => {
    fetchData({ current: pag.current, pageSize: pag.pageSize });
  };

  return (
    <div style={{ margin: "0 24px" }}>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          placeholder="Tìm lịch tiêm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Lọc theo chiến dịch"
          style={{ width: 220 }}
          value={campaignFilter}
          onChange={setCampaignFilter}
          options={campaigns.map((x) => ({ value: x.id, label: x.name }))}
          showSearch
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
        />
        <DatePicker allowClear placeholder="Từ ngày" style={{ width: 140 }} value={startDate} onChange={setStartDate} />
        <DatePicker allowClear placeholder="Đến ngày" style={{ width: 140 }} value={endDate} onChange={setEndDate} />
        <Select
          allowClear
          placeholder="Lọc trạng thái"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
        <Button onClick={handleClearFilter}>Xóa lọc</Button>
      </Space>

      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Button type="primary" disabled={filterType === "deleted"} onClick={() => openModal(null)}>
          Thêm mới lịch tiêm
        </Button>
        <Button type={filterType === "deleted" ? "primary" : "default"} onClick={() => handleSetFilterType("deleted")}>
          Xem lịch đã xóa
        </Button>
        {filterType === "deleted" && (
          <Button onClick={handleRestore} disabled={!selectedRowKeys.length} type="primary">
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
        rowSelection={filterType === "deleted" ? { selectedRowKeys, onChange: setSelectedRowKeys } : undefined}
      />

      <VaccinationScheduleModal
        visible={isModalOpen}
        editingRecord={editingRecord}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default VaccinationScheduleAdmin;
