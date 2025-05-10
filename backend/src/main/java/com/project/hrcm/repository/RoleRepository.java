package com.project.hrcm.repository;

import com.project.hrcm.dto.RoleDto;
import com.project.hrcm.entities.Role;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

  @Query("SELECT new com.project.hrcm.dto.RoleDto(u.id, u.nameEn) FROM Role u")
  List<RoleDto> findAllNameEn();

  boolean existsByName(String name);

  Page<Role> findByNameContainingIgnoreCase(String name, Pageable pageable);

  Page<Role> findByNameEnContainingIgnoreCase(String name, Pageable pageable);
}
