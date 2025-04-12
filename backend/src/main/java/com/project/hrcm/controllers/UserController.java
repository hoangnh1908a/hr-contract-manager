package com.project.hrcm.controllers;

import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.AuthValidateRequest;
import com.project.hrcm.models.requests.StatusValidateRequest;
import com.project.hrcm.models.requests.UserInfoValidateRequest;
import com.project.hrcm.services.JwtService;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
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
  public ResponseEntity<List<UserInfo>> users() {
    List<UserInfo> users = service.getListUsers();
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @GetMapping("/user/userProfile")
  public ResponseEntity<String> userProfile() {
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/addNewUser")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<UserInfo> addNewUser(@Valid @RequestBody UserInfoValidateRequest userInfoValidateRequest) {
    UserInfo userInfo = new UserInfo();

    BeanUtils.copyProperties(userInfoValidateRequest, userInfo);

    userInfo = service.addUser(userInfo);

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  @PostMapping("/updateUser")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<UserInfo> updateUser(
      @Valid @RequestBody UserInfo userInfoRequest, Locale locale) {

    UserInfo userInfo = service.updateUser(userInfoRequest, locale);

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<UserInfo> lockUser(
          @Valid @RequestBody StatusValidateRequest statusValidateRequest, Locale locale) {

    UserInfo userInfo = service.lockOrUnlockUser(statusValidateRequest, locale);

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  @PostMapping("/generateToken")
  public ResponseEntity<?> authenticateAndGetToken(@Valid @RequestBody AuthValidateRequest authValidateRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  authValidateRequest.getEmail(), authValidateRequest.getPassword()));

      // Check if authentication was successful
      if (authentication.isAuthenticated()) {
        String token = jwtService.generateToken(authValidateRequest.getEmail());

        Map<String, String> maps = new HashMap<>();
        String data = Utils.gson.toJson(authentication.getPrincipal());

        maps.put("token", token);
        maps.put("user", data);

        return ResponseEntity.ok(maps);
      }

    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(Constants.ERROR, "Invalid username or password"));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of(Constants.ERROR, "Authentication failed"));
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of(Constants.ERROR, "Invalid login attempt"));
  }
}
