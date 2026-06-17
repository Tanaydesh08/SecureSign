package com.SecureSign.backend.controller;

import com.SecureSign.backend.dto.DocumentResponse;
import com.SecureSign.backend.entity.Document;
import com.SecureSign.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse uploadDocument(
            @RequestParam("title") String title,
            @RequestParam("file")MultipartFile file,
            @RequestParam("userId") Long userId
            ) throws IOException{
        return documentService.uploadDocument(
                title,
                file,
                userId
        );
    }
    @GetMapping
    public List<Document> getAllDocuments(){
        return documentService.getAllDocuments();
    }
    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id){
        return documentService.getDocumentById(id);
    }
    @DeleteMapping("/{id}")
    public String deleteDocument(@PathVariable Long id){
        documentService.deleteDocument(id);
        return "Document Deleted Successfully";
    }
}