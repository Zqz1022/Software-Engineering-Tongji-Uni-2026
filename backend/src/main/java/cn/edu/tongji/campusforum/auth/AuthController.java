package cn.edu.tongji.campusforum.auth;

import cn.edu.tongji.campusforum.user.UserAccount;
import cn.edu.tongji.campusforum.user.UserService;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserService users;
    private final boolean devLoginEnabled;

    public AuthController(UserService users, @Value("${app.dev-login.enabled:false}") boolean devLoginEnabled) {
        this.users = users;
        this.devLoginEnabled = devLoginEnabled;
    }

    @GetMapping("/options")
    public LoginOptions options() {
        return new LoginOptions(devLoginEnabled);
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken token) {
        return new CsrfResponse(token.getHeaderName(), token.getToken());
    }

    @GetMapping("/me")
    public UserAccount me(Principal principal) {
        return users.requireActive(Long.parseLong(principal.getName()));
    }

    public record LoginOptions(boolean devLoginEnabled) {}
    public record CsrfResponse(String headerName, String token) {}
}
