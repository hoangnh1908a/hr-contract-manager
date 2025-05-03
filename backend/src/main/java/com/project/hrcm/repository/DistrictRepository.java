package com.project.hrcm.repository;

import com.project.hrcm.dto.BaseDto;
import com.project.hrcm.entities.District;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {

  @Query("SELECT new com.project.hrcm.dto.BaseDto(u.id, u.name) FROM District u")
  List<BaseDto> findAllDistrictDto();

  Page<District> findByNameLikeIgnoreCaseAndCityId(String name, Integer cityId, Pageable pageable);

  Page<District> findByNameLikeIgnoreCase(String name, Pageable pageable);

  boolean existsByName(String name);
}
