package com.zola.services.role;

import com.zola.dto.request.auth.RoleCreationRequest;
import com.zola.dto.response.auth.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse createRole(RoleCreationRequest request);

    List<RoleResponse> getAllRoles();

    Boolean deleteRoleByName(String roleName);
}
