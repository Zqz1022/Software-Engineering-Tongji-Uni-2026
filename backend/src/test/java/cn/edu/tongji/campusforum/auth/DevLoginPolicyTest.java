package cn.edu.tongji.campusforum.auth;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Set;
import org.junit.jupiter.api.Test;

class DevLoginPolicyTest {
    @Test
    void permitsExplicitDevelopmentAndTestProfiles() {
        assertThatCode(() -> DevLoginPolicy.validate(Set.of("dev"), true)).doesNotThrowAnyException();
        assertThatCode(() -> DevLoginPolicy.validate(Set.of("test"), true)).doesNotThrowAnyException();
        assertThatCode(() -> DevLoginPolicy.validate(Set.of("prod"), false)).doesNotThrowAnyException();
    }

    @Test
    void rejectsMockLoginOutsideDevelopment() {
        assertThatThrownBy(() -> DevLoginPolicy.validate(Set.of("prod"), true))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> DevLoginPolicy.validate(Set.of(), true))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void rejectsMixedProfilesEvenWhenMockLoginIsDisabled() {
        assertThatThrownBy(() -> DevLoginPolicy.validate(Set.of("prod", "dev"), false))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> DevLoginPolicy.validate(Set.of("prod", "test"), false))
                .isInstanceOf(IllegalStateException.class);
    }
}
