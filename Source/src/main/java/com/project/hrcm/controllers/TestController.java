package com.project.hrcm.controllers;

import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

import java.util.Locale;

import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {

    private final MessageSource messageSource;

    public TestController(MessageSource messageSource){
        this.messageSource = messageSource;
    }

    @GetMapping
    public String getTest(Locale locale) {

        MDC.put("requestId", "requestId");
        MDC.put("username", "request.getRemoteAddr()");

        log.info(messageSource.getMessage("Welcome_message", null, locale));

        return messageSource.getMessage("Welcome_message", null, locale);
    }


    @GetMapping("/1")
    public String getTest1(Locale locale) {
        try {
            MDC.put("requestId", "requestId1");
            MDC.put("username", "request.getRemoteAddr()1");
    
            log.info(messageSource.getMessage("Welcome_message", null, locale));
    
            return messageSource.getMessage("Welcome_message", null, locale);
        } catch (Exception e) {
            MDC.clear();
        }
        return "";
    }
}
