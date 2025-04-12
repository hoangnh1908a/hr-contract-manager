package com.project.hrcm.utils;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import org.springframework.context.MessageSource;

import static org.hibernate.validator.internal.engine.messageinterpolation.el.RootResolver.FORMATTER;

public class Utils {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  // Adapter to handle LocalDateTime

    // Create a new Gson instance using inline adapters for LocalDateTime
    public static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
              @Override
              public JsonElement serialize(LocalDateTime src, Type typeOfSrc, JsonSerializationContext context) {
                return new JsonPrimitive(src.format(FORMATTER));
              }
            })
            .registerTypeAdapter(LocalDateTime.class, new JsonDeserializer<LocalDateTime>() {
              @Override
              public LocalDateTime deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
                return LocalDateTime.parse(json.getAsString(), FORMATTER);
              }
            })
            .create();

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
