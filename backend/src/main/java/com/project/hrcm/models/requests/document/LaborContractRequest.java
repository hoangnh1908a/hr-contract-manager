package com.project.hrcm.models.requests.document;

import com.project.hrcm.models.requests.noRequired.EmployeeRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LaborContractRequest extends EmployeeRequest {

  private String fileName;
  private String name;
  private String date;
  private String address;
}
