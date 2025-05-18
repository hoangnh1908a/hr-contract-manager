package com.project.hrcm.models.requests;

import lombok.Data;


@Data
public class ContractApprovalRequest {

    private Integer id;
    private Integer approvedBy;
    private Integer createdBy;

    private String fromDate;
    private String toDate;

    private Integer contactId;
    private Integer contactStatusId;
}
