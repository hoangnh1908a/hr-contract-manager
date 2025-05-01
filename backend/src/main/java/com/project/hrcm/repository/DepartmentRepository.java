package com.project.hrcm.repository;

import com.project.hrcm.entities.Department;
import com.project.hrcm.entities.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
  boolean existsByName(String name);

  Page<Department> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
