package in.myCompany.authify.controler;

import in.myCompany.authify.io.ProfileRequest;
import in.myCompany.authify.io.ProfileResponse;
import in.myCompany.authify.service.EmailService;
import in.myCompany.authify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor

public class ProfileControler {

    private final ProfileService publicService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request){

        ProfileResponse response = publicService.createProfile(request);
        emailService.sendWelcomeEmail(response.getEmail(),response.getName());
        return response;

    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email){
        return publicService.getProfile(email);
    }

}
