import React, { useEffect, useState } from 'react';
import { getAllVaccinationRecords } from '../../../services/apiServices';
import { Card, Spin, Empty, Tag, Input, Typography } from 'antd';
import { MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const statusMap = {
  Completed: { color: 'green', text: 'Hoàn thành' },
  Pending: { color: 'orange', text: 'Chờ tiêm' },
  Cancelled: { color: 'red', text: 'Đã huỷ' },
};

export default function VaccinationRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Tải dữ liệu khi component mount
  useEffect(() => {
    setLoading(true);
    getAllVaccinationRecords()
      .then(res => setRecords(res.data.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filtered = records.filter(r =>
    r.studentName?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(
      search.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    )
  );

  return (
    <div className="health-checkups-container">
      <div className="health-checkups-header">
        <div className="header-content">
          <Title level={3} style={{ color: '#4FC3F7', marginBottom: 0 }}><MedicineBoxOutlined /> Theo dõi phiếu tiêm chủng</Title>
          <p>Danh sách toàn bộ phiếu tiêm chủng của học sinh</p>
        </div>
      </div>
      <div className="health-checkups-content">
        <Input
          placeholder="Tìm kiếm tên học sinh..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 20, maxWidth: 350 }}
          allowClear
        />
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div><p>Đang tải phiếu tiêm...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <MedicineBoxOutlined className="empty-icon" />
            <h3>Chưa có phiếu tiêm nào</h3>
            <p>Hiện tại chưa có phiếu tiêm chủng nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper" style={{overflowX:'auto',background:'#fff',borderRadius:12,padding:8,boxShadow:'0 2px 8px #e3e3e3'}}>
            <table className="dashboard-table" style={{width:'100%',borderCollapse:'collapse',fontSize:'1rem'}}>
              <thead>
                <tr style={{background:'#1976d2',color:'#fff'}}>
                  <th style={{padding:'10px 8px'}}>Học sinh</th>
                  <th>Mã HS</th>
                  <th>Tên vắc xin</th>
                  <th>Ngày tiêm</th>
                  <th>Người tiêm</th>
                  <th>Trạng thái</th>
                  <th>Theo dõi 24h</th>
                  <th>Theo dõi 72h</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rec => (
                  <tr key={rec.id}>
                    <td><UserOutlined /> {rec.studentName}</td>
                    <td>{rec.studentCode}</td>
                    <td>{rec.vaccineName}</td>
                    <td>{rec.administeredDate ? new Date(rec.administeredDate).toLocaleString('vi-VN') : '-'}</td>
                    <td>{rec.vaccinatedBy || '-'}</td>
                    <td><Tag color={statusMap[rec.sessionStatus]?.color || 'default'}>{statusMap[rec.sessionStatus]?.text || rec.sessionStatus}</Tag></td>
                    <td>{rec.reactionFollowup24h === 'True' ? 'Có' : 'Không'}</td>
                    <td>{rec.reactionFollowup72h === 'True' ? 'Có' : 'Không'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 