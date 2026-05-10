package com.timeledger.backend.service;

import com.timeledger.backend.model.Notification;
import com.timeledger.backend.model.User;
import com.timeledger.backend.repository.NotificationRepository;
import com.timeledger.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getNotificationsForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByTimeDesc(user);
    }

    public Notification createNotification(Notification notification) {
        if (notification.getUser() == null && notification.getUserId() != null) {
            userRepository.findById(notification.getUserId()).ifPresent(notification::setUser);
        }
        return notificationRepository.save(notification);
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
