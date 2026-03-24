package com.zola.mapper;

import com.zola.dto.response.notification.NotificationResponse;
import com.zola.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationResponse toNotificationResponse(Notification notification);
}
