package com.skovio.auth.service;

import com.skovio.auth.dto.AuthDtos.*;
import com.skovio.auth.entity.User;
import com.skovio.auth.exception.ApiException;
import com.skovio.auth.repository.UserRepository;
import com.skovio.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.*;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final EmailService email; private final JwtService jwt; private final long otpExpiryMinutes; private final long cooldownSeconds; private final SecureRandom random = new SecureRandom();
    public AuthService(UserRepository users, PasswordEncoder encoder, EmailService email, JwtService jwt, @Value("${app.otp.expiry-minutes}") long expiry, @Value("${app.otp.cooldown-seconds}") long cooldown) { this.users = users; this.encoder = encoder; this.email = email; this.jwt = jwt; this.otpExpiryMinutes = expiry; this.cooldownSeconds = cooldown; }
    private String normalize(String email) { return email.trim().toLowerCase(); }
    private String otp() { return String.format("%06d", random.nextInt(1_000_000)); }
    private void checkCooldown(Instant sentAt) { if (sentAt != null && sentAt.plusSeconds(cooldownSeconds).isAfter(Instant.now())) throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Please wait before requesting another OTP."); }
    private void issueOtp(User user, boolean reset) { String code = otp(); Instant now = Instant.now(); if (reset) { user.setResetOtp(encoder.encode(code)); user.setResetOtpExpiry(now.plus(otpExpiryMinutes, ChronoUnit.MINUTES)); user.setResetOtpSentAt(now); } else { user.setOtp(encoder.encode(code)); user.setOtpExpiry(now.plus(otpExpiryMinutes, ChronoUnit.MINUTES)); user.setOtpSentAt(now); } users.save(user); email.sendOtp(user.getEmail(), code, reset); }
    @Transactional public MessageResponse register(RegisterRequest request) { String emailAddress = normalize(request.email()); User user = users.findByEmailIgnoreCase(emailAddress).orElseGet(User::new); if (user.getId() != null && user.isVerified()) throw new ApiException(HttpStatus.CONFLICT, "Email already registered."); user.setName(request.name().trim()); user.setEmail(emailAddress); user.setPassword(encoder.encode(request.password())); user.setVerified(false); checkCooldown(user.getOtpSentAt()); users.save(user); issueOtp(user, false); return new MessageResponse("Registration successful. OTP sent to your email."); }
    @Transactional public MessageResponse verify(VerifyOtpRequest request) { User user = find(request.email()); if (user.isVerified()) throw new ApiException(HttpStatus.CONFLICT, "Email is already verified."); if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(Instant.now())) throw new ApiException(HttpStatus.BAD_REQUEST, "OTP has expired."); if (user.getOtp() == null || !encoder.matches(request.otp(), user.getOtp())) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid OTP."); user.setVerified(true); user.setOtp(null); user.setOtpExpiry(null); user.setOtpSentAt(null); users.save(user); return new MessageResponse("Email verified successfully."); }
    @Transactional public MessageResponse resend(ResendOtpRequest request) { User user = find(request.email()); if (user.isVerified()) throw new ApiException(HttpStatus.CONFLICT, "Email is already verified."); checkCooldown(user.getOtpSentAt()); issueOtp(user, false); return new MessageResponse("A new OTP has been sent to your email."); }
    @Transactional public LoginResponse login(LoginRequest request) { User user = users.findByEmailIgnoreCase(normalize(request.email())).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.")); if (!encoder.matches(request.password(), user.getPassword())) throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."); if (!user.isVerified()) throw new ApiException(HttpStatus.FORBIDDEN, "Please verify your email first."); return new LoginResponse(jwt.generate(user.getEmail()), toResponse(user)); }
    @Transactional public MessageResponse forgot(ForgotPasswordRequest request) { users.findByEmailIgnoreCase(normalize(request.email())).ifPresent(user -> { checkCooldown(user.getResetOtpSentAt()); issueOtp(user, true); }); return new MessageResponse("If an account exists for that email, password reset instructions have been sent."); }
    @Transactional public MessageResponse reset(ResetPasswordRequest request) { User user = users.findByEmailIgnoreCase(normalize(request.email())).orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid reset OTP.")); if (user.getResetOtpExpiry() == null || user.getResetOtpExpiry().isBefore(Instant.now())) throw new ApiException(HttpStatus.BAD_REQUEST, "Reset OTP has expired."); if (user.getResetOtp() == null || !encoder.matches(request.otp(), user.getResetOtp())) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid reset OTP."); user.setPassword(encoder.encode(request.newPassword())); user.setResetOtp(null); user.setResetOtpExpiry(null); user.setResetOtpSentAt(null); users.save(user); return new MessageResponse("Password updated successfully."); }
    public UserResponse current(String email) { return toResponse(find(email)); }
    @Transactional public UserResponse updateProfile(String email, ProfileUpdateRequest request) { User user = find(email); user.setName(request.name().trim()); return toResponse(users.save(user)); }
    public UserResponse toResponse(User user) { return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.isVerified()); }
    public User find(String email) { return users.findByEmailIgnoreCase(normalize(email)).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found.")); }
}