import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, message, Select, Typography, Space, Empty, Divider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircleOutlined,
  ContainerOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

// Import các hàm từ service dashboard
import {
  getCheckupCampaignStatusStatistics,
  getCheckupScheduleStatistics,
  getVaccineLotStatistics,
  getMedicationLotStatistics,
  getCheckupCampaigns,
} from "@/services/dashboardService";

const { Title } = Typography;
const { Option } = Select;

const GeneralDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Stats
  const [campaignStatusStats, setCampaignStatusStats] = useState({});
  const [scheduleStats, setScheduleStats] = useState({});
  const [vaccineStats, setVaccineStats] = useState({});
  const [medicationStats, setMedicationStats] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [campaignsRes, statusStatsRes, vaccineStatsRes, medicationStatsRes] = await Promise.all([
          getCheckupCampaigns({ pageNumber: 1, pageSize: 100 }),
          getCheckupCampaignStatusStatistics(),
          getVaccineLotStatistics(),
          getMedicationLotStatistics(),
        ]);

        setCampaigns(campaignsRes.data?.data || []);
        setCampaignStatusStats(statusStatsRes.data?.data || {});
        setVaccineStats(vaccineStatsRes.data?.data || {});
        setMedicationStats(medicationStatsRes.data?.data || {});

        // Load schedule stats cho chiến dịch đầu tiên nếu có
        if (campaignsRes.data?.data.length > 0) {
          const defaultCampaignId = campaignsRes.data.data[0].id;
          setSelectedCampaign(defaultCampaignId);
          const scheduleStatsRes = await getCheckupScheduleStatistics(defaultCampaignId);
          setScheduleStats(scheduleStatsRes.data?.data || {});
        }
      } catch (err) {
        message.error("Không thể tải dữ liệu dashboard!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCampaignChange = async (campaignId) => {
    setSelectedCampaign(campaignId);
    setLoading(true);
    try {
      const scheduleStatsRes = await getCheckupScheduleStatistics(campaignId);
      setScheduleStats(scheduleStatsRes.data?.data || {});
    } catch (err) {
      message.error("Không thể tải thống kê cho chiến dịch này.");
    } finally {
      setLoading(false);
    }
  };

  const getCampaignStatusChartData = () => {
    return [
      {
        name: "Sắp tới",
        count: campaignStatusStats.Planning || 0,
        fill: "#4096ff",
      },
      {
        name: "Đang diễn ra",
        count: campaignStatusStats.inProgress || 0,
        fill: "#73d13d",
      },
      {
        name: "Đã hoàn thành",
        count: campaignStatusStats.completed || 0,
        fill: "#ffc53d",
      },
      {
        name: "Đã huỷ",
        count: campaignStatusStats.cancelled || 0,
        fill: "#f5222d",
      },
    ];
  };

  const getVaccineLotChartData = () => {
    return [
      {
        name: "Đang hoạt động",
        count: vaccineStats.activeLots || 0,
        fill: "#52c41a",
      },
      {
        name: "Sắp hết hạn",
        count: vaccineStats.expiringInNext30Days || 0,
        fill: "#faad14",
      },
      {
        name: "Đã hết hạn",
        count: vaccineStats.expiredLots || 0,
        fill: "#f5222d",
      },
    ];
  };

  const getMedicationLotChartData = () => {
    return [
      {
        name: "Đang hoạt động",
        count: medicationStats.activeLots || 0,
        fill: "#52c41a",
      },
      {
        name: "Sắp hết hạn",
        count: medicationStats.expiringInNext30Days || 0,
        fill: "#faad14",
      },
      {
        name: "Đã hết hạn",
        count: medicationStats.expiredLots || 0,
        fill: "#f5222d",
      },
    ];
  };

  const getRecordStatusChartData = () => {
    const pending = scheduleStats.Pending || 0;
    const completed = scheduleStats.Completed || 0;
    const total = pending + completed;
    if (total === 0) return [];
    return [
      { name: "Đã có hồ sơ", value: completed, color: "#1890ff" },
      { name: "Chưa có hồ sơ", value: pending, color: "#faad14" },
    ];
  };

  const getParentConsentChartData = () => {
    const pending = scheduleStats.Pending || 0;
    const total = pending; // Giả định chỉ có pending
    if (total === 0) return [];
    return [{ name: "Chưa phản hồi", value: pending, color: "#d9d9d9" }];
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Dashboard Tổng Quan</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="center">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <Statistic title="Tổng số lô Vaccine" value={vaccineStats.totalLots || 0} prefix={<ContainerOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="Tổng số lô Thuốc"
              value={medicationStats.totalLots || 0}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="Tổng số lượng Vaccine"
              value={vaccineStats.totalQuantity || 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="Lô thuốc sắp hết hạn"
              value={medicationStats.expiringInNext30Days || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê trạng thái chiến dịch" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCampaignStatusChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Thống kê trạng thái lô Vaccine" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getVaccineLotChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Thống kê trạng thái lô Thuốc" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMedicationLotChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <Title level={5} style={{ margin: 0 }}>
                  Tình trạng khám sức khoẻ
                </Title>
                <Select
                  value={selectedCampaign}
                  onChange={handleCampaignChange}
                  style={{ width: 200 }}
                  placeholder="Chọn chiến dịch"
                  loading={loading}
                >
                  {campaigns.map((camp) => (
                    <Option key={camp.id} value={camp.id}>
                      {camp.name}
                    </Option>
                  ))}
                </Select>
              </Space>
            }
            loading={loading}
          >
            {selectedCampaign ? (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ textAlign: "center" }}>
                    Tình trạng hồ sơ
                  </Title>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getRecordStatusChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {getRecordStatusChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ textAlign: "center" }}>
                    Phụ huynh đồng ý
                  </Title>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getParentConsentChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {getParentConsentChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            ) : (
              <Empty description="Vui lòng chọn một chiến dịch" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralDashboard;
