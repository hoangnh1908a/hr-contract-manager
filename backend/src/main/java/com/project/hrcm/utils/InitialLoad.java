package com.project.hrcm.utils;

import com.project.hrcm.dto.RoleDto;
import com.project.hrcm.repository.RoleRepository;
import java.util.List;
import java.util.Objects;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class InitialLoad {

  private static final Logger log = LoggerFactory.getLogger(InitialLoad.class);

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
