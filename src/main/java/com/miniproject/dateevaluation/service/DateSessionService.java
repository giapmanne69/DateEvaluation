package com.miniproject.dateevaluation.service;

import com.miniproject.dateevaluation.model.DateSession;
import com.miniproject.dateevaluation.repository.DateSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DateSessionService {

    @Autowired
    private DateSessionRepository dateSessionRepository;

    /**
     * Logic Tạo buổi hẹn hò mới
     */
    public boolean createDateSession(String loveCode, String title, LocalDateTime dateTime, String location) {
        try {
            // Quy tắc 1: Thời gian hẹn hò không được nằm trong quá khứ
            // Lấy thời gian hiện tại của hệ thống để so sánh
            if (dateTime.isBefore(LocalDateTime.now())) {
                System.out.println("Lỗi: Không thể đặt lịch hẹn trong quá khứ!");
                return false; 
            }

            // Quy tắc 2: Tạo đối tượng và gán dữ liệu
            DateSession newSession = new DateSession();
            newSession.setLoveCode(loveCode);
            newSession.setTitle(title);
            newSession.setDateTime(dateTime);
            newSession.setLocation(location);
            
            // Trạng thái mặc định khi mới tạo luôn là "Sắp diễn ra"
            newSession.setStatus("Sắp diễn ra");

            // Lưu xuống Database
            dateSessionRepository.save(newSession);
            return true;
            
        } catch (Exception e) {
            System.out.println("Lỗi khi tạo buổi hẹn: " + e.getMessage());
            return false;
        }
    }

    public List<DateSession> getActiveSessions(String loveCode, Integer userId) {
        // Lấy danh sách chưa đánh giá từ Repo
        return dateSessionRepository.findActiveSessions(loveCode, userId);
    }

    public List<DateSession> getAllHistory(String loveCode) {
        // Lấy toàn bộ sắp xếp theo thời gian mới nhất lên đầu
        return dateSessionRepository.findByLoveCodeOrderByDateTimeDesc(loveCode);
    }
}