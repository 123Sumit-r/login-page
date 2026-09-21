package com.skovio.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String password;
    @Column(name = "is_verified", nullable = false) private boolean verified;
    private String otp;
    private Instant otpExpiry;
    private Instant otpSentAt;
    private String resetOtp;
    private Instant resetOtpExpiry;
    private Instant resetOtpSentAt;
    @Column(nullable = false, updatable = false) private Instant createdAt;

    @PrePersist void onCreate() { createdAt = Instant.now(); }
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public Instant getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(Instant otpExpiry) { this.otpExpiry = otpExpiry; }
    public Instant getOtpSentAt() { return otpSentAt; }
    public void setOtpSentAt(Instant otpSentAt) { this.otpSentAt = otpSentAt; }
    public String getResetOtp() { return resetOtp; }
    public void setResetOtp(String resetOtp) { this.resetOtp = resetOtp; }
    public Instant getResetOtpExpiry() { return resetOtpExpiry; }
    public void setResetOtpExpiry(Instant resetOtpExpiry) { this.resetOtpExpiry = resetOtpExpiry; }
    public Instant getResetOtpSentAt() { return resetOtpSentAt; }
    public void setResetOtpSentAt(Instant resetOtpSentAt) { this.resetOtpSentAt = resetOtpSentAt; }
    public Instant getCreatedAt() { return createdAt; }
}