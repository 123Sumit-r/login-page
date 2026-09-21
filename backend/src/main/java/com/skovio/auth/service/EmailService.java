package com.skovio.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender sender; private final String from;
    public EmailService(JavaMailSender sender, @Value("${app.mail.from}") String from) { this.sender = sender; this.from = from; }
    public void sendOtp(String email, String otp, boolean reset) { SimpleMailMessage message = new SimpleMailMessage(); message.setFrom(from); message.setTo(email); message.setSubject(reset ? "Skovio password reset code" : "Skovio email verification code"); message.setText(reset ? "Your Skovio password reset code is " + otp + ". It expires in 5 minutes." : "Your Skovio email verification code is " + otp + ". It expires in 5 minutes."); sender.send(message); }
}