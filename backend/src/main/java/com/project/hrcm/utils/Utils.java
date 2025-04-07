package com.project.hrcm.utils;

import java.lang.reflect.Type;
import java.util.Locale;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.context.MessageSource;

public class Utils {

  public static Gson gson = new Gson();

  public static String formatMessage(
      MessageSource messageSource, Locale locale, String tableName, String codeMessage) {
    return messageSource.getMessage(tableName.toLowerCase(), null, locale)
        + " "
        + messageSource.getMessage(codeMessage, null, locale);
  }

  // Document
  public static Map<String, String> covertObjectToMap(Object object) {
    // 1. Serialize DTO to JSON
    String json = gson.toJson(object);

    // 2. Define the target type
    Type mapType = new TypeToken<Map<String, String>>() {}.getType();

    // 3. Deserialize JSON back into Map<String, String>

    return gson.fromJson(json, mapType);
  }
}
