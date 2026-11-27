package cn.edu.tongji.campusforum.user;

public record UserAccount(long id, String displayName, String status) {
    public boolean active() {
        return "ACTIVE".equals(status);
    }
}
