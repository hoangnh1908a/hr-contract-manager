package com.project.hrcm.models.reponse;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomContractData {

  private Integer contractStatusId;
  private String contractType;
}
