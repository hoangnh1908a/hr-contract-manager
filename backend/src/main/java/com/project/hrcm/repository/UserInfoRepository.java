package com.project.hrcm.repository;

import com.project.hrcm.entities.UserInfo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer>, JpaSpecificationExecutor<UserInfo> {

  Optional<UserInfo> findByEmail(String email);

  Integer getIdByFullName(String fullName);

  Page<UserInfo> findAllByFullNameLikeAndEmailLikeAndRoleId(String fullName, String email, Integer roleId, Pageable pageable);


}
