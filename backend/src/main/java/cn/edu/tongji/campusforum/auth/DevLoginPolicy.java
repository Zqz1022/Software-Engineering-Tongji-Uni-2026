package cn.edu.tongji.campusforum.auth;

import java.util.Set;

public final class DevLoginPolicy {
    private DevLoginPolicy() {}

    public static void validate(Set<String> profiles, boolean enabled) {
        boolean development = profiles.contains("dev") || profiles.contains("test");
        if (profiles.contains("prod") && development) {
            throw new IllegalStateException("prod cannot be combined with dev/test profiles");
        }
        if (enabled && (!development || profiles.contains("prod"))) {
            throw new IllegalStateException("Development login is only allowed in dev/test");
        }
    }
}
