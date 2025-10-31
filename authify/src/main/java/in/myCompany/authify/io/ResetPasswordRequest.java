package in.myCompany.authify.io;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "OTP is required")
    @Size(min = 6)
   private String newPassword;
    @NotBlank(message = "OTP is required")
   private String otp;
   @NotBlank(message = "Email is required")
   private String email;

}
