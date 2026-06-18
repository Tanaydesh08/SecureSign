package com.SecureSign.backend.service;

import com.SecureSign.backend.entity.AuditLog;
import com.SecureSign.backend.entity.Document;
import com.SecureSign.backend.entity.User;
import com.SecureSign.backend.enums.AuditAction;
import com.SecureSign.backend.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditRepository auditRepository;

    public void saveLog(
            User user,
            Document document,
            AuditAction action,
            String ipAddress
    ){
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .document(document)
                .action(action)
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();
        auditRepository.save(auditLog);
    }
    public List<AuditLog> getLogs(Long documentId){
        return auditRepository.findByDocumentId(documentId);
    }
}