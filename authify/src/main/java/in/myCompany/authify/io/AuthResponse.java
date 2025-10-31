package in.myCompany.authify.io;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthResponse {

    private String email;
    private String token;
}

