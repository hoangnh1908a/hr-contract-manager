package com.project.hrcm.repository;

import com.project.hrcm.entities.ContractApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractApprovalRepository extends JpaRepository<ContractApproval, Integer> {}
