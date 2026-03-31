import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { Calendar, MapPin, Plus, Clock, X, LogOut } from 'lucide-react';

const MainView = () => {
  const navigate = useNavigate(); // Khởi tạo điều hướng
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL; // Lấy URL từ biến môi trường

  const [user] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.user || parsed;
    }
    return null;
  });

  const [newSession, setNewSession] = useState({
    title: '',
    dateTime: '',
    location: '',
    loveCode: user?.loveCode || ''
  });

  const fetchSessions = useCallback(async () => {
    if (!user?.loveCode || !user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/sessions/active?loveCode=${user.loveCode}&userId=${user.id}`
      );
      setSessions(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/auth'); // Chuyển hướng bằng navigate
      return;
    }
    fetchSessions();
  }, [user, fetchSessions, navigate]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/sessions/create`, newSession);
      setShowModal(false);
      setNewSession({ title: '', dateTime: '', location: '', loveCode: user.loveCode });
      fetchSessions();
      alert("Tạo buổi hẹn thành công! ❤️");
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.error || "Không thể tạo buổi hẹn"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth'); // Chuyển hướng bằng navigate
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>Chào {user?.name} ❤️</h2>
          <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px' }}>
            Mã: <span style={styles.loveCodeBadge}>{user?.loveCode}</span>
          </p>
        </div>
        
        {/* NHÓM NÚT CHỨC NĂNG */}
        <div style={styles.headerActionGroup}>
          <button 
            onClick={() => navigate('/history')} 
            style={styles.iconBtn} 
            title="Lịch sử buổi hẹn"
          >
            <Clock size={18} />
          </button>
          
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={16} /> Thoát
          </button>
        </div>
      </div>

      <div style={styles.actionSection}>
        <h3 style={{ margin: 0 }}>Sắp diễn ra</h3>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} /> Lên lịch mới
        </button>
      </div>

      {/* Sessions List */}
      <div style={styles.list}>
        {loading ? (
          <p style={styles.centerText}>Đang tải dữ liệu...</p>
        ) : sessions.length === 0 ? (
          <div style={styles.emptyState}>Hiện chưa có buổi hẹn nào đang chờ.</div>
        ) : (
          sessions.map(s => {
            const sessionTime = new Date(s.dateTime);
            const now = new Date();
            const isArrived = now >= sessionTime;

            return (
              <div key={s.id} style={styles.card}>
                <div style={styles.cardInfo}>
                  <h4 style={styles.sessionTitle}>{s.title}</h4>
                  <div style={styles.meta}>
                    <Calendar size={13}/> {sessionTime.toLocaleString('vi-VN')}
                  </div>
                  <div style={styles.meta}>
                    <MapPin size={13}/> {s.location || "Chưa xác định"}
                  </div>
                </div>

                <button 
                  disabled={!isArrived}
                  style={{
                    ...styles.reviewBtn,
                    backgroundColor: isArrived ? '#ff4d4d' : '#e0e0e0',
                    cursor: isArrived ? 'pointer' : 'not-allowed',
                    color: isArrived ? 'white' : '#999'
                  }} 
                  onClick={() => isArrived && navigate(`/review/${s.id}`)}
                >
                  {isArrived ? 'Đánh giá' : 'Chưa đến giờ'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Section giữ nguyên */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Lên lịch đi chơi mới</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleCreateSession} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Tên buổi hẹn</label>
                <input 
                  placeholder="Ví dụ: Đi ăn Haidilao..." 
                  required style={styles.input}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Thời gian</label>
                <input 
                  type="datetime-local" 
                  required style={styles.input}
                  onChange={(e) => setNewSession({...newSession, dateTime: e.target.value})}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Địa điểm</label>
                <input 
                  placeholder="Nhập địa chỉ..." 
                  style={styles.input}
                  onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                />
              </div>
              <button type="submit" style={styles.submitBtn}>Xác nhận tạo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', paddingBottom: '80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' },
  headerActionGroup: { display: 'flex', gap: '10px', alignItems: 'center' },
  loveCodeBadge: { backgroundColor: '#fff0f0', color: '#ff4d4d', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' },
  iconBtn: { backgroundColor: '#fff', border: '1px solid #ddd', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#555' },
  logoutBtn: { backgroundColor: '#f5f5f5', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#666' },
  actionSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '25px 0' },
  addBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
  list: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { padding: '16px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  sessionTitle: { margin: '0 0 8px 0', fontSize: '1.05rem', color: '#333' },
  meta: { fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' },
  reviewBtn: { border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '25px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', color: '#555' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '0.95rem' },
  submitBtn: { padding: '12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  centerText: { textAlign: 'center', color: '#999', marginTop: '20px' },
  emptyState: { textAlign: 'center', color: '#aaa', padding: '40px', border: '2px dashed #eee', borderRadius: '12px' }
};

export default MainView;