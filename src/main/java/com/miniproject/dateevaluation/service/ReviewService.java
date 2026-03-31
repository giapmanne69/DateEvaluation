package com.miniproject.dateevaluation.service;

import com.miniproject.dateevaluation.model.Review;
import com.miniproject.dateevaluation.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // Bắt buộc phải có để Spring Boot nhận diện đây là lớp Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Xử lý logic lưu bài đánh giá mới
     */
    public boolean submitUserReview(int sessionId, int userId, int starRating, String pros, String cons) {
        try {
            // Bước 1: Kiểm tra xem người dùng này đã đánh giá buổi hẹn này chưa
            // Tránh trường hợp 1 người spam gửi đánh giá nhiều lần
            if (reviewRepository.existsBySessionIdAndUserId(sessionId, userId)) {
                return false; // Đã đánh giá rồi thì từ chối luôn
            }

            // Bước 2: Tạo đối tượng Review mới và map dữ liệu
            Review newReview = new Review();
            newReview.setSessionId(sessionId);
            newReview.setUserId(userId);
            newReview.setStar(starRating);
            newReview.setPros(pros);
            newReview.setCons(cons);
            // Lưu ý: Trường created_at sẽ được CSDL tự động gán (CURRENT_TIMESTAMP) nên không cần set ở đây

            // Bước 3: Lưu vào Database thông qua Repository
            reviewRepository.save(newReview);
            return true;
            
        } catch (Exception e) {
            System.out.println("Lỗi khi lưu đánh giá: " + e.getMessage());
            return false;
        }
    }

    /**
     * Xử lý logic Ẩn/Hiện đánh giá của đối phương
     */
    public Review getPartnerReviewIfEligible(int sessionId, int myUserId) {
        
        // Bước 1: Đếm xem buổi hẹn này đã có tổng cộng bao nhiêu bài đánh giá
        long totalReviews = reviewRepository.countBySessionId(sessionId);

        // Bước 2: Kiểm tra điều kiện "Cả 2 cùng đánh giá"
        if (totalReviews >= 2) {
            // Thay vì tìm theo partnerId, ta tìm Review của Session này 
            // nhưng KHÔNG PHẢI của myUserId.
            return reviewRepository.findPartnerReview(sessionId, myUserId);
        }

        // Bước 3: Chưa đủ 2 người -> Trả về null
        return null;
    }
}