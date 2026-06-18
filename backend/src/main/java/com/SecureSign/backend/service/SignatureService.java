package com.SecureSign.backend.service;

import com.SecureSign.backend.entity.Document;
import com.SecureSign.backend.entity.Signature;
import com.SecureSign.backend.entity.User;
import com.SecureSign.backend.enums.DocumentStatus;
import com.SecureSign.backend.repository.DocumentRepository;
import com.SecureSign.backend.repository.SignatureRepository;
import com.SecureSign.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SignatureService {
    private final SignatureRepository signatureRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public Signature addSignature(
            Long documentId,
            Long userId,
            String signerEmail,
            Integer pageNumber,
            Float xCoordinate,
            Float yCoordinate,
            String signatureImage,
            String signatureFont
    ){
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User signer = resolveSigner(userId, signerEmail);

        Signature signature = Signature.builder()
                .document(document)
                .signer(signer)
                .pageNumber(pageNumber)
                .xCoordinate(xCoordinate)
                .yCoordinate(yCoordinate)
                .signatureImage(signatureImage)
                .signatureFont(signatureFont)
                .status("SIGNED")
                .signedAt(LocalDateTime.now())
                .build();

        Signature savedSignature = signatureRepository.save(signature);
        document.setStatus(DocumentStatus.SIGNED);
        documentRepository.save(document);

        return savedSignature;
    }

    public List<Signature> getSignatureByDocument(Long documentId){
        return signatureRepository.findByDocumentId(documentId);
    }

    public Signature updateSignatureStatus(Long id, String status){
        Signature signature = signatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signature not found"));

        signature.setStatus(status);
        return signatureRepository.save(signature);
    }

    private User resolveSigner(Long userId, String signerEmail) {
        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseGet(() -> findByAuthenticatedEmail(signerEmail));
        }

        return findByAuthenticatedEmail(signerEmail);
    }

    private User findByAuthenticatedEmail(String signerEmail) {
        if (signerEmail == null || signerEmail.isBlank()) {
            throw new RuntimeException("Signer not found");
        }

        return userRepository.findByEmail(signerEmail)
                .orElseThrow(() -> new RuntimeException("Signer not found"));
    }
}
