package com.project.hrcm.repository;

import com.project.hrcm.dto.BaseDto;
import com.project.hrcm.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Query("SELECT new com.project.hrcm.dto.BaseDto(u.id, u.name) FROM Role u")
    List<BaseDto> findAllRoleDto();
    
}
