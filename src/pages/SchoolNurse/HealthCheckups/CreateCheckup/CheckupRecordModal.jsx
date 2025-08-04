import React, { useState, useEffect } from 'react';
import { createCheckupRecord, getNurseProfiles } from '../../../../services/apiServices';
import { toast } from 'react-toastify';
import { 
  FaTimes, FaUser, FaRuler, FaWeight, FaEye, FaVolumeUp, 
  FaHeartbeat, FaUserMd, FaCalendarAlt, FaCalendar, FaComments 
} from 'react-icons/fa';
import './CheckupRecordModal.css';

// Lấy ID người dùng từ token
const getUserId = () => {
  try {
    const token = localStorage.getItem('accessToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '';
  } catch {
    return '';
  }
};

const CheckupRecordModal = ({ show, setShow, schedule }) => {
  // Khởi tạo state form chính
  const [form, setForm] = useState({
    scheduleId: '',
    heightCm: '',
    weightKg: '',
    visionLeft: '',
    visionRight: '',
    hearing: '',
    bloodPressureDiastolic: '',
    examinedByNurseId: getUserId(),
    examinedAt: new Date().toISOString().slice(0, 16),
    remarks: '',
    status: 0
  });
  
  // State cho thông tin tái khám
  const [followUp, setFollowUp] = useState({
    staffUserId: getUserId(),
    appointmentDate: new Date().toISOString().slice(0, 16),
    duration: 30,
    purpose: ''
  });

  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Cập nhật ID lịch khám khi modal hiển thị
  useEffect(() => {
    if (show && schedule) {
      setForm(prev => ({ ...prev, scheduleId: schedule.id }));
    }
  }, [show, schedule]);
  
  // Lấy danh sách y tá
  useEffect(() => {
    getNurseProfiles().then(res => {
      if (res.data?.isSuccess) setNurses(res.data.data || []);
    }).catch(() => {});
  }, []);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu nhập
    if (!form.heightCm || !form.weightKg) {
      toast.warning('Vui lòng nhập chiều cao và cân nặng');
      return;
    }
    
    // Kiểm tra thông tin tái khám nếu chọn trạng thái "Cần tái khám"
    if (parseInt(form.status) === 2 && (!followUp.purpose || !followUp.staffUserId)) {
      toast.warning('Vui lòng điền đầy đủ thông tin tái khám');
      return;
    }
    
    setLoading(true);
    setShow(false);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const payload = {
        ...form,
        heightCm: parseFloat(form.heightCm),
        weightKg: parseFloat(form.weightKg),
        visionLeft: form.visionLeft ? parseFloat(form.visionLeft) : null,
        visionRight: form.visionRight ? parseFloat(form.visionRight) : null,
        hearing: form.hearing ? parseFloat(form.hearing) : null,
        bloodPressureDiastolic: form.bloodPressureDiastolic ? parseFloat(form.bloodPressureDiastolic) : null,
        status: parseInt(form.status)
      };
      
      // Thêm thông tin tái khám nếu cần
      if (parseInt(form.status) === 2) {
        payload.counselingAppointment = [{
          staffUserId: followUp.staffUserId,
          appointmentDate: followUp.appointmentDate,
          duration: parseInt(followUp.duration),
          purpose: followUp.purpose
        }];
      }
      
      // Gửi dữ liệu
      const res = await createCheckupRecord(payload);
      if (res.data?.isSuccess) {
        toast.success('Tạo hồ sơ khám thành công!');
      } else {
        toast.error(res.data?.message || 'Tạo hồ sơ khám thất bại');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tạo hồ sơ khám');
    } finally {
      setLoading(false);
    }
  };

  // Không hiển thị nếu không có dữ liệu
  if (!show || !schedule) return null;
  
  // Kiểm tra trạng thái tái khám
  const needsFollowUp = parseInt(form.status) === 2;

  return (
    <div className="checkup-record-modal">
      <div className="checkup-record-backdrop" onClick={() => setShow(false)}></div>
      <div className="checkup-record-content">
        {/* Header */}
        <div className="checkup-record-header">
          <h2><FaUserMd /> Tạo hồ sơ khám</h2>
          <button className="close-btn" onClick={() => setShow(false)}><FaTimes /></button>
        </div>
        
        <div className="checkup-record-body">
          {/* Thông tin học sinh */}
          <div className="student-info-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h3>Thông tin học sinh</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Tên học sinh:</span>
                <span className="value">{schedule.studentName}</span>
              </div>
              <div className="info-item">
                <span className="label">Mã học sinh:</span>
                <span className="value">{schedule.studentCode}</span>
              </div>
              <div className="info-item">
                <span className="label">Lớp:</span>
                <span className="value">{schedule.grade}{schedule.section}</span>
              </div>
              <div className="info-item">
                <span className="label">Chiến dịch:</span>
                <span className="value">{schedule.campaignName}</span>
              </div>
            </div>
          </div>

          {/* Form nhập liệu */}
          <form onSubmit={handleSubmit}>
            <div className="checkup-data-section">
              <div className="section-header">
                <FaHeartbeat className="section-icon" />
                <h3>Thông tin sức khỏe</h3>
              </div>

              {/* Chiều cao và cân nặng */}
              <div className="form-row">
                <div className="form-group">
                  <label><FaRuler className="input-icon" /> Chiều cao (cm) *</label>
                  <input
                    type="number"
                    value={form.heightCm}
                    onChange={e => setForm({...form, heightCm: e.target.value})}
                    placeholder="Nhập chiều cao"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label><FaWeight className="input-icon" /> Cân nặng (kg) *</label>
                  <input
                    type="number"
                    value={form.weightKg}
                    onChange={e => setForm({...form, weightKg: e.target.value})}
                    placeholder="Nhập cân nặng"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Thị lực */}
              <div className="form-row">
                <div className="form-group">
                  <label><FaEye className="input-icon" /> Thị lực trái</label>
                  <input
                    type="number"
                    value={form.visionLeft}
                    onChange={e => setForm({...form, visionLeft: e.target.value})}
                    placeholder="Thị lực mắt trái"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label><FaEye className="input-icon" /> Thị lực phải</label>
                  <input
                    type="number"
                    value={form.visionRight}
                    onChange={e => setForm({...form, visionRight: e.target.value})}
                    placeholder="Thị lực mắt phải"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Thính lực và huyết áp */}
              <div className="form-row">
                <div className="form-group">
                  <label><FaVolumeUp className="input-icon" /> Thính lực</label>
                  <input
                    type="number"
                    value={form.hearing}
                    onChange={e => setForm({...form, hearing: e.target.value})}
                    placeholder="Thính lực"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label><FaHeartbeat className="input-icon" /> Huyết áp</label>
                  <input
                    type="number"
                    value={form.bloodPressureDiastolic}
                    onChange={e => setForm({...form, bloodPressureDiastolic: e.target.value})}
                    placeholder="Huyết áp"
                    min="0"
                  />
                </div>
              </div>

              {/* Ghi chú và thời gian */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label><FaComments className="input-icon" /> Ghi chú</label>
                  <textarea
                    value={form.remarks}
                    onChange={e => setForm({...form, remarks: e.target.value})}
                    placeholder="Ghi chú về tình trạng sức khỏe"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><FaCalendarAlt className="input-icon" /> Thời gian khám *</label>
                  <input
                    type="datetime-local"
                    value={form.examinedAt}
                    onChange={e => setForm({...form, examinedAt: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><FaUserMd className="input-icon" /> Trạng thái *</label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                    required
                  >
                    <option value="0">Chờ khám</option>
                    <option value="1">Hoàn thành</option>
                    <option value="2">Cần tái khám</option>
                    <option value="3">Chuyển viện</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phần tái khám (hiển thị khi chọn "Cần tái khám") */}
            {needsFollowUp && (
              <div className="follow-up-section">
                <div className="section-header">
                  <FaCalendar className="section-icon" />
                  <h3>Thông tin tái khám</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FaCalendarAlt className="input-icon" /> Thời gian tái khám *</label>
                    <input
                      type="datetime-local"
                      value={followUp.appointmentDate}
                      onChange={e => setFollowUp({...followUp, appointmentDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaUserMd className="input-icon" /> Y tá tư vấn *</label>
                    <select
                      value={followUp.staffUserId}
                      onChange={e => setFollowUp({...followUp, staffUserId: e.target.value})}
                      required
                    >
                      <option value="">Chọn y tá</option>
                      {nurses.map(nurse => (
                        <option key={nurse.userId} value={nurse.userId}>
                          {nurse.name || `Y tá ${nurse.userId.slice(0, 8)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thời lượng (phút)</label>
                    <select
                      value={followUp.duration}
                      onChange={e => setFollowUp({...followUp, duration: e.target.value})}
                    >
                      {[15, 30, 45, 60, 90, 120].map(mins => (
                        <option key={mins} value={mins}>{mins} phút</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label><FaComments className="input-icon" /> Mục đích tái khám *</label>
                    <textarea
                      value={followUp.purpose}
                      onChange={e => setFollowUp({...followUp, purpose: e.target.value})}
                      placeholder="Mục đích tái khám"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={() => setShow(false)}>
                Hủy
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Lưu hồ sơ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckupRecordModal; 