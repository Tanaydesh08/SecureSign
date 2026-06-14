package com.SecureSign.backend.repository;

import com.SecureSign.backend.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignatureRepository extends JpaRepository<Signature, Long> {
    List<Signature> findByDocumentId(Long documentId);
}
