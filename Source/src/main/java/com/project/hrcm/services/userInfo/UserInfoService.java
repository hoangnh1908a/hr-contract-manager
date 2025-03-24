package com.project.hrcm.services.userInfo;

import java.util.Optional;

import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.userInfo.UserInfoDetails;
import com.project.hrcm.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserInfoService implements UserDetailsService  {

    @Autowired
    private UserInfoRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userInfo = userRepository.findByEmail(username); // Assuming 'email' is used as username

        // Converting UserInfo to UserDetails
        return userInfo.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String addUser(UserInfo userInfo) {
        // Encode password before saving the user
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        userRepository.save(userInfo);
        return "User Added Successfully";
    }
}
