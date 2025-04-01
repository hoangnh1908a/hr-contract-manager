package com.project.hrcm.repository;

import com.project.hrcm.entities.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {
  boolean existsByFileName(String fileName);
}
