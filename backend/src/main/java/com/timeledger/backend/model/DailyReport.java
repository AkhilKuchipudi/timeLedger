package com.timeledger.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("userId")
    private Long userId;

    private LocalDate date;
    
    private String workLocation;
    private String shiftType;
    
    @Column(length = 1000)
    private String yesterdayWork;
    
    @Column(length = 1000)
    private String todayPlan;
    
    @Column(length = 500)
    private String blockers;
    
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) date = LocalDate.now();
    }
}
