package com.miniproject.dateevaluation.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DataSessionRequest {
    private String loveCode;
    private String title;
    // Spring Boot sẽ tự động parse chuỗi ISO 8601 (VD: "2026-03-30T19:00:00") từ React thành LocalDateTime
    private LocalDateTime dateTime; 
    private String location;
}