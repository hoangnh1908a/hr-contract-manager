package com.project.hrcm.repository;

import com.project.hrcm.dto.BaseDto;
import com.project.hrcm.entities.City;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

  @Query("SELECT new com.project.hrcm.dto.BaseDto(u.id, u.name) FROM City u")
  List<BaseDto> findAllCityDto();

  boolean existsByName(String name);

  Page<City> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
