package com.project.hrcm.utils;

import com.project.hrcm.dto.BaseDto;
import com.project.hrcm.repository.CityRepository;
import com.project.hrcm.repository.DistrictRepository;
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
  private final CityRepository cityRepository;
  private final DistrictRepository districtRepository;

  private List<BaseDto> roles;
  private List<BaseDto> districts;
  private List<BaseDto> cities;

  public void load() {
    roles = roleRepository.findAllRoleDto();
    log.info("Roles loaded successfully. Total entries: {}", roles.size());
  }

  /** Getter */
  public String getRoleNameById(Integer id) {
    if (Objects.isNull(id)) return "";

    BaseDto role = roles.stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
    return role != null ? role.getName() : "";
  }
}
