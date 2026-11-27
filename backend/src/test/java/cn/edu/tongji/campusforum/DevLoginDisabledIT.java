package cn.edu.tongji.campusforum;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "app.dev-login.enabled=false")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DevLoginDisabledIT {
    @Autowired MockMvc mvc;

    @Test
    void removesTheDevelopmentEndpointWhenDisabled() throws Exception {
        mvc.perform(get("/api/v1/auth/options")).andExpect(status().isOk())
                .andExpect(jsonPath("$.devLoginEnabled").value(false));
        mvc.perform(post("/api/v1/dev/session").with(csrf())
                .contentType("application/json").content("{}"))
                .andExpect(status().isNotFound());
    }
}
