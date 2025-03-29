package com.project.hrcm.services.userInfo;

import com.project.hrcm.dto.UserInfoDetails;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.repository.UserInfoRepository;
import com.project.hrcm.services.AuditLogService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.InitialLoad;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private InitialLoad initialLoad;

    @Autowired
    private AuditLogService auditLogService;

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
        try {
            // Encode password before saving the user
            userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));

            userInfo = userRepository.save(userInfo);
            log.info("User Added Successfully : {} ", userInfo.getEmail());
        } catch (Exception e) {
            log.error("addUser error : {}", e.toString());
            throw e;
        } finally {
            auditLogService.saveAuditLog(Constants.ADD, "USERS", userInfo.getId(), "", userInfo.getEmail());
        }
        return userInfo;
    }


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
}
