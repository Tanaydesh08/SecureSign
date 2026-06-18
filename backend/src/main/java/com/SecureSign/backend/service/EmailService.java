package com.SecureSign.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(
            String email,
            String otp
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("SecureSign OTP Verification");
        message.setText("Your OTP is : " + otp);
        mailSender.send(message);
    }
    public void sendInvitation(
            String email,
            String documentName
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Document Invitation");
        message.setText(
                "You have been invited to sign document : "
                        + documentName
        );
        mailSender.send(message);
    }
    public void sendSignedNotification(
            String email,
            String documentName
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Document Signed Successfully");
        message.setText(
                "Your document "
                        + documentName
                        + " has been signed successfully."
        );
        mailSender.send(message);
    }
}