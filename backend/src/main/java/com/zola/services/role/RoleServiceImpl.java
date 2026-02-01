package com.zola.services.role;

import com.zola.dto.request.auth.RoleCreationRequest;
import com.zola.dto.response.auth.RoleResponse;
import com.zola.entity.Role;
import com.zola.mapper.RoleMapper;
import com.zola.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleServiceImpl implements RoleService {

    RoleRepository roleRepository;
    RoleMapper roleMapper;

    @Override
    public RoleResponse createRole(RoleCreationRequest request) {
        Role role = roleMapper.toRoleEntity(request);
        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        List<Role> roles = roleRepository.findAll();

        List<RoleResponse> roleResponses = roles.stream()
                .map(roleMapper::toRoleResponse)
                .toList();

        return roleResponses;
    }

    @Override
    public Boolean deleteRoleByName(String roleName) {
        if (roleRepository.existsById(roleName)) {
            roleRepository.deleteById(roleName);
            return true;
        }
        return false;
    }

}
