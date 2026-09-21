package com.skovio.auth.config;

import com.skovio.auth.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import java.nio.charset.StandardCharsets;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception { AuthenticationEntryPoint entryPoint = (request, response, exception) -> { response.setStatus(401); response.setContentType("application/json"); response.getOutputStream().write("{\"message\":\"Unauthorized request.\"}".getBytes(StandardCharsets.UTF_8)); }; return http.csrf(csrf -> csrf.disable()).cors(cors -> {}).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).exceptionHandling(errors -> errors.authenticationEntryPoint(entryPoint)).authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().requestMatchers("/api/auth/**", "/error").permitAll().anyRequest().authenticated()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build(); }
    @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.frontend-url}") String frontendUrl) { CorsConfiguration config = new CorsConfiguration(); config.setAllowedOrigins(List.of(frontendUrl)); config.setAllowedMethods(List.of("GET", "POST", "PUT", "OPTIONS")); config.setAllowedHeaders(List.of("Authorization", "Content-Type")); config.setAllowCredentials(false); UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**", config); return source; }
}