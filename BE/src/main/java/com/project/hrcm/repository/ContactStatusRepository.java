package com.project.hrcm.repository;

import com.project.hrcm.entities.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactStatusRepository extends JpaRepository<ContactStatus, Integer> {

  boolean existsByName(String name);
}
