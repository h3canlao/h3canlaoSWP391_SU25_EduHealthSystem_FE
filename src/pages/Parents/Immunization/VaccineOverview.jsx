import React, { useState, useEffect } from "react";
import { List, Tag, Button, Typography, Spin, Empty, Tabs, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ModalVaccine from "./ModalVaccine";
import { getUpcomingVaccines, getListOfVaccines } from "@/services/apiServices";
import { getAccessToken } from "@/services/handleStorageApi";
import "./VaccineOverview.css";

const { Title } = Typography;

const VaccineOverview = () => {
  const [pendingVaccines, setPendingVaccines] = useState([]);
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchPending = async () => {
      setLoadingPending(true);
      try {
        const token = getAccessToken();
        const res = await getListOfVaccines(token);
        if (res.data && res.data.isSuccess && Array.isArray(res.data.data)) {
          setPendingVaccines(res.data.data);
        } else {
          setPendingVaccines([]);
        }
      } catch (error) {
        setPendingVaccines([]);
        message.error(error?.response?.data?.message || "Lỗi lấy lịch chưa xác nhận!");
      } finally {
        setLoadingPending(false);
      }
    };
    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const token = getAccessToken();
        const res = await getUpcomingVaccines(token);
        if (res.data && res.data.isSuccess && Array.isArray(res.data.data)) {
          setUpcomingVaccines(res.data.data);
        } else {
          setUpcomingVaccines([]);
        }
      } catch (error) {
        setUpcomingVaccines([]);
        message.error(error?.response?.data?.message || "Lỗi lấy lịch sắp tới!");
      } finally {
        setLoadingUpcoming(false);
      }
    };
    fetchPending();
    fetchUpcoming();
    // expose for child
    VaccineOverview.fetchPending = fetchPending;
    VaccineOverview.fetchUpcoming = fetchUpcoming;
  }, []);

  // Callback cho modal gọi lại khi xác nhận/từ chối thành công
  const handleActionSuccess = () => {
    VaccineOverview.fetchPending();
    VaccineOverview.fetchUpcoming();
  };

  const handleCardClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  const resetModalData = () => {
    setSelectedVaccine(null);
  };

  const getStatusTag = (statusName) => {
    switch (statusName) {
      case "Pending":
      case "PendingConsent":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chờ xác nhận
          </Tag>
        );
      case "Approved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã đồng ý
          </Tag>
        );
      case "Delivered":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã hoàn thành
          </Tag>
        );
      case "Declined":
      case "Rejected":
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="error">
            Đã từ chối
          </Tag>
        );
      default:
        return <Tag color="default">{statusName}</Tag>;
    }
  };

  return (
    <div className="vaccine-container">
      <Title level={2} className="vaccine-title">
        Lịch Tiêm Chủng
      </Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "pending",
            label: "Chưa xác nhận",
            children: loadingPending ? (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <Spin size="large" />
              </div>
            ) : pendingVaccines.length === 0 ? (
              <Empty description="Không có lịch chưa xác nhận." />
            ) : (
              <List
                className="vaccine-list"
                itemLayout="vertical"
                dataSource={pendingVaccines}
                renderItem={(vaccine) => (
                  <List.Item
                    className="vaccine-list-item"
                    onClick={() => handleCardClick(vaccine)}
                    actions={[
                      <Button type="text" icon={<InfoCircleOutlined />}>Xem chi tiết</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span className="vaccine-name">
                          {vaccine.campaignName} - {vaccine.vaccinationTypeName}
                        </span>
                      }
                      description={
                        <>
                          <div>
                            <b>Thời gian dự kiến:</b> {new Date(vaccine.scheduledAt).toLocaleString()}
                          </div>
                          <div>
                            <b>Hạn xác nhận:</b> {vaccine.consentDeadline ? new Date(vaccine.consentDeadline).toLocaleString() : "-"}
                          </div>
                          <div>
                            <b>Số học sinh:</b> {vaccine.students?.length || 0}
                          </div>
                        </>
                      }
                    />
                    <div className="vaccine-status-container">
                      {getStatusTag(vaccine.actionStatusName)}
                    </div>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "upcoming",
            label: "Lịch tiêm sắp tới",
            children: loadingUpcoming ? (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <Spin size="large" />
              </div>
            ) : upcomingVaccines.length === 0 ? (
              <Empty description="Không có lịch sắp tới." />
            ) : (
              <List
                className="vaccine-list"
                itemLayout="vertical"
                dataSource={upcomingVaccines}
                renderItem={(vaccine) => (
                  <List.Item
                    className="vaccine-list-item"
                    onClick={() => handleCardClick(vaccine)}
                    actions={[
                      <Button type="text" icon={<InfoCircleOutlined />}>Xem chi tiết</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span className="vaccine-name">
                          {vaccine.campaignName} - {vaccine.vaccinationTypeName}
                        </span>
                      }
                      description={
                        <>
                          <div>
                            <b>Thời gian dự kiến:</b> {new Date(vaccine.scheduledAt).toLocaleString()}
                          </div>
                          <div>
                            <b>Hạn xác nhận:</b> {vaccine.consentDeadline ? new Date(vaccine.consentDeadline).toLocaleString() : "-"}
                          </div>
                          <div>
                            <b>Số học sinh:</b> {vaccine.students?.length || 0}
                          </div>
                        </>
                      }
                    />
                    <div className="vaccine-status-container">
                      {getStatusTag(vaccine.actionStatusName)}
                    </div>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
      <ModalVaccine
        show={showModal}
        setShow={setShowModal}
        vaccineData={selectedVaccine}
        resetData={resetModalData}
        onActionSuccess={handleActionSuccess}
      />
    </div>
  );
};

export default VaccineOverview;