package com.miniproject.dateevaluation.DTO;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO hứng dữ liệu Form Đăng ký từ React
 */

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private String name;
    private String loveCode;

}