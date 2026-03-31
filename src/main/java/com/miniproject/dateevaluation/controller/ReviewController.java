package com.miniproject.dateevaluation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import com.miniproject.dateevaluation.DTO.ReviewRequest;
import com.miniproject.dateevaluation.model.Review;
import com.miniproject.dateevaluation.service.ReviewService;


@RestController
@RequestMapping ("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    
/**
     * API 1: Người dùng gửi đánh giá buổi hẹn hò
     * Method: POST
     * URL: /api/reviews/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest request) {
        try {
            // Gọi tầng Service để xử lý logic lưu đánh giá
            boolean isSuccess = reviewService.submitUserReview(
                    request.getSessionId(),
                    request.getUserId(),
                    request.getStarRating(),
                    request.getPros(),
                    request.getCons()
            );

            if (isSuccess) {
                return ResponseEntity.ok(Map.of("message", "Gửi đánh giá thành công!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Không thể gửi đánh giá. Có thể bạn đã đánh giá rồi hoặc buổi hẹn chưa kết thúc!"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    } 
    
/**
     * API 2: Xem bài đánh giá của đối phương
     * Method: GET
     * URL: /api/reviews/partner?sessionId=1&myUserId=2&partnerId=3
     */
    @GetMapping("/partner")
    public ResponseEntity<?> getPartnerReview(
            @RequestParam("sessionId") int sessionId,
            @RequestParam("myUserId") int myUserId) {

        try {
            // Gọi Service để kiểm tra điều kiện (cả 2 đã đánh giá chưa) và lấy dữ liệu
            Review partnerReview = reviewService.getPartnerReviewIfEligible(sessionId, myUserId);

            if (partnerReview != null) {
                // Trả về trực tiếp Object Review, Spring Boot sẽ tự ép kiểu sang JSON
                return ResponseEntity.ok(partnerReview);
            } else {
                // Mã 403 Forbidden: Bị chặn do chưa đủ điều kiện
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "message", "Chưa thể xem lúc này. Vui lòng hoàn thành đánh giá của bạn và chờ đối phương!"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }
}
