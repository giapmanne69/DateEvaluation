package com.miniproject.dateevaluation.repository;

import com.miniproject.dateevaluation.model.DateSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface DateSessionRepository extends JpaRepository<DateSession, Integer> {

    // 1. Lấy buổi hẹn chưa hoàn thành: (Thời gian chưa tới) HOẶC (Đã tới nhưng User hiện tại chưa đánh giá)
    @Query(value = "SELECT s.* FROM \"date_session\" s " +
           "WHERE s.love_code = :loveCode " +
           "AND s.id NOT IN (SELECT r.session_id FROM \"review\" r WHERE r.user_id = :userId)", 
           nativeQuery = true)
    List<DateSession> findActiveSessions(@Param("loveCode") String loveCode, @Param("userId") Integer userId);

    // 2. Lấy lịch sử: Tất cả buổi hẹn của cùng loveCode
    List<DateSession> findByLoveCodeOrderByDateTimeDesc(String loveCode);
}