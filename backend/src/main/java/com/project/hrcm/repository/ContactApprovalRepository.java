package com.project.hrcm.repository;

import com.project.hrcm.entities.ContactApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactApprovalRepository extends JpaRepository<ContactApproval, Integer> {
    
}
