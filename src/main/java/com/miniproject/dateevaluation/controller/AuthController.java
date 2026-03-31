package com.miniproject.dateevaluation.controller;

import com.miniproject.dateevaluation.model.Client;
import com.miniproject.dateevaluation.service.AuthService;
import com.miniproject.dateevaluation.DTO.LoginRequest;
import com.miniproject.dateevaluation.DTO.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép React gọi API thoải mái
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API 1: Đăng ký tài khoản
     * Method: POST
     * URL: /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Gọi tầng Service để xử lý logic đăng ký (kiểm tra trùng lặp, lưu DB)
            boolean isSuccess = authService.registerAccount(
                    request.getUsername(),
                    request.getPassword(),
                    request.getName(),
                    request.getLoveCode()
            );
            System.out.println("Đăng ký tài khoản: " + request.getUsername() + ", " + request.getPassword() + ", " + request.getName() + ", " + request.getLoveCode());
            System.out.println("Kết quả đăng ký: " + isSuccess);
            if (isSuccess) {
                return ResponseEntity.ok(Map.of("message", "Đăng ký thành công! Hãy đăng nhập."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên đăng nhập đã tồn tại!"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }

    /**
     * API 2: Đăng nhập
     * Method: POST
     * URL: /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Gọi Service kiểm tra tài khoản và mật khẩu
            Client user = authService.authenticate(request.getUsername(), request.getPassword());

            if (user != null) {
                // Đăng nhập thành công, trả về thông tin user (Nhưng tuyệt đối KHÔNG trả về password)
                return ResponseEntity.ok(Map.of(
                        "message", "Đăng nhập thành công",
                        "user", Map.of(
                                "id", user.getId(),
                                "name", user.getFullName(),
                                "username", user.getUsername(),
                                "loveCode", user.getLoveCode()
                        )
                ));
            } else {
                // Mã 401: Unauthorized (Sai tài khoản hoặc mật khẩu)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Sai tên đăng nhập hoặc mật khẩu!"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }
}