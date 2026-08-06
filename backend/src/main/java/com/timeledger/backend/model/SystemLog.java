package com.timeledger.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Date;
import java.util.UUID;

@Entity
public class SystemLog {

    @Id
    private String id;
    
    private Date timestamp;
    private String username; // user is a reserved keyword in some SQL dialects, safer to use username
    private String action;
    private String severity;
    private String details;

    public SystemLog() {
    }

    public SystemLog(String username, String action, String severity, String details) {
        this.id = "EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.timestamp = new Date();
        this.username = username;
        this.action = action;
        this.severity = severity;
        this.details = details;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    
    public String getUser() { return username; } // Jackson will serialize as 'user' if we configure it, or we can just rename frontend
    public void setUser(String username) { this.username = username; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
