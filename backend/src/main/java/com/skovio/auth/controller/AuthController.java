package com.skovio.auth.controller;

import com.skovio.auth.dto.AuthDtos.*;
import com.skovio.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }
    @PostMapping("/register") public MessageResponse register(@Valid @RequestBody RegisterRequest request) { return auth.register(request); }
    @PostMapping("/verify-otp") public MessageResponse verify(@Valid @RequestBody VerifyOtpRequest request) { return auth.verify(request); }
    @PostMapping("/resend-otp") public MessageResponse resend(@Valid @RequestBody ResendOtpRequest request) { return auth.resend(request); }
    @PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }
    @PostMapping("/forgot-password") public MessageResponse forgot(@Valid @RequestBody ForgotPasswordRequest request) { return auth.forgot(request); }
    @PostMapping("/reset-password") public MessageResponse reset(@Valid @RequestBody ResetPasswordRequest request) { return auth.reset(request); }
}