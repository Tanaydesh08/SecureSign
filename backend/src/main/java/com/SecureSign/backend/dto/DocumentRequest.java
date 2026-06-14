package com.SecureSign.backend.dto;

import jakarta.mail.Multipart;
import lombok.Data;

@Data
public class DocumentRequest {
    private String title;
    private Multipart file;
}