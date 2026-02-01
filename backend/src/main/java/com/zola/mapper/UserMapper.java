package com.zola.mapper;

import com.zola.dto.response.profile.UserProfileResponse;
import com.zola.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "role", source = "role.name")
    UserProfileResponse toUserProfileResponse(User user);
}
