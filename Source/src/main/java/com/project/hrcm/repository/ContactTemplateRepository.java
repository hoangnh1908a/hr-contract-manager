package com.project.hrcm.repository;

import com.project.hrcm.entities.ContactTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactTemplateRepository extends JpaRepository<ContactTemplate, Integer> {}
