package com.skovio.auth.security;

import com.skovio.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository users;
    public CustomUserDetailsService(UserRepository users) { this.users = users; }
    @Override public UserDetails loadUserByUsername(String email) { return users.findByEmailIgnoreCase(email).map(user -> User.withUsername(user.getEmail()).password(user.getPassword()).roles("USER").build()).orElseThrow(() -> new UsernameNotFoundException("User not found")); }
}