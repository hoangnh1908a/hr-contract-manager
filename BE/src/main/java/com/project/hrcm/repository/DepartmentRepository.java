package com.project.hrcm.repository;

import com.project.hrcm.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
  boolean existsByName(String name);
}
