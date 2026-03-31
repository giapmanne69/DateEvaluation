import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthView from './views/AuthView';
import MainView from './views/MainView';
import ReviewView from './views/ReviewView';
import HistoryView from './views/HistoryView';

// Thành phần bảo vệ đường dẫn: Nếu chưa có user trong localStorage thì đá về trang /auth
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Trang Đăng nhập/Đăng ký */}
          <Route path="/auth" element={<AuthView />} />

          {/* 2. Trang chính (Danh sách buổi hẹn active) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <MainView />
              </PrivateRoute>
            } 
          />

          {/* 3. Trang Lịch sử (History) */}
          <Route 
            path="/history" 
            element={
              <PrivateRoute>
                <HistoryView />
              </PrivateRoute>
            } 
          />

          {/* 4. Trang Đánh giá (Review) - Lấy sessionId từ URL */}
          <Route 
            path="/review/:sessionId" 
            element={
              <PrivateRoute>
                <ReviewView />
              </PrivateRoute>
            } 
          />

          {/* Mặc định: Nếu vào trang chủ "/" hoặc link lạ, đẩy về /dashboard (PrivateRoute sẽ tự check) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;