package com.SecureSign.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignatureRequest {
    private Long documentId;
    private Long userId;
    private Integer pageNumber;
    private Float xCoordinate;
    private Float yCoordinate;
    private String signatureImage;
    private String signatureFont;
}
