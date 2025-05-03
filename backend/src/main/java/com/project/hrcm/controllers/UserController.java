package com.project.hrcm.controllers;


import com.project.hrcm.dto.UserInfoDetails;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.AuthValidateRequest;
import com.project.hrcm.models.requests.UserInfoValidateRequest;
import com.project.hrcm.models.requests.noRequired.UserRequest;
import com.project.hrcm.services.JwtService;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class UserController {

  private final UserInfoService service;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  @GetMapping("/users")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<UserInfo>> users(UserRequest userRequest, Pageable pageable) {
    Page<UserInfo> users = service.getListUsers(userRequest, pageable);
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @GetMapping("/user/userProfile")
  public ResponseEntity<String> userProfile() {
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/user/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<UserInfo> addNewUser(
      @Valid @RequestBody UserInfoValidateRequest userInfoValidateRequest) {
    UserInfo userInfo = new UserInfo();

    BeanUtils.copyProperties(userInfoValidateRequest, userInfo);

    userInfo = service.addUser(userInfo);

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  @PostMapping("/user/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> updateUser(
      @Valid @RequestBody UserInfo userInfoRequest, Locale locale) {

    service.updateUser(userInfoRequest, locale);

    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping("/user/reset-password")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> resetPassword(@RequestBody UserRequest userRequest, Locale locale) {

    if(StringUtils.isNotBlank(userRequest.getEmail())){
        service.resetPassword(userRequest.getEmail(), userRequest.getNewPassword(), locale);
    }else{
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping("/generateToken")
  public ResponseEntity<?> authenticateAndGetToken(
      @Valid @RequestBody AuthValidateRequest authValidateRequest, Locale locale) {
    UserInfoDetails userInfoDetails = null;
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  authValidateRequest.getEmail(), authValidateRequest.getPassword()));

      // Check if authentication was successful
      if (authentication.isAuthenticated()) {
        String token = jwtService.generateToken(authValidateRequest.getEmail());

        Map<String, String> maps = new HashMap<>();

        userInfoDetails = (UserInfoDetails) authentication.getPrincipal();

        if (userInfoDetails.getPasswordFailCount() + 1 > 5) {
          service.setAndCheckLockoutTime(userInfoDetails, locale);
        }

        String data = Utils.gson.toJson(userInfoDetails);

        maps.put("token", token);
        maps.put("user", data);

        return ResponseEntity.ok(maps);
      }

    } catch (BadCredentialsException e) {
      service.setPasswordFailCount(authValidateRequest.getEmail(), locale);

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(Constants.ERROR, "Invalid username or password"));

    } catch (Exception e) {
      service.setPasswordFailCount(authValidateRequest.getEmail(), locale);

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of(Constants.ERROR, "Authentication failed"));
    }
    service.setPasswordFailCount(authValidateRequest.getEmail(), locale);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of(Constants.ERROR, "Invalid login attempt"));
  }
}
