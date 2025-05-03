package com.project.hrcm.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;

  public void sendHtmlEmail(
      String to, String subject, String templateName, Map<String, String> variables)
      throws MessagingException, IOException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

    // Load HTML template from resources
    String htmlContent = loadTemplate(templateName);

    // Replace placeholders with actual values
    for (Map.Entry<String, String> entry : variables.entrySet()) {
      htmlContent = htmlContent.replace("{{" + entry.getKey() + "}}", entry.getValue());
    }

    helper.setFrom("companyABC.com");
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(htmlContent, true); // Enable HTML content

    mailSender.send(message);
  }

  private String loadTemplate(String templateName) throws IOException {
    ClassPathResource resource = new ClassPathResource("templates/" + templateName + ".html");
    return Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);
  }
}
