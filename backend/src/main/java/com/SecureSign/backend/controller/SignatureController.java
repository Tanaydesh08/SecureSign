package com.SecureSign.backend.controller;

import com.SecureSign.backend.entity.Signature;
import com.SecureSign.backend.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
public class SignatureController {
    private final SignatureService signatureService;

    @PostMapping
    public Signature addSignature(
            @RequestParam Long documentId,
            @RequestParam Long userId,
            @RequestParam Integer pageNumber,
            @RequestParam Float xCoordinate,
            @RequestParam Float yCoordinate,
            @RequestParam String signatureImage
    ){
        return signatureService.addSignature(
                documentId,
                userId,
                pageNumber,
                xCoordinate,
                yCoordinate,
                signatureImage
        );
    }
    @GetMapping("/{documentId}")
    public List<Signature> getSignature(
            @PathVariable Long documentId
    ) {
        return signatureService.getSignatureByDocument(documentId);
    }
    @PutMapping("/{id}/status")
    public Signature updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return signatureService.updateSignatureStatus(id, status);
    }
}
