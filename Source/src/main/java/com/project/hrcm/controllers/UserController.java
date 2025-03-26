package com.project.hrcm.controllers;

import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.AuthRequest;
import com.project.hrcm.services.JwtService;
import com.project.hrcm.models.requests.UserInfoRequest;
import com.project.hrcm.services.userInfo.UserInfoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

        return new ResponseEntity<>(userInfo, HttpStatus.CREATED);
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/generateToken")
    public String authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authRequest.getEmail());
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

}
