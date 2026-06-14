package com.SecureSign.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "signatures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Signature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer pageNumber;
    private Float xCoordinate;
    private Float yCoordinate;
    private String signatureImage;
    private String status;
    private LocalDateTime signedAt;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private User signer;
}
