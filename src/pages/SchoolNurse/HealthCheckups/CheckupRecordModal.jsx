import React, { useState, useEffect } from 'react';
import { getNurseProfiles, createCheckupRecord } from '../../../services/apiServices';
import { toast } from 'react-toastify';
import { 
  FaTimes, 
  FaUser, 
  FaCalendar, 
  FaClock, 
  FaRuler, 
  FaWeight, 
  FaEye, 
  FaVolumeUp, 
  FaHeartbeat,
  FaUserMd,
  FaCalendarAlt,
  FaClock as FaClockIcon,
  FaComments
} from 'react-icons/fa';
import './CheckupRecordModal.css';
import DatePicker from "react-datepicker";
import "/node_modules/react-datepicker/dist/react-datepicker.css";

// Thêm hàm chuyển đổi đúng giờ local sang ISO
function toISOStringLocal(dtStr) {
  if (!dtStr) return '';
  const [date, time] = dtStr.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  const d = new Date(
    Number(year), Number(month) - 1, Number(day),
    Number(hour), Number(minute)
  );
  return d.toISOString();
}

// Hàm lấy min/max cho input datetime-local (ngày hiện tại, 8h và 18h)
function getMinDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}T08:00`;
}
function getMaxDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}T18:00`;
}

const CheckupRecordModal = ({ schedule, onClose, onRecordCreated }) => {
  const [formData, setFormData] = useState({
    scheduleId: schedule?.id || '',
    heightCm: '',
    weightKg: '',
    visionLeft: '',
    visionRight: '',
    hearing: '',
    bloodPressureDiastolic: '',
    examinedByNurseId: '',
    examinedAt: new Date().toISOString().slice(0, 16),
    remarks: '',
    status: 0,
    counselingAppointment: []
  });

  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    staffUserId: '',
    appointmentDate: '',
    duration: 30,
    purpose: ''
  });

  useEffect(() => {
    fetchNurses();
  }, []);

  useEffect(() => {
    setShowFollowUp(formData.status === 2);
  }, [formData.status]);

  const fetchNurses = async () => {
    try {
      const response = await getNurseProfiles();
      if (response.data.isSuccess) {
        setNurses(response.data.data);
        if (response.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            examinedByNurseId: response.data.data[0].userId
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching nurses:', error);
      toast.error('Không thể tải danh sách y tá');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value
    }));
  };

  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.examinedByNurseId) {
      toast.error('Vui lòng chọn y tá khám');
      return;
    }

    if (formData.status === 2 && (!followUpData.staffUserId || !followUpData.appointmentDate || !followUpData.purpose)) {
      toast.error('Vui lòng điền đầy đủ thông tin hẹn tái khám');
      return;
    }

    const getHour = (dtStr) => Number(dtStr?.split('T')[1]?.split(':')[0]);
    if (getHour(formData.examinedAt) < 8 || getHour(formData.examinedAt) > 18) {
      toast.error('Chỉ được chọn giờ khám từ 08:00 đến 18:00');
      return;
    }
    if (formData.status === 2 && (getHour(followUpData.appointmentDate) < 8 || getHour(followUpData.appointmentDate) > 18)) {
      toast.error('Chỉ được chọn giờ hẹn tái khám từ 08:00 đến 18:00');
      return;
    }

    try {
      setLoading(true);
      // Set thời gian khám là hiện tại
      const submitData = {
        ...formData,
        heightCm: parseFloat(formData.heightCm) || 0,
        weightKg: parseFloat(formData.weightKg) || 0,
        visionLeft: parseFloat(formData.visionLeft) || 0,
        visionRight: parseFloat(formData.visionRight) || 0,
        hearing: parseFloat(formData.hearing) || 0,
        bloodPressureDiastolic: parseFloat(formData.bloodPressureDiastolic) || 0,
        counselingAppointment: formData.status === 2 ? [{
          ...followUpData,
          appointmentDate: toISOStringLocal(followUpData.appointmentDate),
          duration: parseInt(followUpData.duration)
        }] : []
      };

      const response = await createCheckupRecord(submitData);
      
      if (response.data.isSuccess) {
        toast.success('Tạo hồ sơ khám thành công!');
        onRecordCreated();
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi tạo hồ sơ khám');
      }
    } catch (error) {
      console.error('Error creating checkup record:', error);
      toast.error('Có lỗi xảy ra khi tạo hồ sơ khám');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Chờ khám';
      case 1: return 'Hoàn thành';
      case 2: return 'Cần tái khám';
      case 3: return 'Chuyển viện';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaUserMd />
            Tạo Hồ Sơ Khám Sức Khỏe
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {/* Student Information */}
          <div className="student-info-section">
            <h3>
              <FaUser />
              Thông Tin Học Sinh
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Tên học sinh:</span>
                <span className="value">{schedule?.studentName}</span>
              </div>
              <div className="info-item">
                <span className="label">Mã học sinh:</span>
                <span className="value">{schedule?.studentCode}</span>
              </div>
              <div className="info-item">
                <span className="label">Lớp:</span>
                <span className="value">{schedule?.grade}{schedule?.section}</span>
              </div>
              <div className="info-item">
                <span className="label">Ngày khám:</span>
                <span className="value">{formatDate(schedule?.scheduledAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Giờ khám:</span>
                <span className="value">{formatTime(schedule?.scheduledAt)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Health Measurements */}
            <div className="form-section">
              <h3>
                <FaHeartbeat />
                Chỉ Số Sức Khỏe
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaRuler />
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                    placeholder="Nhập chiều cao"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaWeight />
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                    placeholder="Nhập cân nặng"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaEye />
                    Thị lực trái
                  </label>
                  <select
                    name="visionLeft"
                    value={formData.visionLeft}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn mức</option>
                    <option value={0}>Bình thường</option>
                    <option value={1}>Nhẹ</option>
                    <option value={2}>Trung bình</option>
                    <option value={3}>Nặng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <FaEye />
                    Thị lực phải
                  </label>
                  <select
                    name="visionRight"
                    value={formData.visionRight}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn mức</option>
                    <option value={0}>Bình thường</option>
                    <option value={1}>Nhẹ</option>
                    <option value={2}>Trung bình</option>
                    <option value={3}>Nặng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <FaVolumeUp />
                    Thính lực
                  </label>
                  <select
                    name="hearing"
                    value={formData.hearing}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn mức</option>
                    <option value={0}>Bình thường</option>
                    <option value={1}>Nhẹ</option>
                    <option value={2}>Trung bình</option>
                    <option value={3}>Nặng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <FaHeartbeat />
                    Huyết áp tâm trương
                  </label>
                  <input
                    type="number"
                    name="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={handleInputChange}
                    placeholder="Nhập huyết áp"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Examination Details */}
            <div className="form-section">
              <h3>
                <FaUserMd />
                Thông Tin Khám
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaUserMd />
                    Y tá khám
                  </label>
                  <select
                    name="examinedByNurseId"
                    value={formData.examinedByNurseId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn y tá</option>
                    {nurses.map(nurse => (
                      <option key={nurse.userId} value={nurse.userId}>
                        {nurse.name} - {nurse.position}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <FaCalendar />
                    Thời gian khám
                  </label>
                  <DatePicker
                    selected={formData.examinedAt ? new Date(formData.examinedAt) : null}
                    onChange={date => {
                      if (date) {
                        // Format local ISO string yyyy-MM-ddTHH:mm:ss
                        const localISO = date.getFullYear() + '-' +
                          String(date.getMonth() + 1).padStart(2, '0') + '-' +
                          String(date.getDate()).padStart(2, '0') + 'T' +
                          String(date.getHours()).padStart(2, '0') + ':' +
                          String(date.getMinutes()).padStart(2, '0') + ':00';
                        console.log('examinedAt:', localISO);
                        setFormData(prev => ({
                          ...prev,
                          examinedAt: localISO
                        }));
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Chọn ngày và giờ khám"
                    className="react-datepicker__input"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaComments />
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Chờ khám</option>
                    <option value={1}>Hoàn thành</option>
                    <option value={2}>Cần tái khám</option>
                    <option value={3}>Chuyển viện</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label>
                  <FaComments />
                  Ghi chú
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú khám..."
                  rows="3"
                />
              </div>
            </div>

            {/* Follow-up Appointment (Conditional) */}
            {showFollowUp && (
              <div className="form-section follow-up-section">
                <h3>
                  <FaCalendarAlt />
                  Thông Tin Hẹn Tái Khám
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FaUserMd />
                      Nhân viên tư vấn
                    </label>
                    <select
                      name="staffUserId"
                      value={followUpData.staffUserId}
                      onChange={handleFollowUpChange}
                      required
                    >
                      <option value="">Chọn nhân viên</option>
                      {nurses.map(nurse => (
                        <option key={nurse.userId} value={nurse.userId}>
                          {nurse.name} - {nurse.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <FaCalendarAlt />
                      Ngày hẹn
                    </label>
                    <DatePicker
                      selected={followUpData.appointmentDate ? new Date(followUpData.appointmentDate) : null}
                      onChange={date => {
                        if (date) {
                          // Format local ISO string yyyy-MM-ddTHH:mm:ss
                          const localISO = date.getFullYear() + '-' +
                            String(date.getMonth() + 1).padStart(2, '0') + '-' +
                            String(date.getDate()).padStart(2, '0') + 'T' +
                            String(date.getHours()).padStart(2, '0') + ':' +
                            String(date.getMinutes()).padStart(2, '0') + ':00';
                          console.log('appointmentDate:', localISO);
                          setFollowUpData(prev => ({
                            ...prev,
                            appointmentDate: localISO
                          }));
                        }
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="Chọn ngày và giờ hẹn"
                      className="react-datepicker__input"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaClockIcon />
                      Thời lượng (phút)
                    </label>
                    <select
                      name="duration"
                      value={followUpData.duration}
                      onChange={handleFollowUpChange}
                      required
                    >
                      {[30,60,90,120,150,180,210,240].map(val => (
                        <option key={val} value={val}>{val} phút</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>
                    <FaComments />
                    Mục đích tư vấn
                  </label>
                  <textarea
                    name="purpose"
                    value={followUpData.purpose}
                    onChange={handleFollowUpChange}
                    placeholder="Nhập mục đích tư vấn..."
                    rows="3"
                    required
                  />
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Hồ Sơ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckupRecordModal; 