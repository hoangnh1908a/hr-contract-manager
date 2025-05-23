package com.project.hrcm.configs;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Locale;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.LocaleResolver;

public class CustomLocaleResolve implements LocaleResolver {

  @SuppressWarnings("null")
  @Override
  public Locale resolveLocale(HttpServletRequest request) {
    String lang = request.getParameter("lang");

    if (StringUtils.hasText(lang)) {
      return Locale.forLanguageTag(lang);
    }

    String acceptLanguageHeader = request.getHeader("Accept-Language");
    if (StringUtils.hasText(acceptLanguageHeader)) {
      return request.getLocale();
    }

    return Locale.getDefault();
  }

  @SuppressWarnings("null")
  @Override
  public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {}
}
