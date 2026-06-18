package com.SecureSign.backend.controller;

import com.SecureSign.backend.dto.SignatureRequest;
import com.SecureSign.backend.entity.Signature;
import com.SecureSign.backend.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
public class SignatureController {
    private final SignatureService signatureService;

    @PostMapping
    public Signature addSignature(
            @RequestBody SignatureRequest request,
            Authentication authentication
    ) {
        return signatureService.addSignature(
                request.getDocumentId(),
                request.getUserId(),
                authentication != null ? authentication.getName() : null,
                request.getPageNumber(),
                request.getXCoordinate(),
                request.getYCoordinate(),
                request.getSignatureImage(),
                request.getSignatureFont()
        );
    }

    @GetMapping("/{documentId}")
    public List<Signature> getSignatures(
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
