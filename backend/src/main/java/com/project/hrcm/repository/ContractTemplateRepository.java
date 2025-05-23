package com.project.hrcm.repository;

import com.project.hrcm.entities.ContractTemplate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractTemplateRepository
    extends JpaRepository<ContractTemplate, Integer>, JpaSpecificationExecutor<ContractTemplate> {
  boolean existsByFileName(String name);

  Optional<ContractTemplate> findByFileName(String fileName);
}
