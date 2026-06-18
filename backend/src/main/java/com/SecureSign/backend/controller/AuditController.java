package com.SecureSign.backend.controller;

import com.SecureSign.backend.entity.AuditLog;
import com.SecureSign.backend.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/aduit")
@RequiredArgsConstructor
public class AuditController {
    private final AuditService auditService;

    @GetMapping("/{documentId}")
    public List<AuditLog> getLogs(@PathVariable Long documentId){
        return auditService.getLogs(documentId);
    }
}
