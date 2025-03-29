package com.project.hrcm.controllers;

import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.AuthRequest;
import com.project.hrcm.models.requests.UserInfoRequest;
import com.project.hrcm.services.JwtService;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class UserController {

  private final UserInfoService service;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  @PostMapping("/addNewUser")
  public ResponseEntity<UserInfo> addNewUser(@Valid @RequestBody UserInfoRequest userInfoRequest) {
    UserInfo userInfo = new UserInfo();

    BeanUtils.copyProperties(userInfoRequest, userInfo);

    userInfo = service.addUser(userInfo);

    return new ResponseEntity<>(userInfo, HttpStatus.OK);
  }

  @PostMapping("/generateToken")
  public ResponseEntity<String> authenticateAndGetToken(
      @Valid @RequestBody AuthRequest authRequest) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authRequest.getEmail(), authRequest.getPassword()));

    if (authentication.isAuthenticated()) {
      return ResponseEntity.ok(jwtService.generateToken(authRequest.getEmail()));
    } else {
      throw new UsernameNotFoundException("Invalid user request!");
    }
  }

  @GetMapping("/user/userProfile")
//  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> userProfile() {
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
