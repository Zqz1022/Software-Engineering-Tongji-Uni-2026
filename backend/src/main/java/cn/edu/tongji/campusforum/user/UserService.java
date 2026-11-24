package cn.edu.tongji.campusforum.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserMapper users;

    public UserService(UserMapper users) {
        this.users = users;
    }

    public UserAccount requireActive(long id) {
        UserAccount user = users.findById(id);
        if (user == null || !user.active()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "账号不可用");
        }
        return user;
    }
}
