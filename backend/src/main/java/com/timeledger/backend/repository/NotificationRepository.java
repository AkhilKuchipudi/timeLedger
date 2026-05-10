package com.timeledger.backend.repository;

import com.timeledger.backend.model.Notification;
import com.timeledger.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimeDesc(User user);
    long countByUserAndRead(User user, boolean read);
}
