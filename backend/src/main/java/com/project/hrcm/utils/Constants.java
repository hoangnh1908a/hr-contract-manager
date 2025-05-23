package com.project.hrcm.utils;

public class Constants {

  public static final String EN = "en";

  // RESPONSE
  public static final String SUCCESS = "success";
  public static final String ERROR = "error";
  public static final String MESSAGE = "message";

  // ROLE
  /*
   * FULL : LEAD -> MANAGER -> SOD -> HOD -> HRD -> CEO
   * */
  public static final String ROLE_ADMIN = "ADMIN";
  public static final String ROLE_HR = "HR";
  public static final String ROLE_TEAM_LEAD = "TEAM_LEAD";
  public static final String ROLE_MANAGER = "MANAGER";
  public static final String ROLE_HOD = "HOD"; // Head of Division
  public static final String ROLE_SOD = "SOD"; //  Secretary of Division
  public static final String ROLE_HD = "HRD"; //  HR Director
  public static final String ROLE_CEO = "CEO"; // CEO

  // ACTION
  public static final String ADD = "ADD";
  public static final String UPDATE = "UPDATE";
  public static final String DELETE = "DELETE";
  public static final String GET_ID = "GET_ID";
  public static final String RESET_PASSWORD = "RESET_PASSWORD";

  //  MESSAGE LANGUAGE
  public static final String NOT_FOUND = "not_found";
  public static final String NAME_EXISTS = "name_exists";
  public static final String USER_LOCK = "user_lock";
}
