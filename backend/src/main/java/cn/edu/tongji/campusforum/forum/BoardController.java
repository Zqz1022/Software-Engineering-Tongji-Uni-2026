package cn.edu.tongji.campusforum.forum;

import cn.edu.tongji.campusforum.user.UserService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {
    private final BoardMapper boards;
    private final UserService users;

    public BoardController(BoardMapper boards, UserService users) {
        this.boards = boards;
        this.users = users;
    }

    @GetMapping
    public BoardList list(Principal principal) {
        users.requireActive(Long.parseLong(principal.getName()));
        return new BoardList(boards.findEnabled());
    }

    public record BoardList(List<Board> items) {}
}
