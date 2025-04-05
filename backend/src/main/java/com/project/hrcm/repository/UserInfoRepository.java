package com.project.hrcm.repository;

import com.project.hrcm.entities.UserInfo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {

  Optional<UserInfo> findByEmail(String email);
}
