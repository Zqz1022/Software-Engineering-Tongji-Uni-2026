package cn.edu.tongji.campusforum.user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    @Select("SELECT id, display_name, status FROM app_user WHERE id = #{id}")
    UserAccount findById(long id);
}
