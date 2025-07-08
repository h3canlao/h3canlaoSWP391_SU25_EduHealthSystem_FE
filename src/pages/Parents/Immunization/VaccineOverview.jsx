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
    fetchPendingVaccines();
    fetchUpcomingVaccines();
    // eslint-disable-next-line
  }, []);

  const fetchPendingVaccines = async () => {
    setLoadingPending(true);
    try {
      const token = getAccessToken();
      const res = await getListOfVaccines(token);
      setPendingVaccines(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setPendingVaccines([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchUpcomingVaccines = async () => {
    setLoadingUpcoming(true);
    try {
      const token = getAccessToken();
      const res = await getUpcomingVaccines(token);
      setUpcomingVaccines(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setUpcomingVaccines([]);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  const handleCardClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  const getStatusTag = (statusName) => {
    switch (statusName) {
      case 'PendingConsent':
        return <Tag color="warning">Chờ xác nhận</Tag>;
      case 'Confirmed':
        return <Tag color="success">Đã xác nhận</Tag>;
      case 'Declined':
        return <Tag color="error">Đã từ chối</Tag>;
      default:
        return <Tag>{statusName}</Tag>;
    }
  };

  return (
    <div className="vaccine-outer-container">
      <div className="vaccine-inner-container">
        <div className="medication-header-row">
          <Title level={2} className="vaccine-title">Lịch Tiêm Chủng</Title>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "pending",
              label: "Chưa xác nhận",
              children: loadingPending ? (
                <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
              ) : pendingVaccines.length === 0 ? (
                <Empty description="Không có lịch chưa xác nhận." />
              ) : (
                <div style={{ maxHeight: 'calc(93vh - 200px)', overflowY: 'auto', paddingRight: 8 }}>
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
                        <div className="vaccine-name">{vaccine.campaignName} - {vaccine.vaccinationTypeName}</div>
                        <div><b>Thời gian dự kiến:</b> {vaccine.scheduledAt ? new Date(vaccine.scheduledAt).toLocaleString() : '-'}</div>
                        <div><b>Hạn xác nhận:</b> {vaccine.consentDeadline ? new Date(vaccine.consentDeadline).toLocaleString() : '-'}</div>
                        <div><b>Số học sinh:</b> {vaccine.students?.length || 0}</div>
                        <div className="vaccine-status-container">{getStatusTag(vaccine.actionStatusName)}</div>
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
            {
              key: "upcoming",
              label: "Lịch tiêm sắp tới",
              children: loadingUpcoming ? (
                <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
              ) : upcomingVaccines.length === 0 ? (
                <Empty description="Không có lịch sắp tới." />
              ) : (
                <div style={{ maxHeight: 'calc(93vh - 200px)', overflowY: 'auto', paddingRight: 8 }}>
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
                        <div className="vaccine-name">{vaccine.campaignName} - {vaccine.vaccinationTypeName}</div>
                        <div><b>Thời gian dự kiến:</b> {vaccine.scheduledAt ? new Date(vaccine.scheduledAt).toLocaleString() : '-'}</div>
                        <div><b>Hạn xác nhận:</b> {vaccine.consentDeadline ? new Date(vaccine.consentDeadline).toLocaleString() : '-'}</div>
                        <div><b>Số học sinh:</b> {vaccine.students?.length || 0}</div>
                        <div className="vaccine-status-container">{getStatusTag(vaccine.actionStatusName)}</div>
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
          ]}
        />
        <ModalVaccine
          show={showModal}
          setShow={setShowModal}
          vaccineData={selectedVaccine}
          resetData={() => setSelectedVaccine(null)}
        />
      </div>
    </div>
  );
};

export default VaccineOverview;