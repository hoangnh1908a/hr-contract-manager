package com.project.hrcm.controllers;

import java.util.Locale;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/test")
public class TestController {

  private final MessageSource messageSource;

  @GetMapping
  public String getTest(Locale locale) {

    MDC.put("requestId", "requestId");
    MDC.put("username", "request.getRemoteAddr()");

    return messageSource.getMessage("Welcome_message", null, locale);
  }
}
