package com.skovio.auth.dto;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(@NotBlank @Size(max = 100) String name, @NotBlank @Email String email, @NotBlank @Size(min = 8, max = 72) String password) {}
    public record VerifyOtpRequest(@NotBlank @Email String email, @NotBlank @Pattern(regexp = "\\d{6}") String otp) {}
    public record ResendOtpRequest(@NotBlank @Email String email) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record ForgotPasswordRequest(@NotBlank @Email String email) {}
    public record ResetPasswordRequest(@NotBlank @Email String email, @NotBlank @Pattern(regexp = "\\d{6}") String otp, @NotBlank @Size(min = 8, max = 72) String newPassword) {}
    public record ProfileUpdateRequest(@NotBlank @Size(max = 100) String name) {}
    public record MessageResponse(String message) {}
    public record LoginResponse(String token, UserResponse user) {}
    public record UserResponse(Long id, String name, String email, boolean verified) {}
}