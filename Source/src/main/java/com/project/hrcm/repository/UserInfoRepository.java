package com.project.hrcm.repository;

import org.springframework.stereotype.Repository;

import com.project.hrcm.entities.UserInfo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {

    Optional<UserInfo> findByEmail(String email);
    
}
