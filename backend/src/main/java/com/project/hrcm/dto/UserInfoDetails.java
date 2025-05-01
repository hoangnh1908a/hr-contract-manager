package com.project.hrcm.dto;

import com.project.hrcm.entities.UserInfo;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserInfoDetails implements UserDetails {

  private final String username;
  @Getter private final String fullName;
  private final String password;
  @Getter private final Integer forcePasswordChangeOnLogin;
  @Getter private final Integer passwordFailCount;
  @Getter private final LocalDateTime passwordExpiryDate;
  @Getter private final LocalDateTime lockoutTime;

  private final List<GrantedAuthority> authorities;

  public UserInfoDetails(UserInfo userInfo) {
    this.username = userInfo.getEmail(); // Use email as username
    this.password = userInfo.getPassword();
    this.fullName = userInfo.getFullName();
    this.forcePasswordChangeOnLogin = userInfo.getForcePasswordChangeOnLogin();
    this.passwordFailCount = userInfo.getPasswordFailCount();
    this.passwordExpiryDate = userInfo.getPasswordExpiryDate();
    this.lockoutTime = userInfo.getLockoutTime();
    this.authorities = userInfo.getRoles();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
