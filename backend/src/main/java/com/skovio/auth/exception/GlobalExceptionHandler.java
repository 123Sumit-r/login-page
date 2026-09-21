package com.skovio.auth.exception;

import com.skovio.auth.dto.AuthDtos.MessageResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<MessageResponse> api(ApiException ex) { return ResponseEntity.status(ex.getStatus()).body(new MessageResponse(ex.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<MessageResponse> validation(MethodArgumentNotValidException ex) { String message = ex.getBindingResult().getFieldErrors().stream().map(error -> error.getField() + ": " + error.getDefaultMessage()).collect(Collectors.joining(", ")); return ResponseEntity.badRequest().body(new MessageResponse(message)); }
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<MessageResponse> duplicate() { return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("Email already registered.")); }
    @ExceptionHandler(Exception.class)
    ResponseEntity<MessageResponse> unexpected() { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Unexpected server error.")); }
}