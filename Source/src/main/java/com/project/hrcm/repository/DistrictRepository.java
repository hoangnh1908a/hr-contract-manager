package com.project.hrcm.repository;

import com.project.hrcm.dto.BaseDto;
import com.project.hrcm.entities.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {

    @Query("SELECT new com.project.hrcm.dto.BaseDto(u.id, u.name) FROM District u")
    List<BaseDto> findAllDistrictDto();
}
