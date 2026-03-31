package com.miniproject.dateevaluation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Entity
@Getter
@Setter
public class Review {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private long id;
    private String pros, cons;
    private long sessionId, userId;
    private int star;
    private Date createdAt;
}
