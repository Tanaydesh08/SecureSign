package com.SecureSign.backend.repository;

import com.SecureSign.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByDocumentId(Long documentId);
}