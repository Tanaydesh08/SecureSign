package com.SecureSign.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SchemaRepairRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        repairSignatureDocumentForeignKey();
    }

    private void repairSignatureDocumentForeignKey() {
        List<Map<String, Object>> foreignKeys = jdbcTemplate.queryForList("""
            SELECT tc.constraint_name, ccu.table_name AS referenced_table, kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
             AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
              ON ccu.constraint_name = tc.constraint_name
             AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_name = 'signatures'
              AND kcu.column_name = 'document_id'
            """);

        boolean hasCorrectFk = foreignKeys.stream()
                .anyMatch(row -> "documents".equalsIgnoreCase(String.valueOf(row.get("referenced_table"))));

        if (!foreignKeys.isEmpty()) {
            foreignKeys.stream()
                    .filter(row -> !"documents".equalsIgnoreCase(String.valueOf(row.get("referenced_table"))))
                    .map(row -> String.valueOf(row.get("constraint_name")))
                    .forEach(this::dropConstraint);
        }

        if (!hasCorrectFk) {
            jdbcTemplate.execute("""
                ALTER TABLE signatures
                ADD CONSTRAINT fk_signatures_document
                FOREIGN KEY (document_id)
                REFERENCES documents(id)
                """);
        }
    }

    private void dropConstraint(String constraintName) {
        jdbcTemplate.execute("ALTER TABLE signatures DROP CONSTRAINT IF EXISTS " + constraintName);
    }
}
