package in.myCompany.authify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail,String name){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to our plate from");
        message.setText("Hello "+name+",\n\nThanks for registering with us!\n\nRegards,\nAuthify Team");
        mailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail,String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("password Reset OTP");
        message.setText("Your OTP for resetting password is " +otp+ ". Don't share this OTP to anyone ");
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail,String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account verification OTP");
        message.setText("Your Account verification OTP is" +otp+ ". Don't share this OTP to anyone ");
        mailSender.send(message);
    }

}
