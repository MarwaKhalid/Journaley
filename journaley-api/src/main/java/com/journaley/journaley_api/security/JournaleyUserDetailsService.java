package com.journaley.journaley_api.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.UserRepository;

@Service
public class JournaleyUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public JournaleyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String email = username;

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                true,
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }
}

