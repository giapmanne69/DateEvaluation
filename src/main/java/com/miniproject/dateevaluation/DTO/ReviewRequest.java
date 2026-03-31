package com.miniproject.dateevaluation.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private int sessionId;
    private int userId;
    private int starRating;
    private String pros;
    private String cons;
}
