package com.miniproject.dateevaluation.repository;

import com.miniproject.dateevaluation.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
    /**
     * JPA tự dịch thành: 
     * SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reviews r WHERE r.session_id = ? AND r.user_id = ?
     * Dùng để kiểm tra xem user này đã đánh giá buổi hẹn này chưa.
     */
    boolean existsBySessionIdAndUserId(int sessionId, int userId);

    /**
     * JPA tự dịch thành: 
     * SELECT COUNT(r) FROM Reviews r WHERE r.session_id = ?
     * Dùng để đếm xem buổi hẹn này đã có bao nhiêu bài đánh giá rồi.
     */
    int countBySessionId(int sessionId);

    /**
     * JPA tự dịch thành: 
     * SELECT * FROM Reviews WHERE session_id = ? AND user_id = ? LIMIT 1
     * Dùng để lấy bài đánh giá của đối phương khi đủ điều kiện.
     */
    @Query("SELECT r FROM Review r WHERE r.sessionId = :sessionId AND r.userId <> :myUserId")
    Review findPartnerReview(@Param("sessionId") int sessionId, @Param("myUserId") int myUserId);
    
}