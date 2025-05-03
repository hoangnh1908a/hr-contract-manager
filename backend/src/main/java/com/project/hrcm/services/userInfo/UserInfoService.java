package com.project.hrcm.services.userInfo;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.dto.UserInfoDetails;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.noRequired.UserRequest;
import com.project.hrcm.repository.UserInfoRepository;
import com.project.hrcm.services.AuditLogService;
import com.project.hrcm.services.MailService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.InitialLoad;
import com.project.hrcm.utils.Utils;
import jakarta.mail.MessagingException;
import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
  private final MailService mailService;

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

  public static Specification<UserInfo> filterBy(UserRequest userRequest) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (StringUtils.isNotBlank(userRequest.getFullName())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("fullName")),
                "%" + userRequest.getFullName().toLowerCase() + "%"));
      }
      if (userRequest.getRoleId() != null) {
        predicates.add(cb.equal(root.get("roleId"), userRequest.getRoleId()));
      }
      if (StringUtils.isNotBlank(userRequest.getEmail())) {
        predicates.add(
            cb.like(cb.lower(root.get("email")), "%" + userRequest.getEmail().toLowerCase() + "%"));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    log.info(" Load user : {}", email);
    Optional<UserInfo> userInfo = userRepository.findByEmailAndStatus(email, 1);
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

      String newPassword = Utils.generatePassword(16);
      // Encode password before saving the user
      userInfo.setPassword(passwordEncoder.encode(newPassword));
      userInfo.setForcePasswordChangeOnLogin(1); // reset pass when login
      userInfo.setPasswordFailCount(0);
      userInfo.setPasswordExpiryDate(
          LocalDateTime.now().plusMonths(3)); // default 3month reset pass

      userInfo = userRepository.save(userInfo);
      log.info("User Added Successfully : {} ", userInfo.getEmail());

      try {
        sendPasswordForNewUser(userInfo.getEmail(), newPassword);
      } catch (MessagingException | IOException ex) {
        throw new RuntimeException(ex);
      }
    } catch (Exception e) {
      log.error("addUser error : {}", e.toString());
      throw e;
    } finally {
      auditLogService.saveAuditLog(
          Constants.ADD, TABLE_NAME, userInfo.getId(), "", Utils.gson.toJson(userInfo));
    }
    return userInfo;
  }

  public void updateUser(UserInfo baseRequest, Locale locale) {

    Optional<UserInfo> userInfo = userRepository.findById(baseRequest.getId());
    userInfo.ifPresentOrElse(
        (e -> {
          if (StringUtils.isNotBlank(baseRequest.getFullName()))
            e.setFullName(baseRequest.getFullName());

          if (StringUtils.isNotBlank(baseRequest.getEmail())) e.setEmail(baseRequest.getEmail());

          if (StringUtils.isNotBlank(baseRequest.getFullName()))
            e.setPassword(passwordEncoder.encode(baseRequest.getPassword()));

          if (baseRequest.getRoleId() != null) e.setRoleId(baseRequest.getRoleId());

          e.setForcePasswordChangeOnLogin(1);

          if (baseRequest.getStatus() != null) e.setStatus(baseRequest.getStatus());

          UserInfo save = userRepository.save(e);

          auditLogService.saveAuditLog(
              Constants.UPDATE,
              TABLE_NAME,
              baseRequest.getId(),
              Utils.gson.toJson(userInfo),
              Utils.gson.toJson(save));
        }),
        () -> {
          String errorMessage =
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND);
          // Log the error message
          throw new CustomException(errorMessage);
        });
  }

  public void resetPassword(String email, String password, Locale locale) {

    Optional<UserInfo> userInfo = userRepository.findByEmail(email);

    userInfo.ifPresentOrElse(
        (e -> {
          String old = Utils.gson.toJson(e);
          String newPassword = Utils.generatePassword(16);
          if (StringUtils.isNotBlank(password)) { // user change pass
            newPassword = password;
            e.setForcePasswordChangeOnLogin(0);
          } else {
            e.setForcePasswordChangeOnLogin(1);
          }

          e.setPassword(passwordEncoder.encode(newPassword));
          // reset pass when login
          UserInfo save = userRepository.save(e);

          auditLogService.saveAuditLog(
              Constants.RESET_PASSWORD, TABLE_NAME, save.getId(), old, Utils.gson.toJson(save));
          try {
            sendPasswordForNewUser(e.getEmail(), newPassword);
          } catch (MessagingException | IOException ex) {
            throw new RuntimeException(ex);
          }
        }),
        () -> {
          String errorMessage =
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND);
          // Log the error message
          throw new CustomException(errorMessage);
        });
  }

  public Page<UserInfo> getListUsers(UserRequest userRequest, Pageable pageable) {
    Specification<UserInfo> spec = filterBy(userRequest);
    return userRepository.findAll(spec, pageable);
  }

  public void sendPasswordForNewUser(String email, String password)
      throws MessagingException, IOException {
    Map<String, String> variables = new HashMap<>();
    variables.put("email", email);
    variables.put("password", password);

    mailService.sendHtmlEmail(email, "User Information!", "new-user-template", variables);
  }

  public void setPasswordFailCount(String email, Locale locale) {
    userRepository
        .findByEmail(email)
        .map(
            userInfo -> {
              String old = Utils.gson.toJson(userInfo);
              userInfo.setPasswordFailCount(userInfo.getPasswordFailCount() + 1);
              userInfo = userRepository.save(userInfo);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, userInfo.getId(), old, Utils.gson.toJson(userInfo));
              return userInfo;
            })
        .orElseThrow(
            () -> new CustomException(messageSource.getMessage(USER_NOT_FOUND, null, locale)));
  }

  public void setAndCheckLockoutTime(UserInfoDetails userInfoDetails, Locale locale) {
    long timeout = 0;
    UserInfo userInfo = userRepository.findByEmail(userInfoDetails.getUsername()).orElse(null);
    String old = Utils.gson.toJson(userInfo);
    if (userInfo != null) {
      if (userInfoDetails.getLockoutTime() == null) {
        userInfo.setLockoutTime(LocalDateTime.now().plusMinutes(15)); // lock 15 when pass fail 5
        timeout = 15;
      } else {
        timeout = Duration.between(userInfo.getLockoutTime(), LocalDateTime.now()).toMinutes();
        if (timeout > 15) {
          userInfo.setPasswordFailCount(0);
          userInfo.setLockoutTime(null);

          userRepository.save(userInfo);

          return;
        }
      }

      userRepository.save(userInfo);

      auditLogService.saveAuditLog(
          Constants.UPDATE, TABLE_NAME, userInfo.getId(), old, Utils.gson.toJson(userInfo));

      throw new CustomException(
          Utils.formatMessage(messageSource, locale, TABLE_NAME.toLowerCase(), Constants.USER_LOCK)
              + timeout
              + " m");
    }
  }
}
