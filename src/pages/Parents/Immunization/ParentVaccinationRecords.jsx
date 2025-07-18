import React, { useEffect, useState } from 'react';
import { getStudentsByParentId, getVaccinationRecordsByStudentId } from '../../../services/apiServices';
import { getUserInfo } from '@/services/handleStorageApi';
import { Card, Spin, Empty, Tag } from 'antd';

const statusMap = {
  Completed: { color: 'success', text: 'Hoàn thành' },
  Pending: { color: 'default', text: 'Chờ tiêm' },
  Cancelled: { color: 'error', text: 'Đã huỷ' },
};

export default function ParentVaccinationRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      const userId = JSON.parse(atob(userInfo.accessToken.split('.')[1]))?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const studentsRes = await getStudentsByParentId(userId);
      const students = Array.isArray(studentsRes.data.data) ? studentsRes.data.data : [];
      const allRecords = [];
      for (const student of students) {
        try {
          const res = await getVaccinationRecordsByStudentId(student.id);
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            allRecords.push({ student, records: res.data.data });
          }
        } catch (err) {
          // Nếu lỗi 400 (chưa có record) thì bỏ qua
          if (!(err && err.response && err.response.status === 400)) {
            console.error('Error fetching vaccination records:', err);
          }
        }
      }
      setRecords(allRecords);
    } catch (err) {
      console.error('Error fetching students or records:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-checkup-records-container">
      <div className="header-section">
        <h1><span role="img" aria-label="vaccine">💉</span> Theo dõi tiêm chủng</h1>
        <p>Xem chi tiết các lần tiêm chủng của học sinh</p>
      </div>
      {loading ? (
        <div className="loading-container"><Spin size="large" /><p>Đang tải phiếu tiêm...</p></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <Empty description="Chưa có phiếu tiêm nào" />
        </div>
      ) : (
        <div className="records-list">
          {records.map(({ student, records }) => (
            <div className="student-record-group" key={student.id}>
              <div className="student-info">
                <img
                  src={student.image || "https://static.vecteezy.com/system/resources/previews/012/941/843/non_2x/illustration-of-boy-avatar-student-s-character-face-vector.jpg"}
                  alt="avatar"
                  className="student-avatar"
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e6e6e6', background: '#fff' }}
                />
                <div>
                  <div className="student-name">{student.fullName || (student.firstName + ' ' + student.lastName)}</div>
                  <div className="student-meta">Mã HS: {student.studentCode} | Lớp: {student.grade}{student.section}</div>
                </div>
              </div>
              <div className="student-records" style={{display: 'flex', flexDirection: 'row', gap: 20, overflowX: 'auto', flexWrap: 'nowrap'}}>
                {records.map(record => (
                  <Card key={record.id} className="record-card" hoverable style={{minWidth: 320, maxWidth: 370, flex: '0 0 320px'}}>
                    <div className="record-details">
                      <div className="detail-row"><span className="label">Tên vắc xin:</span><span className="value">{record.vaccineName}</span></div>
                      <div className="detail-row"><span className="label">Ngày tiêm:</span><span className="value">{record.administeredDate ? new Date(record.administeredDate).toLocaleString('vi-VN') : '-'}</span></div>
                      <div className="detail-row"><span className="label">Người tiêm:</span><span className="value">{record.vaccinatedBy || '-'}</span></div>
                      <div className="detail-row"><span className="label">Trạng thái:</span><span className="value"><Tag color={statusMap[record.sessionStatus]?.color || 'default'}>{statusMap[record.sessionStatus]?.text || record.sessionStatus}</Tag></span></div>
                      <div className="detail-row"><span className="label">Theo dõi phản ứng 24h:</span><span className="value">{record.reactionFollowup24h === 'True' ? 'Có' : 'Không'}</span></div>
                      <div className="detail-row"><span className="label">Theo dõi phản ứng 72h:</span><span className="value">{record.reactionFollowup72h === 'True' ? 'Có' : 'Không'}</span></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 