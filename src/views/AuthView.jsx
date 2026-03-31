import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Heart, UserPlus } from 'lucide-react';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    loveCode: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_API_URL; // Lấy URL từ biến môi trường
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      // Thay đổi URL theo địa chỉ Localhost của Spring Boot
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      console.log(response.data);
      if (isLogin) {
        // Lưu thông tin User vào LocalStorage để dùng cho các trang sau
        localStorage.setItem('user', JSON.stringify(response.data));
        setMessage({ type: 'success', text: 'Đăng nhập thành công! Đang chuyển hướng...' });
        window.location.href = '/dashboard'; // Chuyển trang sau khi xong
      } else {
        setMessage({ type: 'success', text: 'Đăng ký thành công! Hãy đăng nhập.' });
        setIsLogin(true); // Chuyển về tab đăng nhập
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Heart color="#ff4d4d" fill="#ff4d4d" size={40} />
          <h2 style={styles.title}>Date Evaluation</h2>
          <p style={styles.subtitle}>Ghi lại khoảnh khắc hạnh phúc của bạn</p>
        </div>

        <div style={styles.tabContainer}>
          <button 
            onClick={() => setIsLogin(true)} 
            style={{...styles.tab, borderBottomColor: isLogin ? '#ff4d4d' : 'transparent', color: isLogin ? '#ff4d4d' : '#555' }}
          >Đăng nhập</button>
          <button 
            onClick={() => setIsLogin(false)} 
            style={{...styles.tab, borderBottomColor: !isLogin ? '#ff4d4d' : 'transparent', color: !isLogin ? '#ff4d4d' : '#555' }}
          >Đăng ký</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={18} style={styles.icon} />
            <input 
              name="username" placeholder="Tên đăng nhập" 
              onChange={handleChange} required style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input 
              name="password" type="password" placeholder="Mật khẩu" 
              onChange={handleChange} required style={styles.input} 
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <UserPlus size={18} style={styles.icon} />
                <input 
                  name="name" placeholder="Họ và tên của bạn" 
                  onChange={handleChange} required style={styles.input} 
                />
              </div>
              <div style={styles.inputGroup}>
                <Heart size={18} style={styles.icon} />
                <input 
                  name="loveCode" placeholder="Mã tình yêu (Dùng chung với đối phương)" 
                  onChange={handleChange} required style={styles.input} 
                />
              </div>
            </>
          )}

          {message.text && (
            <div style={{...styles.alert, color: message.type === 'error' ? '#d9534f' : '#5cb85c'}}>
              {message.text}
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
};

// CSS-in-JS đơn giản để bạn chạy được ngay
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fdf2f2' },
  card: { background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  title: { margin: '0.5rem 0', color: '#333' },
  subtitle: { fontSize: '0.8rem', color: '#888' },
  tabContainer: { display: 'flex', marginBottom: '1.5rem' },
  tab: { flex: 1, padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '2px solid' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '10px', color: '#aaa' },
  input: { width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  button: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ff4d4d', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  alert: { fontSize: '0.85rem', textAlign: 'center' }
};

export default AuthView;