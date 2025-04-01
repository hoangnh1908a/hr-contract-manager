package com.project.hrcm.services.userInfo;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.dto.UserInfoDetails;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.repository.UserInfoRepository;
import com.project.hrcm.services.AuditLogService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.InitialLoad;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Slf4j
@Service
public class UserInfoService implements UserDetailsService {

  private static final String TABLE_NAME = "USERS";
  private static final String USER_NOT_FOUND = "USERS";

  private final UserInfoRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final InitialLoad initialLoad;
  private final AuditLogService auditLogService;
  private final MessageSource messageSource;

  public static Integer getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      Object principal = authentication.getPrincipal();
      if (principal instanceof UserInfo) {
        return ((UserInfo) principal).getId();
      }
    }
    return 1;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    log.info(" Load user : {}", email);
    Optional<UserInfo> userInfo = userRepository.findByEmail(email);
    /** get role */
    if (userInfo.isPresent()) {
      List<GrantedAuthority> authorities =
          Stream.of(initialLoad.getRoleNameById(userInfo.get().getRoleId()).split(","))
              .map(SimpleGrantedAuthority::new)
              .collect(Collectors.toList());
      userInfo.get().setRoles(authorities);
    }

    // Converting UserInfo to UserDetails
    return userInfo
        .map(UserInfoDetails::new)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
  }

  public UserInfo addUser(UserInfo userInfo) {
    try {
      // Encode password before saving the user
      userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));

      userInfo = userRepository.save(userInfo);
      log.info("User Added Successfully : {} ", userInfo.getEmail());
    } catch (Exception e) {
      log.error("addUser error : {}", e.toString());
      throw e;
    } finally {
      auditLogService.saveAuditLog(
          Constants.ADD, TABLE_NAME, userInfo.getId(), "", userInfo.getEmail());
    }
    return userInfo;
  }

  public UserInfo updateUser(UserInfo baseRequest, Locale locale) {
    return userRepository
        .findByEmail(baseRequest.getEmail())
        .map(
            userInfo -> {
              userInfo.setFullName(baseRequest.getFullName());
              userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
              userInfo.setRoleId(baseRequest.getRoleId());
              userInfo = userRepository.save(userInfo);

              auditLogService.saveAuditLog(Constants.UPDATE, TABLE_NAME, userInfo.getId(), "", "");

              return userInfo;
            })
        .orElseThrow(
            () -> new CustomException(messageSource.getMessage(USER_NOT_FOUND, null, locale)));
  }

  public List<UserInfo> getListUsers() {
    return userRepository.findAll();
  }

  public UserInfo lockOrUnlockUser(StatusRequest baseRequest, Locale locale) {
    return userRepository
        .findById(baseRequest.getId())
        .map(
            userInfo -> {
              String oldStatus = String.valueOf(userInfo.getStatus());
              userInfo.setStatus(baseRequest.getStatus());
              userInfo = userRepository.save(userInfo);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  userInfo.getId(),
                  oldStatus,
                  String.valueOf(baseRequest.getStatus()));

              return userInfo;
            })
        .orElseThrow(
            () -> new CustomException(messageSource.getMessage(USER_NOT_FOUND, null, locale)));
  }
}
