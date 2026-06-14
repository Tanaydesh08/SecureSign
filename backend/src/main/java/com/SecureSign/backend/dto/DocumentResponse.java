package com.SecureSign.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String title;
    private String fileName;
    private String status;
}
