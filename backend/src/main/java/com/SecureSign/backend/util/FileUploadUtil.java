package com.SecureSign.backend.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {
    private static final String UPLOAD_DIR = "uploads/";
    public String uploadFile(MultipartFile file) throws IOException{
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Files.copy(file.getInputStream(),
                uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
}