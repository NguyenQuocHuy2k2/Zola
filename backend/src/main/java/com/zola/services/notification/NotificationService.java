package com.zola.services.notification;

import com.zola.dto.response.notification.NotificationResponse;
import com.zola.entity.User;
import com.zola.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    Page<NotificationResponse> getUserNotifications(Pageable pageable);
    void markAsRead(Long notificationId);
    void markAllAsRead();
    long getUnreadCount();
    void createNotification(User user, String title, String message, NotificationType type);
    void notifyAdmins(String title, String message, NotificationType type);
}
