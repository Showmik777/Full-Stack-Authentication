package in.myCompany.authify.service;

import in.myCompany.authify.entity.UserEntity;
import in.myCompany.authify.io.ProfileRequest;
import in.myCompany.authify.io.ProfileResponse;
import in.myCompany.authify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class PublicServiceImp implements ProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToUserEntity(request); // try with modelMapper
        if(!userRepository.existsByEmail(request.getEmail())){
            newProfile = userRepository.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");


    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"+email));

        return convertToProfileResponse(userEntity);
    }

    @Override
    public void sendResentOtp(String email) {
        UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found :"+email));
        //Generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(10000,100000));

        //calculate expiry time (current time + 10 minutes )
        Long expiryTime = System.currentTimeMillis()+(10 * 60 * 1000);

        //update the profile/user
        existingEntity.setRestOtp(otp);
        existingEntity.setRestOtpExpireAt(expiryTime);

        //save into the database
        userRepository.save(existingEntity);

        try{
           emailService.sendResetOtpEmail(existingEntity.getEmail(),otp);

        }catch (Exception e){
            throw new RuntimeException("unable to send email");
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found :"+email));
        if(existingEntity.getRestOtp() == null || !existingEntity.getRestOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(existingEntity.getRestOtpExpireAt()<System.currentTimeMillis()){
            throw new RuntimeException("OTP Expired");
        }

        existingEntity.setPassword(passwordEncoder.encode(newPassword));
        existingEntity.setRestOtp(null);
        existingEntity.setRestOtpExpireAt(0L);

        userRepository.save(existingEntity);
    }

    @Override
    public void sendOtp(String email) {

        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User is not found: "+email));
        if(existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()){
            return;
        }
        //generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(10000,100000));

        //calculate expiry time (current time +  1 hours )
        Long expiryTime = System.currentTimeMillis()+(60 * 60 * 1000);

        //update
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);

        userRepository.save(existingUser);

        try{
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        }catch (Exception e){
            throw new RuntimeException("Unable to send otp");
        }

    }

    @Override
    public void verifyOtp(String email, String otp) {

        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User is not found"+email));

        if(existingUser.getVerifyOtp() == null ||  !existingUser.getVerifyOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepository.save(existingUser);
    }


    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
        return ProfileResponse.builder().name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();

    }

    private UserEntity convertToUserEntity(ProfileRequest request) {
         return  UserEntity.builder().email(request.getEmail())
                 .userId(UUID.randomUUID().toString())
                 .name(request.getName())
                 .password(passwordEncoder.encode(request.getPassword()))
                 .isAccountVerified(false)
                 .restOtpExpireAt(0L)
                 .verifyOtp(null)
                 .verifyOtpExpireAt(0L)
                 .restOtp(null)
                 .build();
    }
}
