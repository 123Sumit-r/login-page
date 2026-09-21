package com.skovio.auth.controller;

import com.skovio.auth.dto.AuthDtos.*;
import jakarta.validation.Valid;
import com.skovio.auth.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final AuthService auth;
    public UserController(AuthService auth) { this.auth = auth; }
    @GetMapping("/me") public UserResponse me(Authentication authentication) { return auth.current(authentication.getName()); }
    @PutMapping("/me") public UserResponse update(Authentication authentication, @Valid @RequestBody ProfileUpdateRequest request) { return auth.updateProfile(authentication.getName(), request); }
}