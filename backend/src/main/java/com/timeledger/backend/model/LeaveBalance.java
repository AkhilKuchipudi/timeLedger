package com.timeledger.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "leave_balances")
@Data
public class LeaveBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String type;
    private int count;
    private int total;
    private String color;
    private String icon;
    private int progress;
}
