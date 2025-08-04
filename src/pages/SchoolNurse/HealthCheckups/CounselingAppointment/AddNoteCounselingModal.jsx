import React, { useState } from 'react';
import { addCounselingAppointmentNote } from '../../../../services/apiServices';
import { toast } from 'react-toastify';
import { FaTimes, FaStickyNote, FaClipboardCheck } from 'react-icons/fa';
import '../CreateCheckup/CheckupRecordModal.css';

const AddNoteCounselingModal = ({ appointment, onClose, onNoteAdded }) => {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [recommendations, setRecommendations] = useState(appointment.recommendations || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes && !recommendations) {
      toast.error('Vui lòng nhập ghi chú hoặc khuyến nghị!');
      return;
    }
    try {
      setLoading(true);
      const res = await addCounselingAppointmentNote({
        counselingAppointmentId: appointment.id,
        notes,
        recommendations
      });
      if (res.data.isSuccess) {
        toast.success('Ghi chú thành công!');
        onNoteAdded();
      } else {
        toast.error(res.data.message || 'Có lỗi khi ghi chú');
      }
    } catch (e) {
      toast.error('Có lỗi khi ghi chú');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkup-record-modal">
      <div className="checkup-record-backdrop" onClick={onClose}></div>
      <div className="checkup-record-content" onClick={e => e.stopPropagation()}>
        <div className="checkup-record-header" style={{background:'#ffb347'}}>
          <h2><FaStickyNote/> Ghi chú tư vấn</h2>
          <button className="close-btn" onClick={onClose}><FaTimes/></button>
        </div>
        <div className="checkup-record-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label style={{fontWeight:600,marginBottom:8,display:'block'}}><FaStickyNote/> Ghi chú</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Nhập ghi chú..."
                rows={4}
                style={{width:'100%'}}
              />
            </div>
            <div className="form-section">
              <label style={{fontWeight:600,marginBottom:8,display:'block'}}><FaClipboardCheck/> Khuyến nghị</label>
              <textarea
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
                placeholder="Nhập khuyến nghị..."
                rows={3}
                style={{width:'100%'}}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>Hủy</button>
              <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu ghi chú'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNoteCounselingModal; 