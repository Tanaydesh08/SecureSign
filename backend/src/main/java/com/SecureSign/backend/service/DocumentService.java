package com.SecureSign.backend.service;

import com.SecureSign.backend.dto.DocumentResponse;
import com.SecureSign.backend.entity.Document;
import com.SecureSign.backend.entity.User;
import com.SecureSign.backend.enums.DocumentStatus;
import com.SecureSign.backend.repository.DocumentRepository;
import com.SecureSign.backend.repository.UserRepository;
import com.SecureSign.backend.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileUploadUtil fileUploadUtil;

    public DocumentResponse uploadDocument(
            String title,
            MultipartFile file,
            Long userId) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String fileName = fileUploadUtil.uploadFile(file);

        Document document = Document.builder()
                .title(title)
                .fileName(file.getOriginalFilename())
                .filePath(fileName)
                .status(DocumentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .owner(user)
                .build();

        Document savedDocument = documentRepository.save(document);

        return DocumentResponse.builder()
                .id(savedDocument.getId())
                .title(savedDocument.getTitle())
                .fileName(savedDocument.getFileName())
                .status(savedDocument.getStatus().name())
                .build();
    }

    public List<Document> getAllDocuments() {

        return documentRepository.findAll();

    }

    public Document getDocumentById(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

    }

    public void deleteDocument(Long id) {

        documentRepository.deleteById(id);

    }

}