import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Send, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const ReviewView = () => {
  const { sessionId } = useParams(); // Lấy ID buổi hẹn từ URL
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')).user);
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewData, setReviewData] = useState({ pros: '', cons: '' });
  
  const [partnerReview, setPartnerReview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  // 1. Gửi đánh giá của bạn
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Vui lòng chọn số sao!");
    console.log(user.id);
    try {
      await axios.post(`${API_URL}/api/reviews/submit`, {
        sessionId: parseInt(sessionId),
        userId: user.id,
        starRating: rating,
        pros: reviewData.pros,
        cons: reviewData.cons
      });
      setIsSubmitted(true);
      fetchPartnerReview(); // Thử lấy review của đối phương ngay sau khi gửi
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.error || "Không thể gửi đánh giá"));
    }
  };

  // 2. Lấy đánh giá của đối phương (Chỉ xem được khi cả 2 đã đánh giá)
const fetchPartnerReview = async () => {
  try {
    // Chỉ gửi 2 tham số: Session nào? Và tôi là ai?
    const response = await axios.get(`${API_URL}/api/reviews/partner`, {
      params: {
        sessionId: sessionId,
        myUserId: user.id
      }
    });

    // Nếu Backend trả về dữ liệu (200 OK)
    setPartnerReview(response.data);
    setError('');
  } catch (err) {
    // Nếu Backend trả về 403 (Chưa đủ 2 người review)
    if (err.response?.status === 403) {
      setError("Nội dung sẽ được mở khóa khi cả hai cùng hoàn thành đánh giá ❤️");
      setPartnerReview(null);
    } else {
      console.error("Lỗi hệ thống:", err);
    }
  }
};

// Gọi khi vừa load trang
useEffect(() => {
  if (sessionId && user) fetchPartnerReview();
}, [sessionId, user]);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Đánh giá buổi hẹn ❤️</h2>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmitReview} style={styles.form}>
            {/* Chấm sao */}
            <div style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  fill={(hover || rating) >= star ? "#ffcc00" : "none"}
                  color={(hover || rating) >= star ? "#ffcc00" : "#ccc"}
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                />
              ))}
            </div>

            <textarea
              placeholder="Điểm bạn thích nhất? (Ưu điểm)"
              style={styles.textarea}
              onChange={(e) => setReviewData({...reviewData, pros: e.target.value})}
              required
            />
            <textarea
              placeholder="Điều gì làm bạn chưa hài lòng? (Nhược điểm)"
              style={styles.textarea}
              onChange={(e) => setReviewData({...reviewData, cons: e.target.value})}
              required
            />

            <button type="submit" style={styles.submitBtn}>
              <Send size={18} /> Gửi đánh giá
            </button>
          </form>
        ) : (
          <div style={styles.successBox}>
            <CheckCircle color="#5cb85c" size={40} />
            <p>Bạn đã hoàn thành đánh giá!</p>
          </div>
        )}

        <hr style={styles.divider} />

        {/* Phần hiển thị Review của đối phương */}
        <div style={styles.partnerSection}>
          <h3>Cảm nhận từ đối phương</h3>
          {partnerReview ? (
            <div style={styles.partnerCard}>
              <div style={styles.starContainerSmall}>
                {[...Array(partnerReview.starRating)].map((_, i) => (
                  <Star key={i} size={16} fill="#ffcc00" color="#ffcc00" />
                ))}
              </div>
              <p><b>Ưu điểm:</b> {partnerReview.pros}</p>
              <p><b>Nhược điểm:</b> {partnerReview.cons}</p>
            </div>
          ) : (
            <div style={styles.infoBox}>
              <AlertCircle size={20} />
              <p>{error || "Nội dung sẽ hiện ra khi cả hai cùng đánh giá xong."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({color, size}) => <div style={{color}}><Star size={size} fill={color}/></div>;

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', padding: '20px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'none', cursor: 'pointer', color: '#666', marginBottom: '15px' },
  card: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#ff4d4d', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  starContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', outline: 'none', fontSize: '0.95rem' },
  submitBtn: { padding: '12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  divider: { margin: '30px 0', border: '0', borderTop: '1px solid #eee' },
  partnerSection: { textAlign: 'center' },
  partnerCard: { textAlign: 'left', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px', borderLeft: '4px solid #ffcc00' },
  starContainerSmall: { marginBottom: '10px' },
  infoBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#888', fontSize: '0.9rem', padding: '20px' },
  successBox: { textAlign: 'center', padding: '20px', backgroundColor: '#f0f9f0', borderRadius: '10px', marginBottom: '20px' }
};

export default ReviewView;