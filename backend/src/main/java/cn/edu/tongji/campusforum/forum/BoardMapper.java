package cn.edu.tongji.campusforum.forum;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BoardMapper {
    @Select("SELECT id, code, name, description FROM forum_board WHERE enabled = TRUE ORDER BY sort_order, id")
    List<Board> findEnabled();
}
