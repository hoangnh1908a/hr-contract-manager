package com.project.hrcm.utils;

import com.project.hrcm.dto.RoleDto;
import com.project.hrcm.repository.RoleRepository;
import java.util.List;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class InitialLoad {

  private final RoleRepository roleRepository;

  private List<RoleDto> roles;

  public void load() {
    roles = roleRepository.findAllNameEn();
    log.info("Roles loaded successfully. Total entries: {}", roles.size());
  }

  /** Getter */
  public String getRoleNameEnById(Integer id) {
    if (Objects.isNull(id)) return "";

    RoleDto role = roles.stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
    return role != null ? role.getNameEn() : "";
  }
}
