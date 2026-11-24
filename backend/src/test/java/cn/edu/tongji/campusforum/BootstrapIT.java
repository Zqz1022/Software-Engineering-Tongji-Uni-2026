package cn.edu.tongji.campusforum;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BootstrapIT {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;

    @BeforeEach
    @AfterEach
    void restoreFixtures() {
        jdbc.update("DELETE FROM SPRING_SESSION");
        jdbc.update("UPDATE app_user SET status = 'ACTIVE' WHERE id BETWEEN 1001 AND 1004");
        jdbc.update("UPDATE forum_board SET enabled = TRUE");
    }

    @Test
    void protectsDatabaseBackedResourcesAndDoesNotRedirectToHtmlLogin() throws Exception {
        mvc.perform(get("/api/v1/boards")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHENTICATED"));
        mvc.perform(get("/api/v1/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void refusesWriteWithoutCsrfAndInvalidFixtureIdentity() throws Exception {
        mvc.perform(post("/api/v1/dev/session").contentType("application/json")
                .content(json.writeValueAsString(Map.of("userId", 1001)))).andExpect(status().isForbidden());
        Csrf csrf = csrf(null);
        mvc.perform(post("/api/v1/dev/session").cookie(csrf.cookie())
                .header("X-CSRF-TOKEN", csrf.token()).contentType("application/json")
                .content(json.writeValueAsString(Map.of("userId", 1)))).andExpect(status().isBadRequest());
        mvc.perform(post("/api/v1/dev/session").cookie(csrf.cookie())
                .header("X-CSRF-TOKEN", csrf.token()).contentType("application/json")
                .content(json.writeValueAsString(Map.of("userId", 1001, "role", "ADMIN"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void persistsSessionRotatesIdAndReadsMigratedBoards() throws Exception {
        Csrf beforeLogin = csrf(null);
        Cookie session = login(beforeLogin, 1001);
        assertThat(session.getValue()).isNotEqualTo(beforeLogin.cookie().getValue());
        assertThat(session.isHttpOnly()).isTrue();
        mvc.perform(get("/api/v1/auth/me").cookie(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1001));
        mvc.perform(get("/api/v1/boards").cookie(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(4))
                .andExpect(jsonPath("$.items[0].code").value("team-up"));
        assertThat(jdbc.queryForObject(
                "SELECT COUNT(*) FROM SPRING_SESSION WHERE PRINCIPAL_NAME = '1001'", Integer.class))
                .isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM flyway_schema_history WHERE success = TRUE", Integer.class))
                .isGreaterThanOrEqualTo(3);
    }

    @Test
    void seesDatabaseChangesAndRejectsAccountsRestrictedAfterLogin() throws Exception {
        Cookie session = login(csrf(null), 1002);
        jdbc.update("UPDATE forum_board SET enabled = FALSE WHERE code = 'study'");
        mvc.perform(get("/api/v1/boards").cookie(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(3));
        jdbc.update("UPDATE app_user SET status = 'RESTRICTED' WHERE id = 1002");
        mvc.perform(get("/api/v1/boards").cookie(session)).andExpect(status().isForbidden());
        Csrf retry = csrf(null);
        mvc.perform(post("/api/v1/dev/session").cookie(retry.cookie())
                .header("X-CSRF-TOKEN", retry.token()).contentType("application/json")
                .content(json.writeValueAsString(Map.of("userId", 1002)))).andExpect(status().isForbidden());
    }

    @Test
    void invalidatesPersistentSessionOnLogout() throws Exception {
        Cookie session = login(csrf(null), 1003);
        Csrf csrf = csrf(session);
        mvc.perform(post("/api/v1/auth/logout").cookie(session)
                .header("X-CSRF-TOKEN", csrf.token())).andExpect(status().isNoContent());
        mvc.perform(get("/api/v1/boards").cookie(session)).andExpect(status().isUnauthorized());
        assertThat(jdbc.queryForObject(
                "SELECT COUNT(*) FROM SPRING_SESSION WHERE PRINCIPAL_NAME = '1003'", Integer.class))
                .isZero();
    }

    @Test
    void rejectsOldCsrfTokenAfterLogin() throws Exception {
        Csrf before = csrf(null);
        Cookie session = login(before, 1004);
        mvc.perform(post("/api/v1/auth/logout").cookie(session)
                .header("X-CSRF-TOKEN", before.token())).andExpect(status().isForbidden());
    }

    private Csrf csrf(Cookie session) throws Exception {
        var request = get("/api/v1/auth/csrf");
        if (session != null) request.cookie(session);
        MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
        Cookie cookie = result.getResponse().getCookie("SESSION");
        return new Csrf(cookie == null ? session : cookie,
                json.readTree(result.getResponse().getContentAsString()).get("token").asText());
    }

    private Cookie login(Csrf csrf, int userId) throws Exception {
        MvcResult result = mvc.perform(post("/api/v1/dev/session").cookie(csrf.cookie())
                .header("X-CSRF-TOKEN", csrf.token()).contentType("application/json")
                .content(json.writeValueAsString(Map.of("userId", userId))))
                .andExpect(status().isOk()).andReturn();
        Cookie session = result.getResponse().getCookie("SESSION");
        assertThat(session).isNotNull();
        return session;
    }

    private record Csrf(Cookie cookie, String token) {}
}
