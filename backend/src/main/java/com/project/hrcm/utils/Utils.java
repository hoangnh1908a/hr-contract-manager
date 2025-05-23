package com.project.hrcm.utils;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.stream.IntStream;
import org.springframework.context.MessageSource;

public class Utils {

  private static final DateTimeFormatter DATE_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

  public static final Gson gson =
      new GsonBuilder()
          // LocalDateTime Adapter
          .registerTypeAdapter(
              LocalDateTime.class,
              new JsonSerializer<LocalDateTime>() {
                @Override
                public JsonElement serialize(
                    LocalDateTime src, Type typeOfSrc, JsonSerializationContext context) {
                  return new JsonPrimitive(src.format(DATE_TIME_FORMATTER));
                }
              })
          .registerTypeAdapter(
              LocalDateTime.class,
              new JsonDeserializer<LocalDateTime>() {
                @Override
                public LocalDateTime deserialize(
                    JsonElement json, Type typeOfT, JsonDeserializationContext context)
                    throws JsonParseException {
                  return LocalDateTime.parse(json.getAsString(), DATE_TIME_FORMATTER);
                }
              })
          // LocalDate Adapter
          .registerTypeAdapter(
              LocalDate.class,
              new JsonSerializer<LocalDate>() {
                @Override
                public JsonElement serialize(
                    LocalDate src, Type typeOfSrc, JsonSerializationContext context) {
                  return new JsonPrimitive(src.format(DATE_FORMATTER));
                }
              })
          .registerTypeAdapter(
              LocalDate.class,
              new JsonDeserializer<LocalDate>() {
                @Override
                public LocalDate deserialize(
                    JsonElement json, Type typeOfT, JsonDeserializationContext context)
                    throws JsonParseException {
                  return LocalDate.parse(json.getAsString(), DATE_FORMATTER);
                }
              })
          .create();

  private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
  private static final String DIGITS = "0123456789";
  private static final String SPECIAL = "!@#$%&*()_+-=[]{}|;:'\",./<>?";
  private static final String ALL_CHARS = UPPER + LOWER + DIGITS + SPECIAL;

  // Adapter to handle LocalDateTime
  private static final Random random = new SecureRandom();

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

  public static String generatePassword(int length) {
    if (length <= 0) {
      throw new IllegalArgumentException("Password length must be a positive integer.");
    }

    StringBuilder password = new StringBuilder(length);

    // Ensure at least one character from each set (optional but recommended for strong passwords)
    password.append(getRandomChar(UPPER));
    password.append(getRandomChar(LOWER));
    password.append(getRandomChar(DIGITS));
    password.append(getRandomChar(SPECIAL));

    // Fill the rest of the password with random characters from all sets
    IntStream.range(password.length(), length)
        .forEach(i -> password.append(getRandomChar(ALL_CHARS)));

    // Shuffle the password to make it more random
    for (int i = 0; i < password.length(); i++) {
      int randomIndexToSwap = random.nextInt(password.length());
      char temp = password.charAt(randomIndexToSwap);
      password.setCharAt(randomIndexToSwap, password.charAt(i));
      password.setCharAt(i, temp);
    }

    return password.toString();
  }

  private static char getRandomChar(String characterSet) {
    return characterSet.charAt(random.nextInt(characterSet.length()));
  }
}
