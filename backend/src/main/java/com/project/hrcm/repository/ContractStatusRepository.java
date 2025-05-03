package com.project.hrcm.repository;

import com.project.hrcm.entities.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractStatusRepository extends JpaRepository<ContractStatus, Integer> {

  boolean existsByName(String name);

  Page<ContractStatus> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
