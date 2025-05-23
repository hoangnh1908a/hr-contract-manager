package com.project.hrcm.controllers;

import com.project.hrcm.services.MailService;
import jakarta.mail.MessagingException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/test")
public class TestController {

  private final MessageSource messageSource;
  private final MailService mailService;

  @GetMapping
  public String getTest(Locale locale) throws MessagingException, IOException {

    Map<String, String> variables = new HashMap<>();
    variables.put("name", "Ten nhan mail");
    variables.put("email", "hoangnhjetbrains@gmail.com");
    variables.put("confirmationLink", "linkabc");

    mailService.sendHtmlEmail(
        "hoangnhjetbrains@gmail.com", "Welcome to Our Service!", "email-template", variables);

    return messageSource.getMessage("Welcome_message", null, locale);
  }
}
