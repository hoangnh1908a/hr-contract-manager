package com.project.hrcm.services.userInfo;

import com.project.hrcm.dto.UserInfoDetails;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.repository.UserInfoRepository;
import com.project.hrcm.utils.InitialLoad;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private InitialLoad initialLoad;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info(" Load user : {}", email);
        Optional<UserInfo> userInfo = userRepository.findByEmail(email);
        /**
         * get role
         * */
        if (userInfo.isPresent()) {
            List<GrantedAuthority> authorities = Stream.of(initialLoad.getRoleNameById(userInfo.get().getRoleId()).split(",")).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
            userInfo.get().setRoles(authorities);
        }

        // Converting UserInfo to UserDetails
        return userInfo.map(UserInfoDetails::new).orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public UserInfo addUser(UserInfo userInfo) {

        // Encode password before saving the user
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));

        userInfo = userRepository.save(userInfo);
        log.info("User Added Successfully : {} ", userInfo.getEmail());

        return userInfo;
    }
}
