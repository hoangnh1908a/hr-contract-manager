package com.project.hrcm.utils;

import java.util.Locale;
import org.springframework.context.MessageSource;

public class Utils {

  public static String formatMessage(
      MessageSource messageSource, Locale locale, String tableName, String codeMessage) {
    return messageSource.getMessage(tableName.toLowerCase(), null, locale)
        + " "
        + messageSource.getMessage(codeMessage, null, locale);
  }
}
