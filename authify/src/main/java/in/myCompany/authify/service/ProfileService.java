package in.myCompany.authify.service;

import in.myCompany.authify.io.ProfileRequest;
import in.myCompany.authify.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfile(String email);

    void sendResentOtp(String email);

    void resetPassword(String email,String otp,String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email, String otp);


}
