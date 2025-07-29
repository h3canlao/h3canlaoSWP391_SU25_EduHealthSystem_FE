import React, { useEffect, useState } from 'react';
import { getCheckupRecordsByStaffId } from '../../services/apiServices';
import { FaUser, FaRuler, FaWeight, FaEye, FaHeartbeat, FaCheck, FaExclamation, FaComments, FaStethoscope, FaCalendar, FaClock } from 'react-icons/fa';
import './HealthCheckups/HealthCheckups.css';

function getUserIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.userId || payload.sub || '';
  } catch {
    return '';
  }
}

const statusMap = {
  0: { text: 'Chờ khám', color: '#1976d2' },
  1: { text: 'Hoàn thành', color: '#52c41a' },
  2: { text: 'Cần tái khám', color: '#faad14' },
  3: { text: 'Chuyển viện', color: '#e53e3e' },
};

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const nurseId = getUserIdFromToken();

  useEffect(() => {
    if (nurseId) fetchRecords();
    // eslint-disable-next-line
  }, [nurseId]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getCheckupRecordsByStaffId(nurseId);
      if (res.data.isSuccess) setRecords(res.data.data || []);
      else setRecords([]);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const calcBMI = (h, w) => {
    if (!h || !w) return '';
    const m = Number(h) / 100;
    if (!m) return '';
    return (Number(w) / (m * m)).toFixed(1);
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Tổng quan thống kê
  const total = records.length;
  const abnormal = records.filter(r => r.status === 2).length;
  const needConsult = records.filter(r => r.counselingAppointments && r.counselingAppointments.length > 0).length;
  const sent = records.filter(r => r.examinedAt).length;

  return (
    <div className="health-checkups-container">
      <div className="health-checkups-header">
        <div className="header-content">
          <h1><FaHeartbeat className="header-icon" />Dashboard Sức Khỏe Học Sinh</h1>
          <p>Tổng quan kết quả khám sức khỏe học sinh bạn đã thực hiện</p>
        </div>
      </div>
      <div className="dashboard-summary-row" style={{display:'flex',gap:16,marginBottom:16}}>
        <div className="dashboard-summary-card" style={{flex:1,background:'#fff',borderRadius:8,padding:'16px 12px',boxShadow:'0 2px 8px #e3e3e3'}}>
          <div style={{fontWeight:600,fontSize:16,color:'#1976d2'}}>Tổng số học sinh đã khám</div>
          <div style={{fontSize:28,fontWeight:700,color:'#1976d2'}}>{total}</div>
        </div>
        <div className="dashboard-summary-card" style={{flex:1,background:'#fff',borderRadius:8,padding:'16px 12px',boxShadow:'0 2px 8px #e3e3e3'}}>
          <div style={{fontWeight:600,fontSize:16,color:'#faad14'}}>Số ca bất thường</div>
          <div style={{fontSize:28,fontWeight:700,color:'#faad14'}}>{abnormal}</div>
        </div>
        <div className="dashboard-summary-card" style={{flex:1,background:'#fff',borderRadius:8,padding:'16px 12px',boxShadow:'0 2px 8px #e3e3e3'}}>
          <div style={{fontWeight:600,fontSize:16,color:'#00bcd4'}}>Cần tư vấn</div>
          <div style={{fontSize:28,fontWeight:700,color:'#00bcd4'}}>{needConsult}</div>
        </div>
        <div className="dashboard-summary-card" style={{flex:1,background:'#fff',borderRadius:8,padding:'16px 12px',boxShadow:'0 2px 8px #e3e3e3'}}>
          <div style={{fontWeight:600,fontSize:16,color:'#52c41a'}}>Đã gửi kết quả</div>
          <div style={{fontSize:28,fontWeight:700,color:'#52c41a'}}>{sent}</div>
        </div>
      </div>
      <div className="health-checkups-content">
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div><p>Đang tải kết quả...</p></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <FaHeartbeat className="empty-icon" />
            <h3>Chưa có kết quả khám nào</h3>
            <p>Hiện tại chưa có kết quả khám sức khỏe nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper" style={{overflowX:'auto',background:'#fff',borderRadius:12,padding:8,boxShadow:'0 2px 8px #e3e3e3'}}>
            <table className="dashboard-table" style={{width:'100%',borderCollapse:'collapse',fontSize:'1rem'}}>
              <thead>
                <tr style={{background:'#1976d2',color:'#fff'}}>
                  <th style={{padding:'10px 8px'}}>Mã học sinh</th>
                  <th>Chiều cao (cm)</th>
                  <th>Cân nặng (kg)</th>
                  <th>BMI</th>
                  <th>Thị lực T/P</th>
                  <th>Huyết áp</th>
                  <th>Trạng thái</th>
                  <th>Kết quả gửi</th>
                  <th>Tư vấn</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => {
                  const bmi = calcBMI(rec.heightCm, rec.weightKg);
                  const abnormal = rec.status === 2;
                  return (
                    <React.Fragment key={rec.id}>
                      <tr style={abnormal ? {background:'#fffbe6'} : {}}>
                        <td style={{fontWeight:600}}>{rec.studentId?.slice(0,8)}...</td>
                        <td>{rec.heightCm || ''}</td>
                        <td>{rec.weightKg || ''}</td>
                        <td>
                          {bmi && (
                            <span style={{background: abnormal ? '#faad14' : '#52c41a',color:'#fff',padding:'2px 8px',borderRadius:4,fontWeight:600}}>{bmi}</span>
                          )}
                        </td>
                        <td>{rec.visionLeft && rec.visionRight ? `${rec.visionLeft} / ${rec.visionRight}` : ''}</td>
                        <td>{rec.bloodPressureDiastolic ? `${rec.bloodPressureDiastolic}` : ''}</td>
                        <td>
                          <span style={{background: statusMap[rec.status]?.color, color:'#fff',padding:'2px 8px',borderRadius:4,fontWeight:600}}>
                            {statusMap[rec.status]?.text || 'Không rõ'}
                          </span>
                        </td>
                        <td>
                          <span style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{background:'#52c41a',color:'#fff',padding:'2px 8px',borderRadius:4,fontWeight:600,display:'inline-block'}}>Đã gửi</span>
                            <span style={{color:'#222',fontWeight:500}}>{formatDate(rec.examinedAt)}</span>
                          </span>
                        </td>
                        <td>
                          {rec.counselingAppointments && rec.counselingAppointments.length > 0 ? (
                            <span style={{background:'#00bcd4',color:'#fff',padding:'2px 8px',borderRadius:4,fontWeight:600}}>
                              Cần tư vấn: {rec.counselingAppointments.map((id,i)=>(<span key={id}>{i>0?', ':''}{id.slice(0,8)}...</span>))}
                            </span>
                          ) : 'Không'}
                        </td>
                      </tr>
                      {rec.remarks && (
                        <tr>
                          <td colSpan={9} style={{background:'#f5f5f5',color:'#333',fontStyle:'italic',paddingLeft:16}}>
                            Ghi chú: {rec.remarks}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 