package com.SecureSign.backend.dto;

import lombok.Data;

@Data
public class SignatureRequest {
    private Long documentId;
    private Integer pageNumber;
    private Float xCoordinate;
    private Float yCoordinate;

}
