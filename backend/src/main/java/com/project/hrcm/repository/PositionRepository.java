package com.project.hrcm.repository;

import com.project.hrcm.entities.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, Integer> {
  boolean existsByName(String name);

  List<Position> findByNameLike(String name);
}
