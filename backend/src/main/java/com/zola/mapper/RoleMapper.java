package com.zola.mapper;

import com.zola.dto.request.auth.RoleCreationRequest;
import com.zola.dto.response.auth.RoleResponse;
import com.zola.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toRoleEntity(RoleCreationRequest request);

    RoleResponse toRoleResponse(Role role);
}
