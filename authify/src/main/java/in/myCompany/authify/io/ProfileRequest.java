package in.myCompany.authify.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {

    @NotBlank(message = "Name Should be not empty")
    private String name;
    @Email(message = "Enter valued email address")
    @NotNull(message = "Email should be not empty")
    private String email;
    @Size(min = 6,message = "password must be at latest 6 char")
    private String password;
}
