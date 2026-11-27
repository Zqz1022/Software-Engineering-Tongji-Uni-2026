package cn.edu.tongji.campusforum.auth;

import cn.edu.tongji.campusforum.user.UserAccount;
import cn.edu.tongji.campusforum.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfAuthenticationStrategy;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile({"dev", "test"})
@ConditionalOnProperty(name = "app.dev-login.enabled", havingValue = "true")
public class DevSessionController {
    private final UserService users;
    private final SecurityContextRepository contexts;
    private final CsrfTokenRepository csrfTokens;

    public DevSessionController(UserService users, SecurityContextRepository contexts,
            CsrfTokenRepository csrfTokens) {
        this.users = users;
        this.contexts = contexts;
        this.csrfTokens = csrfTokens;
    }

    @PostMapping("/api/v1/dev/session")
    public UserAccount login(@Valid @RequestBody LoginRequest input,
            HttpServletRequest request, HttpServletResponse response) {
        UserAccount user = users.requireActive(input.userId());
        var authentication = UsernamePasswordAuthenticationToken.authenticated(
                Long.toString(user.id()), null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        new ChangeSessionIdAuthenticationStrategy().onAuthentication(authentication, request, response);
        new CsrfAuthenticationStrategy(csrfTokens).onAuthentication(authentication, request, response);
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contexts.saveContext(context, request, response);
        return user;
    }

    public record LoginRequest(@NotNull @Min(1001) @Max(1004) Long userId) {}
}
