package com.project.hrcm.models.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class DownloadContractResponse {

    private String fileName;
    private byte[] file;
}
