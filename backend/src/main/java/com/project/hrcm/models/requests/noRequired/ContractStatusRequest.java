package com.project.hrcm.models.requests.noRequired;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContractStatusRequest {

    private Integer id;

    @NotBlank(message = "The name is required.")
    private String name;

    @NotBlank(message = "The name is required.")
    private String nameEn;

    @NotBlank(message = "The description is required.")
    private String description;
}
