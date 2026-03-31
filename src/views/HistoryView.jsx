import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, MapPin, ChevronLeft, Heart, MessageCircle } from 'lucide-react';

const HistoryView = () => {
  const [history, setHistory] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')).user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      console.log(user.loveCode);
      // Gọi API lấy lịch sử (Endpoint đã tách ở bước trước)
      const response = await axios.get(`${API_URL}/api/sessions/history?loveCode=${user.loveCode}`);
      setHistory(response.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header quay lại */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={styles.headerTitle}>Hành trình yêu thương</h2>
        <div style={{ width: 40 }}></div> {/* Giữ cân bằng layout */}
      </div>

      <div style={styles.timeline}>
        {loading ? (
          <p style={styles.centerText}>Đang tìm lại kỉ niệm...</p>
        ) : history.length === 0 ? (
          <div style={styles.emptyBox}>
            <Heart size={40} color="#ccc" />
            <p>Hai bạn chưa có lịch sử hẹn hò nào.</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div key={item.id} style={styles.timelineItem}>
              {/* Cột mốc thời gian bên trái */}
              <div style={styles.dateSide}>
                <span style={styles.day}>{new Date(item.dateTime).getDate()}</span>
                <span style={styles.month}>Tháng {new Date(item.dateTime).getMonth() + 1}</span>
              </div>

              {/* Đường kẻ Timeline */}
              <div style={styles.lineSide}>
                <div style={styles.dot}></div>
                {index !== history.length - 1 && <div style={styles.line}></div>}
              </div>

              {/* Nội dung buổi hẹn bên phải */}
              <div style={styles.contentSide} onClick={() => navigate(`/review/${item.id}`)}>
                <div style={styles.historyCard}>
                  <h4 style={styles.cardTitle}>{item.title}</h4>
                  <div style={styles.meta}>
                    <Clock size={14} /> 
                    <span>{new Date(item.dateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={styles.meta}>
                    <MapPin size={14} /> 
                    <span>{item.location || "Chưa cập nhật địa điểm"}</span>
                  </div>
                  
                  <div style={styles.footerCard}>
                    <span style={styles.viewLink}>Xem lại đánh giá <MessageCircle size={12} /></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', minHeight: '100vh', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  backBtn: { background: '#f5f5f5', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  headerTitle: { fontSize: '1.2rem', color: '#333', margin: 0 },
  timeline: { padding: '10px 0' },
  timelineItem: { display: 'flex', marginBottom: '20px' },
  dateSide: { width: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5px' },
  day: { fontSize: '1.4rem', fontWeight: 'bold', color: '#ff4d4d' },
  month: { fontSize: '0.75rem', color: '#888' },
  lineSide: { width: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
  dot: { width: '12px', height: '12px', backgroundColor: '#ff4d4d', borderRadius: '50%', zIndex: 2, marginTop: '12px', border: '3px solid #fff', boxShadow: '0 0 0 2px #ff4d4d' },
  line: { width: '2px', backgroundColor: '#eee', flex: 1, marginTop: '5px' },
  contentSide: { flex: 1, paddingLeft: '10px', cursor: 'pointer' },
  historyCard: { padding: '15px', borderRadius: '12px', backgroundColor: '#fdfdfd', border: '1px solid #f0f0f0', transition: '0.2s' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1rem', color: '#444' },
  meta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#777', marginBottom: '6px' },
  footerCard: { marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'flex-end' },
  viewLink: { fontSize: '0.75rem', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' },
  centerText: { textAlign: 'center', color: '#999', marginTop: '50px' },
  emptyBox: { textAlign: 'center', marginTop: '100px', color: '#bbb' }
};

export default HistoryView;