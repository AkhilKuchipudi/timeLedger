package com.timeledger.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private String type; // info, success, warning, error, task

    @Column(nullable = false)
    private boolean read = false;

    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("userId")
    private Long userId;
}
