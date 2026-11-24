package cn.edu.tongji.campusforum.auth;

import cn.edu.tongji.campusforum.common.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {
    // Runs before Flyway and other regular beans, so mixed prod/dev cannot seed fixture data.
    @Bean
    static BeanFactoryPostProcessor validateEnvironment(Environment environment) {
        return beanFactory -> DevLoginPolicy.validate(
                Set.of(environment.getActiveProfiles()),
                environment.getProperty("app.dev-login.enabled", Boolean.class, false));
    }

    @Bean
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    CsrfTokenRepository csrfTokenRepository() {
        return new HttpSessionCsrfTokenRepository();
    }

    @Bean
    CookieSerializer sessionCookieSerializer(
            @Value("${server.servlet.session.cookie.secure:false}") boolean secure) {
        var serializer = new DefaultCookieSerializer();
        serializer.setCookieName("SESSION");
        serializer.setCookiePath("/");
        serializer.setUseHttpOnlyCookie(true);
        serializer.setUseSecureCookie(secure);
        serializer.setSameSite("Lax");
        return serializer;
    }

    @Bean
    UserDetailsService disablePasswordAccounts() {
        return username -> {
            throw new UsernameNotFoundException("Password login is not supported");
        };
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper json,
            SecurityContextRepository contextRepository, CsrfTokenRepository csrfRepository) throws Exception {
        return http
                .authorizeHttpRequests(rules -> rules
                        .requestMatchers(HttpMethod.GET, "/actuator/health", "/api/v1/auth/csrf",
                                "/api/v1/auth/options").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/dev/session").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.csrfTokenRepository(csrfRepository))
                .securityContext(context -> context.securityContextRepository(contextRepository))
                .requestCache(cache -> cache.disable())
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) ->
                                writeError(json, response, 401, "UNAUTHENTICATED", "请先登录"))
                        .accessDeniedHandler((request, response, exception) ->
                                writeError(json, response, 403, "FORBIDDEN", "请求被拒绝，请刷新后重试")))
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("SESSION")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(204)))
                .build();
    }

    private static void writeError(ObjectMapper json, HttpServletResponse response,
            int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        json.writeValue(response.getOutputStream(), new ApiError(code, message, status));
    }
}
