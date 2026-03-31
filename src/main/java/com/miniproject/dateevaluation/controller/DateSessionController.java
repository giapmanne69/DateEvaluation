package com.miniproject.dateevaluation.controller;

import com.miniproject.dateevaluation.model.DateSession;
import com.miniproject.dateevaluation.service.DateSessionService;
import com.miniproject.dateevaluation.DTO.DataSessionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*") // Tiếp tục mở CORS cho React
public class DateSessionController {

    @Autowired
    private DateSessionService dateSessionService;

    /**
     * API 1: Tạo buổi hẹn hò mới
     * Method: POST
     * URL: /api/sessions/create
     */
    @PostMapping("/create")
    public ResponseEntity<?> createSession(@RequestBody DataSessionRequest request) {
        try {
            // Gọi Service để xử lý lưu vào Database
            boolean isSuccess = dateSessionService.createDateSession(
                    request.getLoveCode(),
                    request.getTitle(),
                    request.getDateTime(),
                    request.getLocation()
            );

            if (isSuccess) {
                return ResponseEntity.ok(Map.of("message", "Tạo buổi hẹn hò thành công!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Không thể tạo buổi hẹn. Vui lòng kiểm tra lại thông tin."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }
/**
     * API 2: Danh sách đang diễn ra / Chờ đánh giá (MainView)
     * Chỉ hiện những phiên mà User hiện tại chưa thực hiện đánh giá.
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveSessions(
            @RequestParam("loveCode") String loveCode, 
            @RequestParam("userId") Integer userId) {
        try {
            List<DateSession> sessions = dateSessionService.getActiveSessions(loveCode, userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * API 2: Lịch sử tất cả các phiên (HistoryView)
     */
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam("loveCode") String loveCode) {
        try {
            List<DateSession> sessions = dateSessionService.getAllHistory(loveCode);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
