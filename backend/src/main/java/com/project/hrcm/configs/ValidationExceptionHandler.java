package com.project.hrcm.configs;

import java.util.HashMap;
import java.util.Map;

import com.project.hrcm.utils.Constants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ValidationExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(
            error -> {
              errors.put(Constants.MESSAGE, error.getDefaultMessage());
            });
    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
  }


  // Custom
  @ExceptionHandler(CustomException.class)
  public ResponseEntity<?> handleCustomException(CustomException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of(Constants.MESSAGE, e.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleGeneralException(Exception e) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.of(Constants.MESSAGE, e.getMessage()));
  }
}
