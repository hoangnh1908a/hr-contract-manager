package com.project.hrcm.repository;

import com.project.hrcm.entities.Config;
import com.project.hrcm.entities.ContractApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Integer>, JpaSpecificationExecutor<Config> {
}
